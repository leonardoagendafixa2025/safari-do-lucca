// TypeScript interfaces for Safari do Lucca

export interface EventSettings {
  id: string
  child_name: string
  event_title: string
  event_subtitle: string
  event_date: string // ISO string: e.g. 2026-11-21T16:00:00
  event_time_display: string // e.g. "16:00 às 21:00"
  timezone: string
  venue_name: string
  venue_address: string
  maps_url: string
  intro_message: string
  closing_message: string
  rsvp_deadline: string // e.g. "2026-11-10"
  max_companions: number
  audio_url: string
  audio_title: string
  show_countdown: boolean
  show_messages: boolean
  show_location: boolean
  show_rsvp: boolean
  messages_require_moderation: boolean
  updated_at?: string
}

export interface RSVP {
  id: string
  guest_name: string
  attending: boolean
  companions_count: number
  companion_names: string[]
  notes?: string
  phone?: string
  token?: string
  created_at: string
  updated_at?: string
}

export type MessageStatus = 'pending' | 'approved' | 'hidden'

export type AnimalType = 'lion' | 'elephant' | 'giraffe' | 'monkey' | 'zebra' | 'bird'

export interface GuestMessage {
  id: string
  author_name: string
  relationship?: string
  message: string
  status: MessageStatus
  animal_avatar: AnimalType
  created_at: string
  updated_at?: string
}

export interface RSVPStats {
  total_rsvps: number
  confirmed_guests: number
  declined_guests: number
  total_companions: number
  total_attendees: number
  pending_messages: number
}
