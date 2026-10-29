-- ==============================================================================
-- SAFARI DO LUCCA — MIGRATION COMPLETA (SCHEMA, RLS E PERMISSÕES)
-- Execute no SQL Editor do Supabase: https://supabase.com/dashboard/project/gzkysascdwhnzepexcgm/sql/new
-- ==============================================================================

-- 1. TABELA DE CONFIGURAÇÕES DO EVENTO
CREATE TABLE IF NOT EXISTS public.event_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_event',
  child_name TEXT NOT NULL DEFAULT 'Lucca',
  event_title TEXT NOT NULL DEFAULT 'Safari do Lucca',
  event_subtitle TEXT NOT NULL DEFAULT 'Uma Grande Aventura • 1 Aninho',
  event_date TIMESTAMPTZ NOT NULL DEFAULT '2026-12-13 15:00:00-03',
  event_time_display TEXT NOT NULL DEFAULT 'A partir das 15:00',
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  venue_name TEXT NOT NULL DEFAULT 'Espaço Safari Encantado',
  venue_address TEXT NOT NULL DEFAULT 'Av. das Palmeiras, 1500 - Jardim Primavera, São Paulo - SP',
  maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Av.+das+Palmeiras,+1500+-+Jardim+Primavera,+São+Paulo+-+SP',
  intro_message TEXT NOT NULL DEFAULT 'Há um ano, começou a aventura mais linda das nossas vidas. Agora, chegou a hora de celebrar o primeiro aninho do nosso pequeno explorador!',
  closing_message TEXT NOT NULL DEFAULT 'Esperamos você e sua família para viver essa grande aventura com a gente! Com muito amor, Lucca e Papais.',
  rsvp_deadline DATE NOT NULL DEFAULT '2026-12-05',
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

-- Ativa RLS
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Permissões de schema e tabelas
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.event_settings TO anon, authenticated;

-- Políticas de RLS para event_settings
DROP POLICY IF EXISTS "Public can view event settings" ON public.event_settings;
CREATE POLICY "Public can view event settings"
  ON public.event_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow updating event settings" ON public.event_settings;
CREATE POLICY "Allow updating event settings"
  ON public.event_settings
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);


-- 2. TABELA DE CONFIRMAÇÕES DE PRESENÇA (RSVPS)
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

-- Índices de busca rápida
CREATE INDEX IF NOT EXISTS idx_rsvps_guest_name ON public.rsvps (guest_name);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON public.rsvps (attending);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps (created_at DESC);

-- Ativa RLS e concessões
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.rsvps TO anon, authenticated;

-- Políticas de RLS para rsvps
-- 1. Qualquer visitante pode confirmar presença
DROP POLICY IF EXISTS "Public can submit RSVP" ON public.rsvps;
CREATE POLICY "Public can submit RSVP"
  ON public.rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(guest_name)) >= 2 AND
    companions_count >= 0
  );

-- 2. Convidado pode atualizar sua própria resposta
DROP POLICY IF EXISTS "Public can update own RSVP" ON public.rsvps;
CREATE POLICY "Public can update own RSVP"
  ON public.rsvps
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (
    char_length(trim(guest_name)) >= 2 AND
    companions_count >= 0
  );

-- 3. Apenas administradores autenticados podem consultar a lista inteira (privacidade protegida)
DROP POLICY IF EXISTS "Authenticated admin has full access to RSVPs" ON public.rsvps;
CREATE POLICY "Authenticated admin has full access to RSVPs"
  ON public.rsvps
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- 3. TABELA DO MURAL DE MENSAGENS (GUEST_MESSAGES)
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.guest_messages (status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.guest_messages (created_at DESC);

-- Ativa RLS e concessões
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.guest_messages TO anon, authenticated;

-- Políticas de RLS para guest_messages
-- 1. Público só visualiza mensagens já APROVADAS
DROP POLICY IF EXISTS "Public can view approved messages" ON public.guest_messages;
CREATE POLICY "Public can view approved messages"
  ON public.guest_messages
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- 2. Qualquer visitante pode enviar mensagem de carinho (fica pendente para moderação)
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

-- 3. Administrador autenticado pode aprovar, ocultar, listar pendentes e excluir
DROP POLICY IF EXISTS "Admin has full access to guest messages" ON public.guest_messages;
CREATE POLICY "Admin has full access to guest messages"
  ON public.guest_messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- 4. INSERIR REGISTRO INICIAL PADRÃO (IDEMPOTENTE)
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
  '2026-12-13 15:00:00-03',
  'A partir das 15:00',
  'America/Sao_Paulo',
  'Espaço Safari Encantado',
  'Av. das Palmeiras, 1500 - Jardim Primavera, São Paulo - SP',
  'https://maps.google.com/?q=Av.+das+Palmeiras,+1500+-+Jardim+Primavera,+São+Paulo+-+SP',
  'Há um ano, começou a aventura mais linda das nossas vidas. Agora, chegou a hora de celebrar o primeiro aninho do nosso pequeno explorador!',
  'Esperamos você e sua família para viver essa grande aventura com a gente! Com muito amor, Lucca e Papais.',
  '2026-12-05',
  4,
  '/musica.mp3',
  'Aventura no Safari',
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  event_date = EXCLUDED.event_date,
  event_time_display = EXCLUDED.event_time_display,
  rsvp_deadline = EXCLUDED.rsvp_deadline,
  audio_url = CASE WHEN public.event_settings.audio_url = '' THEN EXCLUDED.audio_url ELSE public.event_settings.audio_url END;
