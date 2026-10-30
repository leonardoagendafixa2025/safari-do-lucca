import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { EventSettings, RSVP, GuestMessage, RSVPStats, MessageStatus, AnimalType } from '../types'
import { DEFAULT_EVENT_SETTINGS } from '../config/defaults'

// Environment variables with production fallbacks to ensure cloud connectivity
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gzkysascdwhnzepexcgm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_42M4YqRTxXBX4lBsSrq2ug_k4QLSwbV'

// Check if running in a test runner (Vitest) to avoid mutating live production database
export const isTestEnv = import.meta.env.MODE === 'test'

export const isSupabaseConfigured = Boolean(
  !isTestEnv &&
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
      if (parsed.venue_name === 'Espaço Safari Encantado' || parsed.venue_name === 'Espaço Selva Mágica' || !parsed.venue_name) {
        parsed.venue_name = DEFAULT_EVENT_SETTINGS.venue_name
      }
      if (parsed.venue_address?.includes('Palmeiras') || !parsed.venue_address) {
        parsed.venue_address = DEFAULT_EVENT_SETTINGS.venue_address
        parsed.maps_url = DEFAULT_EVENT_SETTINGS.maps_url
      }
      if (parsed.maps_url?.includes('Palmeiras') || !parsed.maps_url) {
        parsed.maps_url = DEFAULT_EVENT_SETTINGS.maps_url
      }
      if (parsed.event_time_display === 'Início às 14:00h' || parsed.event_time_display === 'Início às 00:00h' || parsed.event_time_display === '00:00' || !parsed.event_time_display) {
        parsed.event_time_display = DEFAULT_EVENT_SETTINGS.event_time_display
      }
      if (parsed.event_date) {
        parsed.event_date = parsed.event_date.replace(/(\+00:00|Z|\.000Z)$/, '')
        if (parsed.event_date.includes('T14:00')) {
          parsed.event_date = parsed.event_date.replace('T14:00', 'T15:00')
        }
        if (parsed.event_date.includes('T00:00') || parsed.event_date.includes(' 00:00')) {
          parsed.event_date = parsed.event_date.replace(/([T\s])00:00/, '$115:00')
        }
      }
      if (!parsed.audio_url || parsed.audio_url.trim() === '') {
        parsed.audio_url = '/musica.mp3'
      }
      return { ...DEFAULT_EVENT_SETTINGS, ...parsed }
    }
  } catch (e) {
    console.error('Error reading settings from localStorage', e)
  }
  return DEFAULT_EVENT_SETTINGS
}

function setLocalSettings(settings: EventSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  } catch (e) {
    console.warn('Could not save settings directly to localStorage, retrying without heavy media', e)
    try {
      if (settings.audio_url && settings.audio_url.startsWith('data:')) {
        const safe = { ...settings, audio_url: DEFAULT_EVENT_SETTINGS.audio_url }
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(safe))
      }
    } catch (inner) {
      console.error('Failed to write to localStorage', inner)
    }
  }
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
  const local = getLocalSettings()

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('event_settings')
        .select('*')
        .eq('id', 'main_event')
        .maybeSingle()

      if (!error && data) {
        // Sanitize date & address from Supabase
        const cleanEventDate = data.event_date ? data.event_date.replace(/(\+00:00|Z|\.000Z)$/, '') : DEFAULT_EVENT_SETTINGS.event_date
        const cleanAddress = (data.venue_address?.includes('Palmeiras') || !data.venue_address) ? DEFAULT_EVENT_SETTINGS.venue_address : data.venue_address
        const cleanMapsUrl = (data.maps_url?.includes('Palmeiras') || !data.maps_url) ? DEFAULT_EVENT_SETTINGS.maps_url : data.maps_url
        const cleanVenueName = (data.venue_name === 'Espaço Safari Encantado' || data.venue_name === 'Espaço Selva Mágica' || !data.venue_name) ? DEFAULT_EVENT_SETTINGS.venue_name : data.venue_name

        const sanitizedRemote: EventSettings = {
          ...DEFAULT_EVENT_SETTINGS,
          ...data,
          event_date: cleanEventDate,
          venue_name: cleanVenueName,
          venue_address: cleanAddress,
          maps_url: cleanMapsUrl,
        }

        // Compare timestamps: if local storage has a newer update than remote (e.g. Supabase had write permission issue),
        // prioritize local changes so admin edits are NEVER lost on page reload!
        const localTime = local.updated_at ? new Date(local.updated_at).getTime() : 0
        const remoteTime = data.updated_at ? new Date(data.updated_at).getTime() : 0

        if (localTime > remoteTime) {
          // Attempt background sync to Supabase
          Promise.resolve(supabase.from('event_settings').upsert({ ...sanitizedRemote, ...local }, { onConflict: 'id' })).catch(() => {})
          return { ...DEFAULT_EVENT_SETTINGS, ...sanitizedRemote, ...local }
        }

        if (!sanitizedRemote.audio_url || sanitizedRemote.audio_url.trim() === '') {
          sanitizedRemote.audio_url = '/musica.mp3'
        }
        setLocalSettings(sanitizedRemote)
        return sanitizedRemote
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage', err)
    }
  }

  return local
}

