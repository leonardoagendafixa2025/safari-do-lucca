import type { EventSettings, GuestMessage } from '../types'

export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  id: 'main_event',
  child_name: 'Lucca',
  event_title: 'Safari do Lucca',
  event_subtitle: 'Meu primeiro aninho',
  event_date: '2026-12-12T14:00:00',
  event_time_display: 'Início às 14:00h',
  timezone: 'America/Sao_Paulo',
  venue_name: 'Salão de Festas',
  venue_address: 'Rua Rubens Caporali Ribeiro, 533 - Buritis - Belo Horizonte',
  maps_url: 'https://maps.google.com/?q=Rua+Rubens+Caporali+Ribeiro,+533+-+Buritis+-+Belo+Horizonte',
  intro_message: 'Há um ano, começou a aventura mais linda das nossas vidas. Agora, chegou a hora de celebrar o primeiro aninho do nosso pequeno explorador!',
  closing_message: 'Esperamos você e sua família para viver essa grande aventura com a gente! Com muito amor, Lucca e Papais.',
  rsvp_deadline: '2026-12-01',
  max_companions: 4,
  audio_url: '/musica.mp3', // Safari theme music provided in public/musica.mp3
  audio_title: 'Aventura no Safari',
  show_countdown: true,
  show_messages: true,
  show_location: true,
  show_rsvp: true,
  messages_require_moderation: true,
}

export const INITIAL_APPROVED_MESSAGES: GuestMessage[] = [
  {
    id: 'msg-seed-1',
    author_name: 'Vovô e Vovó',
    relationship: 'Avós',
    message: 'Nosso exploradorzinho favorito! Que a sua vida seja sempre cheia de alegria, saúde e descobertas encantadoras. Amamos você além do infinito!',
    status: 'approved',
    animal_avatar: 'lion',
    created_at: '2026-10-20T14:30:00Z',
  },
  {
    id: 'msg-seed-2',
    author_name: 'Dinda Marina',
    relationship: 'Madrinha',
    message: 'Parece que foi ontem que você chegou iluminando tudo ao seu redor! Mal posso esperar para comemorar seu 1º aninho nessa festa linda!',
    status: 'approved',
    animal_avatar: 'giraffe',
    created_at: '2026-10-21T10:15:00Z',
  },
  {
    id: 'msg-seed-3',
    author_name: 'Tio Lucas e Família',
    relationship: 'Tios',
    message: 'Preparados para essa expedição selvagem de pura fofura! Parabéns ao Lucca e aos papais por esse primeiro ano abençoado!',
    status: 'approved',
    animal_avatar: 'elephant',
    created_at: '2026-10-22T18:45:00Z',
  },
]
