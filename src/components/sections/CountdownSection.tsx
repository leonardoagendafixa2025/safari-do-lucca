import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Sparkles } from 'lucide-react'
import type { EventSettings } from '../../types'
import { BabyMonkey, FootprintsTrail } from '../illustrations'

interface CountdownSectionProps {
  settings: EventSettings
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
  isToday: boolean
}

export function calculateTimeRemaining(targetDateStr: string): TimeRemaining {
  const target = new Date(targetDateStr).getTime()
  const now = Date.now()
  const diff = target - now

  if (isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, isToday: false }
  }

  if (diff <= 0) {
    // Check if within 24 hours of event (party is today!)
    const hoursPast = Math.abs(diff) / (1000 * 60 * 60)
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: hoursPast > 24,
      isToday: hoursPast <= 24,
    }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds, isPast: false, isToday: false }
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ settings }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(settings.event_date)
  )

  useEffect(() => {
    setTimeLeft(calculateTimeRemaining(settings.event_date))
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(settings.event_date))
    }, 1000)

    return () => clearInterval(timer)
  }, [settings.event_date])

  if (!settings.show_countdown) return null

  const timeUnits = [
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ]

  return (
    <section
      id="contagem"
      style={{
        padding: '4rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative' }}>
        {/* Footprints transition */}
        <div style={{ marginBottom: '2.5rem' }}>
          <FootprintsTrail />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
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
            <Clock size={16} />
            <span>Falta Pouco para a Expedição!</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.4rem)', color: 'var(--color-brown-900)' }}>
            Contagem Regressiva
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
            Prepare seu espírito aventureiro para o grande dia!
          </p>
        </motion.div>

        {/* Monkey swinging beside timer */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <BabyMonkey size={130} />
        </div>

        {/* Timer Display or Event Day Message */}
        {timeLeft.isPast ? (
          <div
            className="safari-card"
            style={{
              padding: '2rem',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF2E3 100%)',
            }}
          >
            <Sparkles size={32} color="var(--color-gold-500)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-brown-900)', marginBottom: '0.5rem' }}>
              A Grande Aventura Já Foi Celebrada!
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Agradecemos a todos que fizeram parte desse dia inesquecível na vida do {settings.child_name}!
            </p>
          </div>
        ) : timeLeft.isToday ? (
          <div
            className="safari-card"
            style={{
              padding: '2rem',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, #E6EFE8 0%, #FAF8F2 100%)',
              border: '2px solid var(--color-sage-500)',
            }}
          >
            <Sparkles size={36} color="var(--color-gold-500)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-sage-800)', marginBottom: '0.5rem' }}>
              É HOJE! O Grande Dia Chegou!
            </h3>
            <p style={{ color: 'var(--color-brown-900)', fontSize: '1rem', fontWeight: 600 }}>
              O Safari do {settings.child_name} está pronto para receber você com muito carinho!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '0.75rem',
              maxWidth: '580px',
              margin: '0 auto',
            }}
          >
            {timeUnits.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="safari-card"
                style={{
                  padding: '1.25rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-cream-card)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.75rem, 5vw, 2.6rem)',
                    fontWeight: 800,
                    color: 'var(--color-brown-900)',
                    lineHeight: 1.1,
                  }}
                >
                  {String(item.value).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--color-sage-800)',
                    marginTop: '0.35rem',
                  }}
                >
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
