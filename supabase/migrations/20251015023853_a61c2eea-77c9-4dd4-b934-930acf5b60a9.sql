-- Create analytics tables for tracking & analytics
-- 1. Analytics Sessions Table
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  network_prefix TEXT,
  user_agent TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  is_precise BOOLEAN DEFAULT false,
  location_source TEXT DEFAULT 'ip' CHECK (location_source IN ('gps', 'ip')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for analytics_sessions
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_created_at ON public.analytics_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_visitor_id ON public.analytics_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_network_prefix ON public.analytics_sessions(network_prefix);

-- Enable RLS
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Analytics Pageviews Table
CREATE TABLE IF NOT EXISTS public.analytics_pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  is_precise BOOLEAN,
  location_source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for analytics_pageviews
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_created_at ON public.analytics_pageviews(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_path ON public.analytics_pageviews(path);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_session_id ON public.analytics_pageviews(session_id);

-- Enable RLS
ALTER TABLE public.analytics_pageviews ENABLE ROW LEVEL SECURITY;

-- 3. Analytics Section Focus Table
CREATE TABLE IF NOT EXISTS public.analytics_section_focus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  focus_ms INTEGER NOT NULL CHECK (focus_ms >= 0),
  samples INTEGER NOT NULL DEFAULT 0,
  focus_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (session_id, section_id, focus_date)
);

-- Indexes for analytics_section_focus
CREATE INDEX IF NOT EXISTS idx_analytics_section_focus_created_at ON public.analytics_section_focus(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_section_focus_session_id ON public.analytics_section_focus(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_section_focus_date ON public.analytics_section_focus(focus_date);

-- Enable RLS
ALTER TABLE public.analytics_section_focus ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admin can read, service role can write
CREATE POLICY "Admins can view all analytics sessions"
  ON public.analytics_sessions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all analytics pageviews"
  ON public.analytics_pageviews FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all analytics section focus"
  ON public.analytics_section_focus FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));