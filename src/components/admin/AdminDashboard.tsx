import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, UserX, UserPlus, MessageSquare, ArrowUpRight } from 'lucide-react'
import type { RSVPStats, RSVP } from '../../types'
import { getStats, getRSVPs } from '../../services/supabase'

interface AdminDashboardProps {
  onGoToGuests: () => void
  onGoToMessages: () => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onGoToGuests, onGoToMessages }) => {
  const [stats, setStats] = useState<RSVPStats>({
    total_rsvps: 0,
    confirmed_guests: 0,
    declined_guests: 0,
    total_companions: 0,
    total_attendees: 0,
    pending_messages: 0,
  })
  const [recentRSVPs, setRecentRSVPs] = useState<RSVP[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [st, rsvps] = await Promise.all([getStats(), getRSVPs()])
        setStats(st)
        setRecentRSVPs(rsvps.slice(0, 5))
      } catch (e) {
        console.error(e)
      }
    }
    loadData()
  }, [])

  const statCards = [
    {
      label: 'Presenças Confirmadas',
      value: stats.confirmed_guests,
      icon: UserCheck,
      color: 'var(--color-sage-600)',
      bg: 'var(--color-sage-100)',
      sub: `${stats.total_attendees} pessoas no total (com acompanhantes)`,
    },
    {
      label: 'Recusas',
      value: stats.declined_guests,
      icon: UserX,
      color: 'var(--color-terracotta-500)',
      bg: 'var(--color-terracotta-100)',
      sub: 'Não poderão comparecer',
    },
    {
      label: 'Total de Acompanhantes',
      value: stats.total_companions,
      icon: UserPlus,
      color: 'var(--color-gold-500)',
      bg: '#FFF7E6',
      sub: 'Adultos e crianças adicionais',
    },
    {
      label: 'Recados Pendentes',
      value: stats.pending_messages,
      icon: MessageSquare,
      color: '#4A6984',
      bg: '#EAF1F7',
      sub: stats.pending_messages > 0 ? 'Aguardando aprovação' : 'Tudo moderado',
      onClick: onGoToMessages,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={card.onClick}
              className="safari-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                cursor: card.onClick ? 'pointer' : 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  {card.label}
                </span>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    background: card.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                  }}
                >
                  <Icon size={20} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.4rem',
                    fontWeight: 800,
                    color: 'var(--color-brown-900)',
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </span>
              </div>

              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                {card.sub}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Recent RSVPs Table Snapshot */}
      <div className="safari-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-brown-900)', margin: 0 }}>
              Últimas Confirmações
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Resumo das respostas mais recentes enviadas pelos convidados
            </span>
          </div>

          <button
            onClick={onGoToGuests}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <span>Ver Todos</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {recentRSVPs.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Nenhuma confirmação registrada ainda.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-sand-200)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Convidado</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Acompanhantes</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentRSVPs.map((rsvp) => (
                  <tr key={rsvp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: 'var(--color-brown-900)' }}>
                      {rsvp.guest_name}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: rsvp.attending ? 'var(--color-sage-100)' : 'var(--color-terracotta-100)',
                          color: rsvp.attending ? 'var(--color-sage-800)' : 'var(--color-terracotta-700)',
                        }}
                      >
                        {rsvp.attending ? 'Confirmado' : 'Recusado'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-text-muted)' }}>
                      {rsvp.attending ? `${rsvp.companions_count} acompanhante(s)` : '-'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-text-light)', fontSize: '0.8rem' }}>
                      {new Date(rsvp.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
