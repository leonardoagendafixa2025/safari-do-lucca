import { describe, it, expect } from 'vitest'
import { formatEventDate, generateGoogleCalendarUrl } from '../components/sections/EventDetailsSection'
import { calculateTimeRemaining } from '../components/sections/CountdownSection'
import { escapeHtml } from '../components/sections/GuestbookSection'
import { DEFAULT_EVENT_SETTINGS } from '../config/defaults'

describe('Safari do Lucca - Configurações e Utilitários', () => {
  it('deve ter a data padrão configurada para domingo, 13 de dezembro de 2026 às 15:00', () => {
    expect(DEFAULT_EVENT_SETTINGS.event_date).toBe('2026-12-13T15:00:00')
    expect(DEFAULT_EVENT_SETTINGS.event_time_display).toBe('A partir das 15:00')
    
    const formatted = formatEventDate(DEFAULT_EVENT_SETTINGS.event_date)
    expect(formatted.dayOfWeek.toLowerCase()).toContain('domingo')
    expect(formatted.fullDate.toLowerCase()).toContain('13 de dezembro de 2026')
  })

  it('deve formatar link do Google Calendar com data e horário corretos', () => {
    const url = generateGoogleCalendarUrl(DEFAULT_EVENT_SETTINGS)
    expect(url).toContain('calendar.google.com')
    expect(url).toContain('Safari')
  })

  it('deve calcular contagem regressiva corretamente', () => {
    const futureDate = '2026-12-13T15:00:00'
    const result = calculateTimeRemaining(futureDate)
    expect(result).toHaveProperty('days')
    expect(result).toHaveProperty('hours')
    expect(result).toHaveProperty('minutes')
    expect(result).toHaveProperty('seconds')
    expect(result.days).toBeGreaterThanOrEqual(0)
  })

  it('deve sanitizar caracteres perigosos contra XSS', () => {
    const malicious = '<script>alert("xss")</script>'
    const escaped = escapeHtml(malicious)
    expect(escaped).not.toContain('<script>')
    expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
  })

  it('deve conter as seções e dados essenciais configurados', () => {
    expect(DEFAULT_EVENT_SETTINGS.child_name).toBe('Lucca')
    expect(DEFAULT_EVENT_SETTINGS.show_rsvp).toBe(true)
    expect(DEFAULT_EVENT_SETTINGS.show_messages).toBe(true)
    expect(DEFAULT_EVENT_SETTINGS.show_countdown).toBe(true)
    expect(DEFAULT_EVENT_SETTINGS.show_location).toBe(true)
  })
})
