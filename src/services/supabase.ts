import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { EventSettings, RSVP, GuestMessage, RSVPStats, MessageStatus, AnimalType } from '../types'
import { DEFAULT_EVENT_SETTINGS } from '../config/defaults'

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Local Storage Keys for Mock/Offline Mode
const STORAGE_KEYS = {
  SETTINGS: 'safari_lucca_event_settings',
  RSVPS: 'safari_lucca_rsvps',
  MESSAGES: 'safari_lucca_messages',
  ADMIN_SESSION: 'safari_lucca_admin_session',
}

// Helper: load local mock data
function getLocalSettings(): EventSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.venue_name === 'Espaço Safari Encantado') {
        parsed.venue_name = DEFAULT_EVENT_SETTINGS.venue_name
      }
      if (parsed.event_time_display === 'Início às 14:00h' || !parsed.event_time_display) {
        parsed.event_time_display = DEFAULT_EVENT_SETTINGS.event_time_display
      }
      if (parsed.event_date && parsed.event_date.includes('T14:00')) {
        parsed.event_date = parsed.event_date.replace('T14:00', 'T16:00')
      }
      return { ...DEFAULT_EVENT_SETTINGS, ...parsed }
    }
  } catch (e) {
    console.error('Error reading settings from localStorage', e)
  }
  return DEFAULT_EVENT_SETTINGS
}

function setLocalSettings(settings: EventSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

function getLocalRSVPs(): RSVP[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RSVPS)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading rsvps from localStorage', e)
  }
  return []
}

function setLocalRSVPs(list: RSVP[]) {
  localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(list))
}

function getLocalMessages(): GuestMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES)
    if (raw) {
      const list: GuestMessage[] = JSON.parse(raw)
      return list.filter((m) => !m.id.startsWith('msg-seed-'))
    }
  } catch (e) {
    console.error('Error reading messages from localStorage', e)
  }
  return []
}

function setLocalMessages(list: GuestMessage[]) {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list))
}

// ----------------------------------------------------
// Public and Admin Service API
// ----------------------------------------------------

export async function getEventSettings(): Promise<EventSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('event_settings')
        .select('*')
        .eq('id', 'main_event')
        .maybeSingle()

      if (!error && data) {
        if (data.event_time_display === 'Início às 14:00h') {
          data.event_time_display = DEFAULT_EVENT_SETTINGS.event_time_display
        }
        if (data.event_date && data.event_date.includes('T14:00')) {
          data.event_date = data.event_date.replace('T14:00', 'T16:00')
        }
        return {
          ...DEFAULT_EVENT_SETTINGS,
          ...data,
        }
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage', err)
    }
  }

  return getLocalSettings()
}

export async function updateEventSettings(settings: Partial<EventSettings>): Promise<{ success: boolean; error?: string }> {
  const current = await getEventSettings()
  const updated: EventSettings = {
    ...current,
    ...settings,
    updated_at: new Date().toISOString(),
  }

  // Always update local cache immediately for instant UI feedback
  setLocalSettings(updated)

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('event_settings')
        .upsert(updated)
      
      if (error) {
        console.warn('Supabase upsert warning, changes retained locally:', error.message)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na conexão com Supabase'
      console.warn('Supabase upsert error, changes retained locally:', message)
    }
  }

  return { success: true }
}

