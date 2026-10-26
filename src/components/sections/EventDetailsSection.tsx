import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, CalendarPlus } from 'lucide-react'
import type { EventSettings } from '../../types'
import { BabyZebra, FootprintsTrail } from '../illustrations'

interface EventDetailsSectionProps {
  settings: EventSettings
}

export function formatEventDate(isoString: string): { dayOfWeek: string; fullDate: string } {
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      return { dayOfWeek: 'Data a definir', fullDate: 'A definir' }
    }
    const dayOfWeek = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date)
    const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
    const fullDate = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
    return { dayOfWeek: capitalizedDay, fullDate }
  } catch {
    return { dayOfWeek: 'Em breve', fullDate: 'Em breve' }
  }
}

export function generateGoogleCalendarUrl(settings: EventSettings): string {
  try {
    const startDate = new Date(settings.event_date)
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000) // 4 hours party

    const formatGCal = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')

    const title = encodeURIComponent(`${settings.event_title} - 1 Aninho`)
    const details = encodeURIComponent(
      `Comemoração do 1º aninho do ${settings.child_name}! Esperamos você para essa grande aventura.`
    )
    const location = encodeURIComponent(`${settings.venue_name}, ${settings.venue_address}`)
    const dates = `${formatGCal(startDate)}/${formatGCal(endDate)}`

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`
  } catch {
    return 'https://calendar.google.com'
  }
}

export const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ settings }) => {
  const { dayOfWeek, fullDate } = formatEventDate(settings.event_date)
  const gcalUrl = generateGoogleCalendarUrl(settings)

  return (
    <section
      id="detalhes"
      style={{
        padding: '4rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <FootprintsTrail />
        </div>

        {/* Card with details and Zebra illustration */}
        <motion.div
          className="safari-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '2.75rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            background: 'rgba(255, 253, 249, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(229, 190, 94, 0.45)',
            boxShadow: '0 16px 48px -8px rgba(45, 34, 23, 0.16)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-sage-800)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
            }}
          >
            <Calendar size={16} />
            <span>Guarde Esta Data</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.4rem)', color: 'var(--color-brown-900)', marginBottom: '1.5rem' }}>
            Data & Horário
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <BabyZebra size={140} />
          </div>

          {/* Date Information */}
          <div style={{ marginBottom: '1.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-terracotta-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              {dayOfWeek}
            </span>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--color-brown-900)',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {fullDate}
            </p>
          </div>

          {/* Time Information */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'var(--color-sage-100)',
              padding: '0.6rem 1.4rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-sage-800)',
              fontWeight: 700,
              fontSize: '1.05rem',
              marginBottom: '2rem',
            }}
          >
            <Clock size={18} />
            <span>{settings.event_time_display || '16:00 às 21:00'}</span>
          </div>

          {/* Add to Calendar Button */}
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '0.95rem',
            }}
          >
            <CalendarPlus size={18} color="var(--color-sage-600)" />
            <span>Salvar no Google Agenda</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
