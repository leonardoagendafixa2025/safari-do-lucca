import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CheckCircle2, XCircle, HeartHandshake, Sparkles, Loader2, Edit3 } from 'lucide-react'
import type { EventSettings, RSVP } from '../../types'
import { submitRSVP } from '../../services/supabase'
import { LionCub, FootprintsTrail } from '../illustrations'

interface RSVPSectionProps {
  settings: EventSettings
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ settings }) => {
  const [guestName, setGuestName] = useState('')
  const [attending, setAttending] = useState<boolean | null>(true)
  const [companionsCount, setCompanionsCount] = useState<number>(0)
  const [companionNames, setCompanionNames] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedRSVP, setSubmittedRSVP] = useState<RSVP | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  if (!settings.show_rsvp) return null

  // Check deadline
  const isPastDeadline = Boolean(
    settings.rsvp_deadline &&
    new Date(settings.rsvp_deadline).getTime() < new Date().setHours(0, 0, 0, 0)
  )

  const handleCompanionCountChange = (count: number) => {
    const validCount = Math.max(0, Math.min(settings.max_companions || 4, count))
    setCompanionsCount(validCount)

    const updated = [...companionNames]
    if (validCount > updated.length) {
      while (updated.length < validCount) {
        updated.push('')
      }
    } else {
      updated.splice(validCount)
    }
    setCompanionNames(updated)
  }

  const handleCompanionNameChange = (index: number, value: string) => {
    const updated = [...companionNames]
    updated[index] = value
    setCompanionNames(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const trimmed = guestName.trim()
    if (!trimmed || trimmed.length < 2) {
      setErrorMessage('Por favor, digite seu nome completo.')
      return
    }

    if (attending === null) {
      setErrorMessage('Por favor, informe se você comparecerá ao evento.')
      return
    }

    setLoading(true)

    try {
      const filteredCompanions = attending
        ? companionNames.map(n => n.trim()).filter(Boolean)
        : []

      const result = await submitRSVP({
        guest_name: trimmed,
        attending: attending,
        companions_count: attending ? companionsCount : 0,
        companion_names: filteredCompanions,
      })

      if (result.success && result.rsvp) {
        setSubmittedRSVP(result.rsvp)
        setIsEditing(false)

        if (attending) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#76977D', '#E08C70', '#E5BE5E', '#CA9E3B', '#587C60'],
          })
        }
      } else {
        setErrorMessage(result.error || 'Erro ao registrar sua resposta. Tente novamente.')
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado ao conectar. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="rsvp"
      style={{
        padding: '5rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <FootprintsTrail />
        </div>

        {/* RSVP Card */}
        <motion.div
          className="safari-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: '2.75rem 2rem',
            background: 'rgba(255, 253, 249, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(229, 190, 94, 0.45)',
            boxShadow: '0 16px 48px -8px rgba(45, 34, 23, 0.16)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
              <HeartHandshake size={16} />
              <span>Confirmação de Presença</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.4rem)', color: 'var(--color-brown-900)' }}>
              Você Estará Conosco?
            </h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Sua presença tornará nossa aventura ainda mais especial!
            </p>

            {settings.rsvp_deadline && (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-terracotta-500)',
                  fontWeight: 600,
                  marginTop: '0.35rem',
                }}
              >
                Por favor, confirme até{' '}
                {new Date(settings.rsvp_deadline + 'T12:00:00').toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            )}
          </div>
          {/* Deadline expired notice */}
          {isPastDeadline && !submittedRSVP ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <LionCub size={120} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-brown-900)', margin: '1rem 0 0.5rem 0' }}>
                Prazo de Confirmação Encerrado
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                O prazo para confirmação de presença encerrou. Caso deseje confirmar ou fazer alguma alteração, por favor entre em contato diretamente com os pais do Lucca!
              </p>
            </div>
          ) : submittedRSVP && !isEditing ? (
            /* Success confirmation display */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '1rem 0' }}
            >
              <LionCub size={140} />
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: submittedRSVP.attending ? 'var(--color-sage-800)' : 'var(--color-brown-800)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  margin: '1.25rem 0 0.5rem 0',
                }}
              >
                {submittedRSVP.attending ? (
                  <>
                    <Sparkles size={24} color="var(--color-gold-500)" />
                    <span>Presença Confirmada com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake size={24} color="var(--color-terracotta-500)" />
                    <span>Resposta Registrada!</span>
                  </>
                )}
              </div>

              <p style={{ color: 'var(--color-brown-900)', fontSize: '1.05rem', fontWeight: 600, margin: '0.5rem 0' }}>
                Obrigado, {submittedRSVP.guest_name}!
              </p>

              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                {submittedRSVP.attending
                  ? `Estamos muito felizes em celebrar o 1º aninho do ${settings.child_name} com você${
                      submittedRSVP.companions_count > 0 ? ` e seus ${submittedRSVP.companions_count} acompanhante(s)` : ''
                    }!`
                  : `Sentiremos sua falta nessa expedição, mas agradecemos muito por nos avisar com carinho!`}
              </p>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.6rem 1.4rem' }}
              >
                <Edit3 size={16} />
                <span>Editar Minha Resposta</span>
              </button>
            </motion.div>
          ) : (
            /* Interactive Form */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Error banner */}
              {errorMessage && (
                <div
                  style={{
                    background: 'var(--color-terracotta-100)',
                    color: 'var(--color-terracotta-700)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {/* Guest Full Name */}
              <div>
                <label
                  htmlFor="guest_name"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--color-brown-900)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Seu Nome Completo *
                </label>
                <input
                  id="guest_name"
                  type="text"
                  required
                  placeholder="Ex: Ana Maria Silva"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    background: 'var(--color-cream-bg)',
                    color: 'var(--color-brown-900)',
                    transition: 'border-color var(--transition-fast)',
                  }}
                />
              </div>

              {/* Attendance Choice Buttons */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--color-brown-900)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Você vai comparecer? *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: attending === true ? '2px solid var(--color-sage-600)' : '1.5px solid var(--color-border)',
                      background: attending === true ? 'var(--color-sage-100)' : 'var(--color-cream-bg)',
                      color: attending === true ? 'var(--color-sage-800)' : 'var(--color-text-muted)',
                      fontWeight: 700,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <CheckCircle2 size={18} color={attending === true ? 'var(--color-sage-600)' : 'currentColor'} />
                    <span>Sim, com certeza!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAttending(false)
                      handleCompanionCountChange(0)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: attending === false ? '2px solid var(--color-terracotta-500)' : '1.5px solid var(--color-border)',
                      background: attending === false ? 'var(--color-terracotta-100)' : 'var(--color-cream-bg)',
                      color: attending === false ? 'var(--color-terracotta-700)' : 'var(--color-text-muted)',
                      fontWeight: 700,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <XCircle size={18} color={attending === false ? 'var(--color-terracotta-500)' : 'currentColor'} />
                    <span>Não poderei ir</span>
                  </button>
                </div>
              </div>

              {/* Companions (if attending) */}
              <AnimatePresence>
                {attending && settings.max_companions > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: 'var(--color-brown-900)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Acompanhantes (Adultos e Crianças)
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {[0, 1, 2, 3, 4].filter(n => n <= settings.max_companions).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleCompanionCountChange(num)}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: 'var(--radius-full)',
                            border: companionsCount === num ? '2px solid var(--color-sage-600)' : '1px solid var(--color-border)',
                            background: companionsCount === num ? 'var(--color-sage-600)' : 'var(--color-cream-bg)',
                            color: companionsCount === num ? '#FFFFFF' : 'var(--color-brown-900)',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all var(--transition-fast)',
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    {/* Companion Names inputs */}
                    {companionsCount > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          Nome dos acompanhantes:
                        </span>
                        {companionNames.map((name, idx) => (
                          <input
                            key={idx}
                            type="text"
                            placeholder={`Nome do acompanhante ${idx + 1}`}
                            value={name}
                            onChange={(e) => handleCompanionNameChange(idx, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.7rem 0.9rem',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--color-border)',
                              background: 'var(--color-cream-bg)',
                              fontSize: '0.9rem',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  fontSize: '1.05rem',
                  marginTop: '0.5rem',
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Enviando Confirmação...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Confirmar Resposta</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