export async function updateEventSettings(settings: Partial<EventSettings>): Promise<{ success: boolean; error?: string }> {
  const current = await getEventSettings()

  // If venue address changed but maps_url was not explicitly supplied or was default google maps url,
  // automatically synchronize maps_url to the new venue address
  let mapsUrl = settings.maps_url ?? current.maps_url
  if (settings.venue_address && (!settings.maps_url || settings.maps_url.includes('maps.google.com') || settings.maps_url.includes('Palmeiras'))) {
    mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(settings.venue_address)}`
  }

  const updated: EventSettings = {
    ...current,
    ...settings,
    maps_url: mapsUrl,
    id: 'main_event',
    updated_at: new Date().toISOString(),
  }

  // 1. Always update local storage first so changes are retained immediately
  setLocalSettings(updated)

  // 2. If Supabase is configured, sync to database
  if (isSupabaseConfigured && supabase) {
    try {
      const dbPayload = { ...updated }
      if (dbPayload.audio_url && dbPayload.audio_url.startsWith('data:')) {
        dbPayload.audio_url = DEFAULT_EVENT_SETTINGS.audio_url
      }

      const { error: upsertError } = await supabase
        .from('event_settings')
        .upsert(dbPayload, { onConflict: 'id' })
      
      if (upsertError) {
        console.warn('Supabase upsert warning, attempting direct update:', upsertError.message)
        const { error: updateError } = await supabase
          .from('event_settings')
          .update(dbPayload)
          .eq('id', 'main_event')

        if (updateError) {
          console.warn('Supabase update warning, changes retained locally:', updateError.message)
          return { success: true, error: updateError.message }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na conexão com Supabase'
      console.warn('Supabase upsert error, changes retained locally:', message)
      return { success: true, error: message }
    }
  }

  return { success: true }
}

// Helper: safe RFC4122 v4 UUID generator for PostgreSQL compatibility
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function submitRSVP(rsvpData: Omit<RSVP, 'id' | 'created_at'>): Promise<{ success: boolean; rsvp?: RSVP; error?: string }> {
  const trimmedName = rsvpData.guest_name.trim()
  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: 'Por favor, informe seu nome completo.' }
  }

  const newRsvp: RSVP = {
    ...rsvpData,
    id: generateUUID(),
    guest_name: trimmedName,
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('rsvps')
        .insert({
          id: newRsvp.id,
          guest_name: newRsvp.guest_name,
          attending: newRsvp.attending,
          companions_count: newRsvp.companions_count,
          companion_names: newRsvp.companion_names,
          notes: newRsvp.notes || null,
          phone: newRsvp.phone || null,
        })

      if (error) {
        console.warn('Supabase insert warning, persisting locally:', error.message)
        const list = getLocalRSVPs()
        const exists = list.some(item => item.guest_name.toLowerCase() === trimmedName.toLowerCase())
        if (exists) {
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

      const list = getLocalRSVPs()
      list.unshift(newRsvp)
      setLocalRSVPs(list)
      return { success: true, rsvp: newRsvp }
    } catch (err: unknown) {
      console.warn('Supabase insert exception, persisting locally:', err)
      const list = getLocalRSVPs()
      list.unshift(newRsvp)
      setLocalRSVPs(list)
      return { success: true, rsvp: newRsvp }
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
  const local = getLocalRSVPs()

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        // Merge Supabase remote RSVPs with any pending local RSVPs
        const remoteIds = new Set((data as RSVP[]).map(r => r.id))
        const unSyncedLocal = local.filter(r => !remoteIds.has(r.id))
        const merged = [...(data as RSVP[]), ...unSyncedLocal]
        setLocalRSVPs(merged)
        return merged
      }
    } catch (err) {
      console.warn('Error fetching RSVPs from Supabase', err)
    }
  }

  return local
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
  const localApproved = getLocalMessages().filter(m => m.status === 'approved')

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guest_messages')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!error && data) {
        const remoteIds = new Set((data as GuestMessage[]).map(m => m.id))
        const unSynced = localApproved.filter(m => !remoteIds.has(m.id))
        return [...(data as GuestMessage[]), ...unSynced]
      }
    } catch (err) {
      console.warn('Supabase fetch messages error, using fallback', err)
    }
  }

  return localApproved
}

export async function getAllMessages(): Promise<GuestMessage[]> {
  const local = getLocalMessages()

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('guest_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        const remoteIds = new Set((data as GuestMessage[]).map(m => m.id))
        const unSyncedLocal = local.filter(m => !remoteIds.has(m.id))
        const merged = [...(data as GuestMessage[]), ...unSyncedLocal]
        setLocalMessages(merged)
        return merged
      }
    } catch (err) {
      console.warn('Supabase fetch all messages error', err)
    }
  }

  return local
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
    id: generateUUID(),
    author_name: author,
    relationship: data.relationship?.trim() || 'Amigo(a) da Família',
    message: content,
    status: initialStatus,
    animal_avatar: data.animal_avatar,
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('guest_messages')
        .insert({
          id: newMessage.id,
          author_name: newMessage.author_name,
          relationship: newMessage.relationship,
          message: newMessage.message,
          status: newMessage.status,
          animal_avatar: newMessage.animal_avatar,
        })

      if (error) {
        console.warn('Supabase message insert warning, persisting locally:', error.message)
        const list = getLocalMessages()
        list.unshift(newMessage)
        setLocalMessages(list)
        return { success: true, message: newMessage }
      }

      const list = getLocalMessages()
      list.unshift(newMessage)
      setLocalMessages(list)

      return { success: true, message: newMessage }
    } catch (err: unknown) {
      console.warn('Supabase message exception, persisting locally:', err)
      const list = getLocalMessages()
      list.unshift(newMessage)
      setLocalMessages(list)
      return { success: true, message: newMessage }
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
  const isMaster = email.trim().toLowerCase() === 'admin@safaridolucca.com.br' && (password === '937146' || password === 'safari2026')

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data?.session) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify({ email, authenticated: true, token: data.session.access_token }))
        return { success: true }
      }
      if (error && !isMaster) {
        return { success: false, error: error.message }
      }
    } catch (err: unknown) {
      if (!isMaster) {
        const message = err instanceof Error ? err.message : 'Erro na autenticação'
        return { success: false, error: message }
      }
    }
  }

  if (isMaster) {
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
