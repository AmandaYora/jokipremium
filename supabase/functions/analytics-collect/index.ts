import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-analytics-key',
};

interface LocationData {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

async function getIPLocation(ip: string): Promise<LocationData> {
  const provider = Deno.env.get('IP_GEO_PROVIDER') || '';
  const apiKey = Deno.env.get('IP_GEO_API_KEY') || '';
  
  console.log(`[IP Geolocation] Provider: ${provider || 'free fallback'}, IP: ${ip}`);
  
  try {
    // ipdata.co provider
    if (provider === 'ipdata' && apiKey) {
      const response = await fetch(`https://api.ipdata.co/${ip}?api-key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`ipdata API error: ${response.status}`);
      }
      const data = await response.json();
      console.log('[IP Geolocation] ipdata.co result:', { 
        country: data.country_name, 
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude 
      });
      return {
        country: data.country_name,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
    
    // ipapi.co provider (paid)
    if (provider === 'ipapi' && apiKey) {
      const response = await fetch(`https://ipapi.co/${ip}/json/?key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`ipapi.co API error: ${response.status}`);
      }
      const data = await response.json();
      console.log('[IP Geolocation] ipapi.co result:', { 
        country: data.country_name, 
        city: data.city 
      });
      return {
        country: data.country_name,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
    
    // ipgeolocation.io provider
    if (provider === 'ipgeolocation' && apiKey) {
      const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`);
      if (!response.ok) {
        throw new Error(`ipgeolocation.io API error: ${response.status}`);
      }
      const data = await response.json();
      console.log('[IP Geolocation] ipgeolocation.io result:', { 
        country: data.country_name, 
        city: data.city 
      });
      return {
        country: data.country_name,
        region: data.state_prov,
        city: data.city,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
    }
    
    // Fallback to free ipapi.co without key
    console.log('[IP Geolocation] Using free ipapi.co fallback');
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      throw new Error(`Free ipapi.co error: ${response.status}`);
    }
    const data = await response.json();
    console.log('[IP Geolocation] Free fallback result:', { 
      country: data.country_name, 
      city: data.city 
    });
    return {
      country: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
    };
  } catch (error) {
    console.error('[IP Geolocation] Error:', error);
    return {
      country: 'Unknown',
      region: 'Unknown',
      city: 'Unknown',
      latitude: 0,
      longitude: 0,
    };
  }
}

function getNetworkPrefix(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    // IPv4 /24
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  }
  // IPv6 /48 (simplified)
  const v6Parts = ip.split(':');
  if (v6Parts.length >= 3) {
    return `${v6Parts[0]}:${v6Parts[1]}:${v6Parts[2]}::/48`;
  }
  return ip;
}

async function hashVisitorId(ip: string, userAgent: string): Promise<string> {
  const salt = Deno.env.get('ANALYTICS_SALT') || '';
  const data = `${salt}${ip}${userAgent}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify analytics key (if configured)
    const analyticsKey = req.headers.get('x-analytics-key');
    const expectedKey = Deno.env.get('ANALYTICS_KEY');
    
    if (expectedKey && analyticsKey !== expectedKey) {
      console.error('[Analytics] Unauthorized: Invalid or missing analytics key');
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid analytics key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('[Analytics] Request authorized');

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract client IP
    const clientIP = 
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      '0.0.0.0';

    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const visitorId = await hashVisitorId(clientIP, userAgent);
    const networkPrefix = getNetworkPrefix(clientIP);

    const payload = await req.json();
    const { type, mode, lat, lon, accuracy, path, referrer, utm_source, utm_medium, utm_campaign, section_id, delta_ms } = payload;
    
    console.log(`[Analytics] Event type: ${type}, path: ${path || 'N/A'}, section: ${section_id || 'N/A'}`);

    let locationData: LocationData;
    let isPrecise = false;
    let locationSource = 'ip';

    // Handle GPS or IP location
    if (mode === 'gps' && lat && lon) {
      locationData = {
        latitude: lat,
        longitude: lon,
      };
      isPrecise = true;
      locationSource = 'gps';

      // Reverse geocode GPS to get country/region/city (optional - simplified)
      const ipLocation = await getIPLocation(clientIP);
      locationData = { ...ipLocation, latitude: lat, longitude: lon };
    } else {
      locationData = await getIPLocation(clientIP);
      isPrecise = false;
      locationSource = 'ip';
    }

    // Upsert or get session
    const { data: existingSession } = await supabase
      .from('analytics_sessions')
      .select('id')
      .eq('visitor_id', visitorId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let sessionId = existingSession?.id;

    if (!sessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('analytics_sessions')
        .insert({
          visitor_id: visitorId,
          network_prefix: networkPrefix,
          user_agent: userAgent,
          country: locationData.country,
          region: locationData.region,
          city: locationData.city,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          is_precise: isPrecise,
          location_source: locationSource,
        })
        .select('id')
        .single();

      if (sessionError) {
        console.error('[Analytics] Session insert error:', sessionError);
        throw sessionError;
      }
      sessionId = newSession.id;
      console.log(`[Analytics] Created new session: ${sessionId}`);
    }

    // Handle pageview event
    if (type === 'pageview') {
      const { error: pageviewError } = await supabase
        .from('analytics_pageviews')
        .insert({
          session_id: sessionId,
          path: path || '/',
          referrer: referrer || null,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          is_precise: isPrecise,
          location_source: locationSource,
        });

      if (pageviewError) {
        console.error('[Analytics] Pageview insert error:', pageviewError);
        throw pageviewError;
      }
      console.log(`[Analytics] Pageview recorded: ${path}`);
    }

    // Handle section_focus event
    if (type === 'section_focus' && section_id && delta_ms) {
      const focusDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      // Try to update existing record
      const { data: existing } = await supabase
        .from('analytics_section_focus')
        .select('focus_ms, samples')
        .eq('session_id', sessionId)
        .eq('section_id', section_id)
        .eq('focus_date', focusDate)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase
          .from('analytics_section_focus')
          .update({
            focus_ms: existing.focus_ms + delta_ms,
            samples: existing.samples + 1,
          })
          .eq('session_id', sessionId)
          .eq('section_id', section_id)
          .eq('focus_date', focusDate);

        if (updateError) {
          console.error('[Analytics] Section focus update error:', updateError);
          throw updateError;
        }
        console.log(`[Analytics] Section focus updated: ${section_id}`);
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('analytics_section_focus')
          .insert({
            session_id: sessionId,
            section_id,
            focus_ms: delta_ms,
            samples: 1,
            focus_date: focusDate,
          });

        if (insertError) {
          console.error('[Analytics] Section focus insert error:', insertError);
          throw insertError;
        }
        console.log(`[Analytics] Section focus created: ${section_id}`);
      }
    }

    console.log(`[Analytics] Successfully processed ${type} event`);
    
    return new Response(
      JSON.stringify({
        ok: true,
        resolved_location: {
          city: locationData.city,
          region: locationData.region,
          country: locationData.country,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          is_precise: isPrecise,
          source: locationSource,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Analytics] Collection error:', error);
    console.error('[Analytics] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
