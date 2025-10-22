-- Create settings_audit table for tracking all settings changes
CREATE TABLE IF NOT EXISTS public.settings_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  key_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('reveal', 'update')),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings_audit ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view audit logs
CREATE POLICY "Admins can view all audit logs"
ON public.settings_audit
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for performance
CREATE INDEX idx_settings_audit_user_id ON public.settings_audit(user_id);
CREATE INDEX idx_settings_audit_key_name ON public.settings_audit(key_name);
CREATE INDEX idx_settings_audit_created_at ON public.settings_audit(created_at DESC);