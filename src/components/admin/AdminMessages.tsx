import React, { useState, useEffect } from 'react'
import { Check, EyeOff, Trash2, Loader2 } from 'lucide-react'
import type { GuestMessage, MessageStatus } from '../../types'
import { getAllMessages, updateMessageStatus, deleteGuestMessage } from '../../services/supabase'

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'hidden'>('pending')

  const fetchList = async () => {
    setLoading(true)
    try {
      const data = await getAllMessages()
      setMessages(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleStatusChange = async (id: string, newStatus: MessageStatus) => {
    await updateMessageStatus(id, newStatus)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m))
  }

  const handleDelete = async (id: string, author: string) => {
    if (confirm(`Excluir permanentemente o recado de "${author}"?`)) {
      await deleteGuestMessage(id)
      setMessages(prev => prev.filter(m => m.id !== id))
    }
  }

  const filtered = messages.filter(m => {
    if (filter === 'all') return true
    return m.status === filter
  })

  const pendingCount = messages.filter(m => m.status === 'pending').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Card */}
      <div
        className="safari-card"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-brown-900)', margin: 0 }}>
            Moderação do Mural
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Gerencie recados enviados pelos convidados antes de serem exibidos publicamente.
          </span>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {(['pending', 'approved', 'hidden', 'all'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: filter === mode ? 'var(--color-sage-600)' : 'var(--color-cream-card)',
                color: filter === mode ? '#FFFFFF' : 'var(--color-brown-900)',
                border: '1px solid var(--color-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span>
                {mode === 'pending'
                  ? 'Pendentes'
                  : mode === 'approved'
                  ? 'Aprovados'
                  : mode === 'hidden'
                  ? 'Ocultos'
                  : 'Todos'}
              </span>
              {mode === 'pending' && pendingCount > 0 && (
                <span
                  style={{
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: filter === 'pending' ? 'rgba(255,255,255,0.3)' : 'var(--color-terracotta-500)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <Loader2 size={32} className="animate-spin" color="var(--color-sage-600)" />
          <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>Carregando recados...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="safari-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-brown-900)' }}>
            Nenhum recado com status "{filter}"
          </p>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Selecione outro filtro acima para visualizar outros recados.
          </span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="safari-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${
                  msg.status === 'approved'
                    ? 'var(--color-sage-600)'
                    : msg.status === 'pending'
                    ? 'var(--color-gold-500)'
                    : 'var(--color-text-light)'
                }`,
              }}
            >
              <div>
                {/* Author & Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-brown-900)', margin: 0 }}>
                      {msg.author_name}
                    </h4>
                    {msg.relationship && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-terracotta-500)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {msg.relationship}
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background:
                        msg.status === 'approved'
                          ? 'var(--color-sage-100)'
                          : msg.status === 'pending'
                          ? '#FFF7E6'
                          : 'var(--color-cream-subtle)',
                      color:
                        msg.status === 'approved'
                          ? 'var(--color-sage-800)'
                          : msg.status === 'pending'
                          ? 'var(--color-gold-500)'
                          : 'var(--color-text-muted)',
                    }}
                  >
                    {msg.status === 'approved' ? 'Aprovado' : msg.status === 'pending' ? 'Pendente' : 'Oculto'}
                  </span>
                </div>

                {/* Message Body */}
                <p style={{ fontSize: '0.9rem', color: 'var(--color-brown-800)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1rem' }}>
                  &ldquo;{msg.message}&rdquo;
                </p>
              </div>

              {/* Action Buttons & Timestamp */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>
                  Enviado em {new Date(msg.created_at).toLocaleString('pt-BR')}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                  {msg.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(msg.id, 'approved')}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-sage-100)',
                        color: 'var(--color-sage-800)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      <Check size={14} /> Aprovar
                    </button>
                  )}

                  {msg.status !== 'hidden' && (
                    <button
                      onClick={() => handleStatusChange(msg.id, 'hidden')}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-cream-subtle)',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      <EyeOff size={14} /> Ocultar
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(msg.id, msg.author_name)}
                    style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-terracotta-100)',
                      color: 'var(--color-terracotta-700)',
                      fontSize: '0.8rem',
                    }}
                    title="Excluir recado"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