export async function submitRSVP(rsvpData: Omit<RSVP, 'id' | 'created_at'>): Promise<{ success: boolean; rsvp?: RSVP; error?: string }> {
  const trimmedName = rsvpData.guest_name.trim()
  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: 'Por favor, informe seu nome completo.' }
  }

  const newRsvp: RSVP = {
    ...rsvpData,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rsvp_${Date.now()}`,
    guest_name: trimmedName,
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .insert({
          guest_name: newRsvp.guest_name,
          attending: newRsvp.attending,
          companions_count: newRsvp.companions_count,
          companion_names: newRsvp.companion_names,
          notes: newRsvp.notes || null,
          phone: newRsvp.phone || null,
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true, rsvp: data as RSVP }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar confirmação'
      return { success: false, error: message }
    }
  }

  // Local storage mode: duplicate check
  const list = getLocalRSVPs()
  const exists = list.some(item => item.guest_name.toLowerCase() === trimmedName.toLowerCase())
  if (exists) {
    // update existing
    const updatedList = list.map(item =>
      item.guest_name.toLowerCase() === trimmedName.toLowerCase() ? { ...item, ...newRsvp, id: item.id } : item
    )
    setLocalRSVPs(updatedList)
    return { success: true, rsvp: newRsvp }
  }

  list.unshift(newRsvp)
  setLocalRSVPs(list)
  return { success: true, rsvp: newRsvp }
}

export async function getRSVPs(): Promise<RSVP[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data as RSVP[]
      }
    } catch (err) {
      console.warn('Error fetching RSVPs from Supabase', err)
    }
  }

  return getLocalRSVPs()
}

export async function deleteRSVP(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('rsvps').delete().eq('id', id)
      if (error) console.error('Supabase delete error', error)
    } catch (err) {
      console.error(err)
    }
  }

  const list = getLocalRSVPs().filter(item => item.id !== id)
  setLocalRSVPs(list)
  return true
}

export async function getPublicMessages(): Promise<GuestMessage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guest_messages')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data as GuestMessage[]
      }
    } catch (err) {
      console.warn('Supabase fetch messages error, using fallback', err)
    }
  }

  return getLocalMessages().filter(m => m.status === 'approved')
}

export async function getAllMessages(): Promise<GuestMessage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guest_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data as GuestMessage[]
      }
    } catch (err) {
      console.warn('Supabase fetch all messages error', err)
    }
  }

  return getLocalMessages()
}

export async function submitGuestMessage(data: {
  author_name: string
  relationship?: string
  message: string
  animal_avatar: AnimalType
}): Promise<{ success: boolean; message?: GuestMessage; error?: string }> {
  const author = data.author_name.trim()
  const content = data.message.trim()

  if (!author || author.length < 2) {
    return { success: false, error: 'Por favor, informe seu nome.' }
  }
  if (!content || content.length < 3) {
    return { success: false, error: 'Sua mensagem deve ter pelo menos 3 caracteres.' }
  }
  if (content.length > 500) {
    return { success: false, error: 'A mensagem não pode exceder 500 caracteres.' }
  }

  const settings = await getEventSettings()
  const initialStatus: MessageStatus = settings.messages_require_moderation ? 'pending' : 'approved'

  const newMessage: GuestMessage = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg_${Date.now()}`,
    author_name: author,
    relationship: data.relationship?.trim() || 'Amigo(a) da Família',
    message: content,
    status: initialStatus,
    animal_avatar: data.animal_avatar,
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from('guest_messages')
        .insert({
          author_name: newMessage.author_name,
          relationship: newMessage.relationship,
          message: newMessage.message,
          status: newMessage.status,
          animal_avatar: newMessage.animal_avatar,
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true, message: inserted as GuestMessage }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar mensagem'
      return { success: false, error: message }
    }
  }

  const list = getLocalMessages()
  list.unshift(newMessage)
  setLocalMessages(list)
  return { success: true, message: newMessage }
}

export async function updateMessageStatus(id: string, status: MessageStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('guest_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
      
      if (error) console.error('Supabase update status error', error)
    } catch (err) {
      console.error(err)
    }
  }

  const list = getLocalMessages().map(m => m.id === id ? { ...m, status } : m)
  setLocalMessages(list)
  return true
}

export async function deleteGuestMessage(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('guest_messages')
        .delete()
        .eq('id', id)

      if (error) console.error('Supabase delete message error', error)
    } catch (err) {
      console.error(err)
    }
  }

  const list = getLocalMessages().filter(m => m.id !== id)
  setLocalMessages(list)
  return true
}

export async function getStats(): Promise<RSVPStats> {
  const rsvps = await getRSVPs()
  const messages = await getAllMessages()

  const confirmed = rsvps.filter(r => r.attending)
  const declined = rsvps.filter(r => !r.attending)
  const companions = confirmed.reduce((acc, curr) => acc + (curr.companions_count || 0), 0)
  const pendingMsgs = messages.filter(m => m.status === 'pending').length

  return {
    total_rsvps: rsvps.length,
    confirmed_guests: confirmed.length,
    declined_guests: declined.length,
    total_companions: companions,
    total_attendees: confirmed.length + companions,
    pending_messages: pendingMsgs,
  }
}

// ----------------------------------------------------
// Admin Auth Simulation & Supabase Auth Bridge
// ----------------------------------------------------

export async function signInAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { success: false, error: error.message }
      }
      if (data.session) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify({ email, authenticated: true, token: data.session.access_token }))
        return { success: true }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro na autenticação'
      return { success: false, error: message }
    }
  }

  if (email.trim().toLowerCase() === 'admin@safaridolucca.com.br' && password === '937146') {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify({ email: 'admin@safaridolucca.com.br', authenticated: true }))
    return { success: true }
  }

  return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' }
}

export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.error(e)
    }
  }
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION)
}

export function checkIsAdminAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION)
    if (raw) {
      const session = JSON.parse(raw)
      return Boolean(session?.authenticated)
    }
  } catch (e) {
    console.error(e)
  }
  return false
}
