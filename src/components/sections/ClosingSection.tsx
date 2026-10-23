import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Share2, ArrowUp, Lock } from 'lucide-react'
import type { EventSettings } from '../../types'
import { LionCub, BabyElephant, BabyGiraffe, BabyZebra, BabyMonkey } from '../illustrations'

interface ClosingSectionProps {
  settings: EventSettings
  onOpenAdmin: () => void
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ settings, onOpenAdmin }) => {
  const handleShareWhatsApp = () => {
    const text = `🦁 *Convite Especial: Safari do ${settings.child_name || 'Lucca'} - 1 Aninho!*\n\n` +
      `Você está convidado para viver essa grande aventura com a gente!\n` +
      `📅 Data: ${new Date(settings.event_date).toLocaleDateString('pt-BR')}\n` +
      `🕒 Horário: ${settings.event_time_display}\n` +
      `📍 Local: ${settings.venue_name}\n\n` +
      `Acesse o convite interativo e confirme sua presença aqui:\n${window.location.origin}`

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      id="encerramento"
      style={{
        padding: '5rem 1.25rem 3rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        background: 'linear-gradient(180deg, transparent 0%, rgba(223, 213, 195, 0.35) 100%)',
      }}
    >
      <div className="container" style={{ position: 'relative' }}>
        {/* Gathering of all Baby Animals */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          <div style={{ transform: 'translateY(5px)' }}>
            <BabyGiraffe size={100} />
          </div>
          <div style={{ transform: 'translateY(-5px)' }}>
            <BabyElephant size={105} />
          </div>
          <div style={{ transform: 'scale(1.15)', zIndex: 2 }}>
            <LionCub size={140} />
          </div>
          <div style={{ transform: 'translateY(-5px)' }}>
            <BabyZebra size={105} />
          </div>
          <div style={{ transform: 'translateY(10px)' }}>
            <BabyMonkey size={95} />
          </div>
        </div>

        {/* Closing Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '620px', margin: '0 auto 2.5rem auto' }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', color: 'var(--color-brown-900)', marginBottom: '1rem' }}>
            Esperamos Você!
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: 'var(--color-brown-800)',
              fontStyle: 'italic',
            }}
          >
            {settings.closing_message ||
              'Esperamos você e sua família para viver essa grande aventura com a gente! Com muito amor, Lucca e Papais.'}
          </p>
        </motion.div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          {/* Share on WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="btn-primary"
            style={{
              padding: '0.85rem 1.8rem',
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              boxShadow: '0 8px 20px rgba(37, 211, 102, 0.28)',
            }}
          >
            <Share2 size={18} />
            <span>Compartilhar Convite</span>
          </button>

          {/* Back to top */}
          <button
            onClick={handleScrollToTop}
            className="btn-secondary"
            style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}
          >
            <ArrowUp size={18} />
            <span>Voltar ao Início</span>
          </button>
        </div>

        {/* Discrete Admin Link & Footer Note */}
        <div
          style={{
            borderTop: '1px solid var(--color-sand-300)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--color-text-light)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Feito com todo carinho para o 1º aninho do {settings.child_name || 'Lucca'}</span>
            <Heart size={14} color="var(--color-terracotta-500)" fill="currentColor" />
          </div>

          <button
            onClick={onOpenAdmin}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Lock size={12} />
            <span>Área Administrativa</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
