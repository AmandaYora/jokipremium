-- Remove analytics-related settings
DELETE FROM public.settings WHERE key IN ('ANALYTICS_KEY', 'ANALYTICS_ALLOW_ORIGIN');

-- Drop analytics tables
DROP TABLE IF EXISTS public.analytics_section_focus CASCADE;
DROP TABLE IF EXISTS public.analytics_pageviews CASCADE;
DROP TABLE IF EXISTS public.analytics_sessions CASCADE;