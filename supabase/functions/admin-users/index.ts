import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      throw new Error('Forbidden: Admin access required');
    }

    const { action, ...params } = await req.json();

    switch (action) {
      case 'getUserById': {
        const { data, error } = await supabase.auth.admin.getUserById(params.userId);
        if (error) throw error;
        return new Response(JSON.stringify({ user: data.user }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'createUser': {
        const { email, password, userData } = params;
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: userData,
        });
        if (error) throw error;

        // Add admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'admin',
          });

        if (roleError) throw roleError;

        return new Response(JSON.stringify({ user: data.user }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'updateUserById': {
        const { userId, updates } = params;
        const { data, error } = await supabase.auth.admin.updateUserById(userId, updates);
        if (error) throw error;
        return new Response(JSON.stringify({ user: data.user }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'deleteUser': {
        const { userId } = params;
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Admin users function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        status: error instanceof Error && error.message.includes('Forbidden') ? 403 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
