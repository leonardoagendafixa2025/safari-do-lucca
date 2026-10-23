import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquareHeart, Send, CheckCircle2, Loader2 } from 'lucide-react'
import type { EventSettings, GuestMessage, AnimalType } from '../../types'
import { getPublicMessages, submitGuestMessage } from '../../services/supabase'
import { LionCub, BabyElephant, BabyGiraffe, BabyMonkey, BabyZebra, FootprintsTrail } from '../illustrations'

interface GuestbookSectionProps {
  settings: EventSettings
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ settings }) => {
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)

  // Form State
  const [authorName, setAuthorName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [messageText, setMessageText] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<AnimalType>('lion')
  const [honeypot, setHoneypot] = useState('') // Anti-bot trap

  const [submitting, setSubmitting] = useState(false)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)
  const [errorNotice, setErrorNotice] = useState<string | null>(null)

  const fetchApproved = async () => {
    try {
      const data = await getPublicMessages()
      setMessages(data)
    } catch (e) {
      console.warn('Failed to fetch messages', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApproved()
  }, [])

  if (!settings.show_messages) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorNotice(null)
    setSuccessNotice(null)

    // Bot detection check
    if (honeypot) {
      console.warn('Spam detected via honeypot')
      return
    }

    const cleanAuthor = authorName.trim()
    const cleanMessage = messageText.trim()

    if (!cleanAuthor || cleanAuthor.length < 2) {
      setErrorNotice('Por favor, informe seu nome.')
      return
    }

    if (!cleanMessage || cleanMessage.length < 3) {
      setErrorNotice('Por favor, escreva uma mensagem com pelo menos 3 caracteres.')
      return
    }

    if (cleanMessage.length > 500) {
      setErrorNotice('A mensagem não pode ultrapassar 500 caracteres.')
      return
    }

    setSubmitting(true)

    try {
      const res = await submitGuestMessage({
        author_name: cleanAuthor,
        relationship: relationship.trim() || undefined,
        message: cleanMessage,
        animal_avatar: selectedAvatar,
      })

      if (res.success) {
        setAuthorName('')
        setRelationship('')
        setMessageText('')
        setSuccessNotice(
          settings.messages_require_moderation
            ? 'Sua mensagem foi enviada com muito amor! Logo após aprovação ela aparecerá no mural.'
            : 'Sua mensagem foi publicada no mural com sucesso!'
        )

        // If auto-approved, refresh list
        if (!settings.messages_require_moderation) {
          await fetchApproved()
        }

        setTimeout(() => setSuccessNotice(null), 6000)
      } else {
        setErrorNotice(res.error || 'Erro ao enviar mensagem. Tente novamente.')
      }
    } catch {
      setErrorNotice('Ocorreu um erro ao enviar. Verifique sua conexão.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderAvatar = (avatar: AnimalType, size: number = 44) => {
    switch (avatar) {
      case 'lion':
        return <LionCub size={size} animate={false} />
      case 'elephant':
        return <BabyElephant size={size} animate={false} />
      case 'giraffe':
        return <BabyGiraffe size={size} animate={false} />
      case 'monkey':
        return <BabyMonkey size={size} animate={false} />
      case 'zebra':
        return <BabyZebra size={size} animate={false} />
      default:
        return <LionCub size={size} animate={false} />
    }
  }

  const avatarOptions: { type: AnimalType; label: string }[] = [
    { type: 'lion', label: 'Leãozinho' },
    { type: 'elephant', label: 'Elefantinho' },
    { type: 'giraffe', label: 'Girafinha' },
    { type: 'monkey', label: 'Macaquinho' },
    { type: 'zebra', label: 'Zebrinha' },
  ]

  return (
    <section
      id="mural"
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-terracotta-500)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
            }}
          >
            <MessageSquareHeart size={16} />
            <span>Livro de Memórias</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.4rem)', color: 'var(--color-brown-900)' }}>
            Mural de Carinho para o {settings.child_name || 'Lucca'}
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', maxWidth: '560px', margin: '0.5rem auto 0 auto' }}>
            Deixe uma mensagem especial, um conselho de aventura ou um voto de bênção para guardar no coração!
          </p>
        </motion.div>

        {/* Message Form Card */}
        <div
          className="safari-card"
          style={{
            maxWidth: '680px',
            margin: '0 auto 3.5rem auto',
            padding: '2.25rem 1.75rem',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Honeypot for bots */}
            <input
              type="text"
              name="honeypot_safari"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Success notification */}
            <AnimatePresence>
              {successNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    background: 'var(--color-sage-100)',
                    color: 'var(--color-sage-800)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{successNotice}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error notification */}
            {errorNotice && (
              <div
                style={{
                  background: 'var(--color-terracotta-100)',
                  color: 'var(--color-terracotta-700)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {errorNotice}
              </div>
            )}

            {/* Author Name and Relationship side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label
                  htmlFor="msg_author"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: 'var(--color-brown-900)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Seu Nome *
                </label>
                <input
                  id="msg_author"
                  type="text"
                  required
                  placeholder="Ex: Tio Roberto"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    background: 'var(--color-cream-bg)',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="msg_rel"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: 'var(--color-brown-900)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Seu Vínculo / Grau de Parentesco
                </label>
                <input
                  id="msg_rel"
                  type="text"
                  placeholder="Ex: Padrinho, Avó, Amigo da Família"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    background: 'var(--color-cream-bg)',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
            </div>

            {/* Animal Avatar Picker */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'var(--color-brown-900)',
                  marginBottom: '0.4rem',
                }}
              >
                Escolha seu mascote da selva:
              </span>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedAvatar(opt.type)}
                    title={opt.label}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedAvatar === opt.type ? '2.5px solid var(--color-sage-600)' : '1px solid var(--color-border)',
                      background: selectedAvatar === opt.type ? 'var(--color-sage-100)' : 'var(--color-cream-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all var(--transition-fast)',
                      transform: selectedAvatar === opt.type ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    {renderAvatar(opt.type, 38)}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label
                  htmlFor="msg_text"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: 'var(--color-brown-900)',
                  }}
                >
                  Sua Mensagem com Carinho *
                </label>
                <span style={{ fontSize: '0.75rem', color: messageText.length > 450 ? 'var(--color-terracotta-500)' : 'var(--color-text-light)' }}>
                  {messageText.length}/500
                </span>
              </div>
              <textarea
                id="msg_text"
                required
                maxLength={500}
                rows={3}
                placeholder="Escreva seus votos para o Lucca..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-cream-bg)',
                  fontSize: '0.95rem',
                  resize: 'none',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{
                alignSelf: 'flex-start',
                padding: '0.85rem 1.8rem',
                fontSize: '0.95rem',
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Publicando...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Enviar Recadinho</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Messages Wall Display */}
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Loader2 size={32} className="animate-spin" color="var(--color-sage-600)" />
              <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>Carregando recadinhos...</p>
            </div>
          ) : messages.length === 0 ? (
            <div
              className="safari-card"
              style={{
                padding: '2.5rem',
                textAlign: 'center',
                background: 'var(--color-cream-card)',
              }}
            >
              <LionCub size={110} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-brown-900)', marginTop: '1rem' }}>
                Seja o primeiro a deixar uma mensagem!
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                Envie seus votos acima e inaugure este lindo livro de memórias.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {messages.slice(0, visibleCount).map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="safari-card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'var(--color-cream-card)',
                    }}
                  >
                    <div>
                      {/* Author Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-cream-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          {renderAvatar(msg.animal_avatar, 36)}
                        </div>

                        <div>
                          <h4 style={{ fontSize: '1.05rem', color: 'var(--color-brown-900)', margin: 0 }}>
                            {msg.author_name}
                          </h4>
                          {msg.relationship && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-terracotta-500)',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              {msg.relationship}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Message Content (safely rendered as text) */}
                      <p
                        style={{
                          fontSize: '0.95rem',
                          color: 'var(--color-brown-800)',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-line',
                          fontStyle: 'italic',
                        }}
                      >
                        &ldquo;{msg.message}&rdquo;
                      </p>
                    </div>

                    {/* Date stamp */}
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginTop: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px dashed var(--color-sand-200)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {new Date(msg.created_at).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < messages.length && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="btn-secondary"
                    style={{ fontSize: '0.9rem', padding: '0.7rem 1.6rem' }}
                  >
                    Ver Mais Recadinhos ({messages.length - visibleCount} restantes)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
