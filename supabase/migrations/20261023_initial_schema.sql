-- ==============================================================================
-- SAFARI DO LUCCA — MIGRATION 20261023
-- Schema, RLS, Indexes, and Default Seed Data
-- ==============================================================================

-- 1. EVENT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.event_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_event',
  child_name TEXT NOT NULL DEFAULT 'Lucca',
  event_title TEXT NOT NULL DEFAULT 'Safari do Lucca',
  event_subtitle TEXT NOT NULL DEFAULT 'Uma Grande Aventura • 1 Aninho',
  event_date TIMESTAMPTZ NOT NULL DEFAULT '2026-12-12 16:00:00-03',
  event_time_display TEXT NOT NULL DEFAULT 'Início às 16:00h',
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  venue_name TEXT NOT NULL DEFAULT 'Espaço Safari Encantado',
  venue_address TEXT NOT NULL DEFAULT 'Av. das Palmeiras, 1500 - Jardim Primavera, São Paulo - SP',
  maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Av.+das+Palmeiras,+1500+-+Jardim+Primavera,+São+Paulo+-+SP',
  intro_message TEXT NOT NULL DEFAULT 'Há um ano, começou a aventura mais linda das nossas vidas. Agora, chegou a hora de celebrar o primeiro aninho do nosso pequeno explorador!',
  closing_message TEXT NOT NULL DEFAULT 'Esperamos você e sua família para viver essa grande aventura com a gente! Com muito amor, Lucca e Papais.',
  rsvp_deadline DATE NOT NULL DEFAULT '2026-12-01',
  max_companions INT NOT NULL DEFAULT 4,
  audio_url TEXT DEFAULT '/musica.mp3',
  audio_title TEXT DEFAULT 'Aventura no Safari',
  show_countdown BOOLEAN NOT NULL DEFAULT TRUE,
  show_messages BOOLEAN NOT NULL DEFAULT TRUE,
  show_location BOOLEAN NOT NULL DEFAULT TRUE,
  show_rsvp BOOLEAN NOT NULL DEFAULT TRUE,
  messages_require_moderation BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Policies for event_settings
DROP POLICY IF EXISTS "Public can view event settings" ON public.event_settings;
CREATE POLICY "Public can view event settings"
  ON public.event_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can update event settings" ON public.event_settings;
CREATE POLICY "Admin can update event settings"
  ON public.event_settings
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);


-- 2. RSVPS (GUEST CONFIRMATION) TABLE
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  companions_count INT NOT NULL DEFAULT 0,
  companion_names JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance & search
CREATE INDEX IF NOT EXISTS idx_rsvps_guest_name ON public.rsvps (guest_name);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON public.rsvps (attending);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps (created_at DESC);

-- Enable RLS
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Policies for rsvps
-- IMPORTANT: Anonymous visitors CANNOT SELECT the entire guest list (privacy guarantee!)
DROP POLICY IF EXISTS "Public can submit RSVP" ON public.rsvps;
CREATE POLICY "Public can submit RSVP"
  ON public.rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(guest_name)) >= 2 AND
    companions_count >= 0
  );

DROP POLICY IF EXISTS "Authenticated admin has full access to RSVPs" ON public.rsvps;
CREATE POLICY "Authenticated admin has full access to RSVPs"
  ON public.rsvps
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- 3. GUEST MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.guest_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  relationship TEXT DEFAULT 'Amigo(a) da Família',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
  animal_avatar TEXT NOT NULL DEFAULT 'lion',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.guest_messages (status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.guest_messages (created_at DESC);

-- Enable RLS
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;

-- Policies for guest_messages
-- Public can ONLY read messages that are marked as 'approved'
DROP POLICY IF EXISTS "Public can view approved messages" ON public.guest_messages;
CREATE POLICY "Public can view approved messages"
  ON public.guest_messages
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Public can submit messages (defaulting to pending status)
DROP POLICY IF EXISTS "Public can insert message" ON public.guest_messages;
CREATE POLICY "Public can insert message"
  ON public.guest_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(author_name)) >= 2 AND
    char_length(trim(message)) >= 3 AND
    char_length(message) <= 500
  );

-- Admin can moderate, view all, and delete messages
DROP POLICY IF EXISTS "Admin has full access to guest messages" ON public.guest_messages;
CREATE POLICY "Admin has full access to guest messages"
  ON public.guest_messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- 4. INSERT INITIAL DEFAULT SETTINGS (IDEMPOTENT)
INSERT INTO public.event_settings (
  id,
  child_name,
  event_title,
  event_subtitle,
  event_date,
  event_time_display,
  timezone,
  venue_name,
  venue_address,
  maps_url,
  intro_message,
  closing_message,
  rsvp_deadline,
  max_companions,
  audio_url,
  audio_title,
  show_countdown,
  show_messages,
  show_location,
  show_rsvp,
  messages_require_moderation
) VALUES (
  'main_event',
  'Lucca',
  'Safari do Lucca',
  'Uma Grande Aventura • 1 Aninho',
  '2026-11-21 16:00:00-03',
  '16:00 às 21:00',
  'America/Sao_Paulo',
  'Espaço Safari Encantado',
  'Av. das Palmeiras, 1500 - Jardim Primavera, São Paulo - SP',
  'https://maps.google.com/?q=Av.+das+Palmeiras,+1500+-+Jardim+Primavera,+São+Paulo+-+SP',
  'Há um ano, começou a aventura mais linda das nossas vidas. Agora, chegou a hora de celebrar o primeiro aninho do nosso pequeno explorador!',
  'Esperamos você e sua família para viver essa grande aventura com a gente! Com muito amor, Lucca e Papais.',
  '2026-11-10',
  4,
  '/musica.mp3',
  'Aventura no Safari',
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE
) ON CONFLICT (id) DO NOTHING;
