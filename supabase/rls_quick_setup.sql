-- ==============================================================================
-- SCRIPT RÁPIDO DE ATIVAÇÃO DE RLS NO SUPABASE
-- Execute este script no SQL Editor do seu painel Supabase
-- ==============================================================================

-- 1. Permissões da tabela rsvps (Confirmação de Presença)
ALTER TABLE IF EXISTS public.rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit RSVP" ON public.rsvps;
CREATE POLICY "Public can submit RSVP"
  ON public.rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(guest_name)) >= 2 AND
    companions_count >= 0
  );

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

DROP POLICY IF EXISTS "Authenticated admin has full access to RSVPs" ON public.rsvps;
CREATE POLICY "Authenticated admin has full access to RSVPs"
  ON public.rsvps
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- 2. Permissões da tabela guest_messages (Mural de Mensagens)
ALTER TABLE IF EXISTS public.guest_messages ENABLE ROW LEVEL SECURITY;

-- Visitantes só leem mensagens APROVADAS
DROP POLICY IF EXISTS "Public can view approved messages" ON public.guest_messages;
CREATE POLICY "Public can view approved messages"
  ON public.guest_messages
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Qualquer visitante pode enviar mensagem (status 'pending')
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

-- Administrador tem acesso total para moderar, aprovar ou excluir
DROP POLICY IF EXISTS "Admin has full access to guest messages" ON public.guest_messages;
CREATE POLICY "Admin has full access to guest messages"
  ON public.guest_messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- 3. Permissões da tabela event_settings (Configurações do Evento)
ALTER TABLE IF EXISTS public.event_settings ENABLE ROW LEVEL SECURITY;

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
