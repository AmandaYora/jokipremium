import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple encryption using base64 + salt (for demo - use proper encryption in production)
const encryptValue = (value: string): string => {
  const salt = Deno.env.get('ANALYTICS_SALT') || 'default-salt';
  return btoa(salt + ':' + value);
};

const decryptValue = (encrypted: string): string => {
  try {
    const decoded = atob(encrypted);
    const salt = Deno.env.get('ANALYTICS_SALT') || 'default-salt';
    return decoded.replace(salt + ':', '');
  } catch {
    return encrypted; // Return as-is if not encrypted
  }
};

const SENSITIVE_KEYS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'IP_GEO_API_KEY'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify admin role
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, key_name, key_value } = await req.json();

    if (action === 'get_settings') {
      // Get all settings and mask sensitive ones
      const { data: settings, error } = await supabase
        .from('settings')
        .select('key, value')
        .order('key');

      if (error) throw error;

      const maskedSettings = settings?.map(setting => {
        const isSensitive = SENSITIVE_KEYS.includes(setting.key);
        return {
          key: setting.key,
          value: isSensitive ? '••••••••••••••••' : setting.value,
          is_sensitive: isSensitive,
        };
      }) || [];

      return new Response(JSON.stringify({ settings: maskedSettings }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'reveal_value') {
      // Reveal actual value of a sensitive key
      const { data: setting, error } = await supabase
        .from('settings')
        .select('key, value')
        .eq('key', key_name)
        .single();

      if (error) throw error;

      const isSensitive = SENSITIVE_KEYS.includes(key_name);
      const actualValue = isSensitive ? decryptValue(setting.value) : setting.value;

      // Log audit
      await supabase.from('settings_audit').insert({
        user_id: user.id,
        key_name,
        action: 'reveal',
        old_value: null,
        new_value: null,
      });

      return new Response(JSON.stringify({ value: actualValue }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update_setting') {
      // Get old value for audit
      const { data: oldSetting } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key_name)
        .single();

      const isSensitive = SENSITIVE_KEYS.includes(key_name);
      const valueToStore = isSensitive ? encryptValue(key_value) : key_value;

      // Update setting
      const { error: updateError } = await supabase
        .from('settings')
        .update({ value: valueToStore, updated_at: new Date().toISOString() })
        .eq('key', key_name);

      if (updateError) {
        // Try insert if update failed (key doesn't exist)
        const { error: insertError } = await supabase
          .from('settings')
          .insert({ key: key_name, value: valueToStore });

        if (insertError) throw insertError;
      }

      // Log audit
      await supabase.from('settings_audit').insert({
        user_id: user.id,
        key_name,
        action: 'update',
        old_value: oldSetting?.value || null,
        new_value: isSensitive ? '[encrypted]' : key_value,
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Settings manager error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
