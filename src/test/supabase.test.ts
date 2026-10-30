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
    expect(settings.audio_url).toBeDefined()
    expect(settings.event_date).toBe('2026-12-13T15:00:00')
    expect(settings.event_time_display).toBe('A partir das 15:00')
  })

  it('should update and persist event settings locally', async () => {
    const res = await updateEventSettings({ venue_name: 'Salão de Festas - Espaço Safari' })
    expect(res.success).toBe(true)

    const updated = await getEventSettings()
    expect(updated.venue_name).toBe('Salão de Festas - Espaço Safari')
  })

  it('should update and persist event date and time display', async () => {
    const res = await updateEventSettings({
      event_date: '2026-12-13T15:00:00',
      event_time_display: 'A partir das 15:00',
    })
    expect(res.success).toBe(true)

    const updated = await getEventSettings()
    expect(updated.event_date).toBe('2026-12-13T15:00:00')
    expect(updated.event_time_display).toBe('A partir das 15:00')
  })

  it('should validate empty guest name when submitting RSVP', async () => {
    const res = await submitRSVP({
      guest_name: '   ',
      attending: true,
      companions_count: 0,
      companion_names: [],
    })
    expect(res.success).toBe(false)
    expect(res.error).toContain('nome completo')
  })

  it('should submit RSVP and retrieve it successfully', async () => {
    const res = await submitRSVP({
      guest_name: 'Camila Santos',
      attending: true,
      companions_count: 2,
      companion_names: ['Lucas', 'Bia'],
      phone: '11999998888',
      notes: 'Adoramos o tema safari!',
    })
    expect(res.success).toBe(true)
    expect(res.rsvp?.guest_name).toBe('Camila Santos')

    const list = await getRSVPs()
    expect(list.some((r) => r.guest_name === 'Camila Santos')).toBe(true)
  })

  it('should validate guest messages (author name and content length)', async () => {
    const emptyAuthor = await submitGuestMessage({
      author_name: '',
      message: 'Parabéns Lucca!',
      animal_avatar: 'lion',
    })
    expect(emptyAuthor.success).toBe(false)

    const shortMsg = await submitGuestMessage({
      author_name: 'Marcos',
      message: 'oi',
      animal_avatar: 'lion',
    })
    expect(shortMsg.success).toBe(false)
  })

  it('should submit a valid guest message and retrieve it', async () => {
    const res = await submitGuestMessage({
      author_name: 'Dinda Carol',
      relationship: 'Madrinha',
      message: 'Um beijo bem grande para o Lucca!',
      animal_avatar: 'giraffe',
    })
    expect(res.success).toBe(true)
    expect(res.message?.author_name).toBe('Dinda Carol')
  })

  it('should correctly calculate stats for RSVPs and companions', async () => {
    await submitRSVP({
      guest_name: 'Família Rocha',
      attending: true,
      companions_count: 3,
      companion_names: ['Ana', 'Pedro', 'Leo'],
    })
    await submitRSVP({
      guest_name: 'Amigo Ausente',
      attending: false,
      companions_count: 0,
      companion_names: [],
    })

    const stats = await getStats()
    expect(stats.confirmed_guests).toBe(1)
    expect(stats.declined_guests).toBe(1)
    expect(stats.total_companions).toBe(3)
    expect(stats.total_attendees).toBe(4)
  })

  it('should authenticate admin with credentials', async () => {
    const fail = await signInAdmin('errado@teste.com', '123')
    expect(fail.success).toBe(false)

    const ok = await signInAdmin('admin@safaridolucca.com.br', 'safari2026')
    expect(ok.success).toBe(true)
    expect(checkIsAdminAuthenticated()).toBe(true)

    await signOutAdmin()
    expect(checkIsAdminAuthenticated()).toBe(false)
  })
})
