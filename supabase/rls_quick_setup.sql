-- ==============================================================================
-- SCRIPT DE CORREÇÃO DEFINITIVA DE RLS NO SUPABASE — SAFARI DO LUCCA
-- Execute este script no SQL Editor do seu painel Supabase:
-- https://supabase.com/dashboard/project/gzkysascdwhnzepexcgm/sql/new
-- ==============================================================================

-- 1. Permissões da tabela rsvps (Confirmação de Presença)
ALTER TABLE IF EXISTS public.rsvps ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.rsvps TO anon, authenticated;

-- Permitir que qualquer visitante confirme presença
DROP POLICY IF EXISTS "Public can submit RSVP" ON public.rsvps;
CREATE POLICY "Public can submit RSVP"
  ON public.rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(guest_name)) >= 2 AND
    companions_count >= 0
  );

-- Permitir leitura das confirmações (necessário para o painel administrativo listar os convidados)
DROP POLICY IF EXISTS "Authenticated admin has full access to RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Public can view RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Allow read RSVPs" ON public.rsvps;
CREATE POLICY "Allow read RSVPs"
  ON public.rsvps
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Permitir atualização de confirmações (caso o convidado atualize a presença)
DROP POLICY IF EXISTS "Public can update own RSVP" ON public.rsvps;
DROP POLICY IF EXISTS "Allow update RSVPs" ON public.rsvps;
CREATE POLICY "Allow update RSVPs"
  ON public.rsvps
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir exclusão de confirmações pelo painel admin
DROP POLICY IF EXISTS "Allow delete RSVPs" ON public.rsvps;
CREATE POLICY "Allow delete RSVPs"
  ON public.rsvps
  FOR DELETE
  TO anon, authenticated
  USING (true);


-- 2. Permissões da tabela guest_messages (Mural de Recados)
ALTER TABLE IF EXISTS public.guest_messages ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.guest_messages TO anon, authenticated;

-- Permitir envio de mensagens no mural
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

-- Permitir leitura das mensagens (para o mural e para a moderação do admin)
DROP POLICY IF EXISTS "Public can view approved messages" ON public.guest_messages;
DROP POLICY IF EXISTS "Admin has full access to guest messages" ON public.guest_messages;
DROP POLICY IF EXISTS "Allow read guest messages" ON public.guest_messages;
CREATE POLICY "Allow read guest messages"
  ON public.guest_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Permitir atualização de status (aprovar, ocultar recados no painel admin)
DROP POLICY IF EXISTS "Allow update guest messages" ON public.guest_messages;
CREATE POLICY "Allow update guest messages"
  ON public.guest_messages
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir exclusão de recados no painel admin
DROP POLICY IF EXISTS "Allow delete guest messages" ON public.guest_messages;
CREATE POLICY "Allow delete guest messages"
  ON public.guest_messages
  FOR DELETE
  TO anon, authenticated
  USING (true);


-- 3. Permissões da tabela event_settings (Configurações do Evento)
ALTER TABLE IF EXISTS public.event_settings ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.event_settings TO anon, authenticated;

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
