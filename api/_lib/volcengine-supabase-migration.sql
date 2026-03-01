-- =========================================================
-- Supabase Migration: Add endpoint_id and voice_id to avatars
-- Run in Supabase SQL Editor
-- =========================================================

-- 1. Add columns to avatars table (safe / idempotent)
ALTER TABLE public.avatars
  ADD COLUMN IF NOT EXISTS endpoint_id TEXT DEFAULT 'ep-20260227141439-xhmgx',
  ADD COLUMN IF NOT EXISTS voice_id    TEXT DEFAULT 'bv001_streaming';

COMMENT ON COLUMN public.avatars.endpoint_id IS 'Volcengine Ark Endpoint ID. lover/companion/pet → character-250228, others → Doubao-1.5-pro';
COMMENT ON COLUMN public.avatars.voice_id    IS 'Volcengine TTS voice ID. bv001=灿灿(female), bv002=阿虎(male), bv034=温暖老师';

-- 2. Preset values for known avatar types
UPDATE public.avatars
  SET endpoint_id = 'ep-20260301085951-n2cwt', voice_id = 'bv001_streaming'
  WHERE type IN ('lover', 'companion', 'pet')
    AND endpoint_id IS NULL OR endpoint_id = 'ep-20260227141439-xhmgx';

UPDATE public.avatars
  SET endpoint_id = 'ep-20260227141439-xhmgx', voice_id = 'bv034_streaming'
  WHERE type IN ('senior', 'mental')
    AND endpoint_id IS NULL OR endpoint_id = 'ep-20260227141439-xhmgx';

-- 3. View result
SELECT id, name, type, endpoint_id, voice_id FROM public.avatars LIMIT 20;
