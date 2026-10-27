import { describe, it, expect, beforeEach } from 'vitest'
import {
  getEventSettings,
  updateEventSettings,
  submitRSVP,
  getRSVPs,
  submitGuestMessage,
  getStats,
  signInAdmin,
  signOutAdmin,
  checkIsAdminAuthenticated,
} from '../services/supabase'

describe('Services: Supabase & Offline Local Storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return default event settings when no storage exists', async () => {
    const settings = await getEventSettings()
    expect(settings.child_name).toBe('Lucca')
    expect(settings.event_title).toBe('Safari do Lucca')
    expect(settings.audio_url).toBe('/musica.mp3')
  })

  it('should update and persist event settings locally', async () => {
    const res = await updateEventSettings({ venue_name: 'Espaço Selva Mágica' })
    expect(res.success).toBe(true)

    const updated = await getEventSettings()
    expect(updated.venue_name).toBe('Espaço Selva Mágica')
  })

  it('should update and persist event date and time display', async () => {
    const res = await updateEventSettings({
      event_date: '2026-12-12T16:30:00',
      event_time_display: 'Início às 16:30h',
    })
    expect(res.success).toBe(true)

    const updated = await getEventSettings()
    expect(updated.event_date).toBe('2026-12-12T16:30:00')
    expect(updated.event_time_display).toBe('Início às 16:30h')
  })

  it('should validate empty guest name when submitting RSVP', async () => {
    const res = await submitRSVP({
      guest_name: ' ',
      attending: true,
      companions_count: 0,
      companion_names: [],
    })
    expect(res.success).toBe(false)
    expect(res.error).toContain('nome completo')
  })

  it('should submit RSVP and retrieve it successfully', async () => {
    const res = await submitRSVP({
      guest_name: 'Carlos Alberto',
      attending: true,
      companions_count: 2,
      companion_names: ['Mariana', 'Pedro'],
      notes: 'Não vemos a hora!',
      phone: '11999999999',
    })

    expect(res.success).toBe(true)
    expect(res.rsvp?.guest_name).toBe('Carlos Alberto')

    const rsvps = await getRSVPs()
    expect(rsvps.length).toBeGreaterThanOrEqual(1)
    expect(rsvps[0].guest_name).toBe('Carlos Alberto')
    expect(rsvps[0].companions_count).toBe(2)
  })

  it('should validate guest messages (author name and content length)', async () => {
    const shortAuthorRes = await submitGuestMessage({
      author_name: 'A',
      message: 'Parabéns Lucca querido!',
      animal_avatar: 'lion',
    })
    expect(shortAuthorRes.success).toBe(false)

    const shortContentRes = await submitGuestMessage({
      author_name: 'Vitor',
      message: 'Oi',
      animal_avatar: 'giraffe',
    })
    expect(shortContentRes.success).toBe(false)
  })

  it('should submit a valid guest message and retrieve it', async () => {
    const res = await submitGuestMessage({
      author_name: 'Tia Clarice',
      relationship: 'Tia',
      message: 'Lucca, que o papai do céu ilumine todos os seus passos!',
      animal_avatar: 'elephant',
    })

    expect(res.success).toBe(true)
    expect(res.message?.author_name).toBe('Tia Clarice')
  })

  it('should correctly calculate stats for RSVPs and companions', async () => {
    await submitRSVP({
      guest_name: 'Família Souza',
      attending: true,
      companions_count: 3,
      companion_names: ['A', 'B', 'C'],
    })
    await submitRSVP({
      guest_name: 'Convidado Ausente',
      attending: false,
      companions_count: 0,
      companion_names: [],
    })

    const stats = await getStats()
    expect(stats.total_rsvps).toBe(2)
    expect(stats.confirmed_guests).toBe(1)
    expect(stats.declined_guests).toBe(1)
    expect(stats.total_companions).toBe(3)
    expect(stats.total_attendees).toBe(4) // 1 confirmed + 3 companions
  })

  it('should authenticate admin with credentials', async () => {
    expect(checkIsAdminAuthenticated()).toBe(false)

    const failRes = await signInAdmin('wrong@email.com', '123')
    expect(failRes.success).toBe(false)

    const successRes = await signInAdmin('admin@safaridolucca.com.br', '937146')
    expect(successRes.success).toBe(true)
    expect(checkIsAdminAuthenticated()).toBe(true)

    await signOutAdmin()
    expect(checkIsAdminAuthenticated()).toBe(false)
  })
})
