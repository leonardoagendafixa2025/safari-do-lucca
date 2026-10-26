import React from 'react'
import { motion } from 'framer-motion'
import { Heart, ArrowUp, Lock } from 'lucide-react'
import type { EventSettings } from '../../types'
import { LionCub, BabyElephant, BabyGiraffe, BabyZebra, BabyMonkey } from '../illustrations'

interface ClosingSectionProps {
  settings: EventSettings
  onOpenAdmin: () => void
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ settings, onOpenAdmin }) => {
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
        {/* Main Closing Card */}
        <motion.div
          className="safari-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            padding: '3rem 2rem 2.5rem 2rem',
            textAlign: 'center',
            background: 'rgba(255, 253, 249, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(229, 190, 94, 0.45)',
            boxShadow: '0 16px 48px -8px rgba(45, 34, 23, 0.16)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Gathering of all Baby Animals */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ transform: 'translateY(5px)' }}>
              <BabyGiraffe size={85} />
            </div>
            <div style={{ transform: 'translateY(-3px)' }}>
              <BabyElephant size={90} />
            </div>
            <div style={{ transform: 'scale(1.1)', zIndex: 2 }}>
              <LionCub size={115} />
            </div>
            <div style={{ transform: 'translateY(-3px)' }}>
              <BabyZebra size={90} />
            </div>
            <div style={{ transform: 'translateY(8px)' }}>
              <BabyMonkey size={80} />
            </div>
          </div>

          {/* Closing Title & Message */}
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', color: 'var(--color-brown-900)', marginBottom: '1rem' }}>
            Esperamos Você!
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: 'var(--color-brown-800)',
              fontStyle: 'italic',
              maxWidth: '560px',
              margin: '0 auto 2rem auto',
            }}
          >
            {settings.closing_message ||
              'Esperamos você e sua família para viver essa grande aventura com a gente! Com muito amor, Lucca e Papais.'}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              width: '100%',
            }}
          >
            {/* Back to top */}
            <button
              onClick={handleScrollToTop}
              className="btn-primary"
              style={{
                padding: '0.9rem 2.2rem',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 25px rgba(88, 124, 96, 0.35)',
              }}
            >
              <ArrowUp size={18} />
              <span>Voltar ao Início</span>
            </button>
          </div>
        </motion.div>

        {/* Discrete Admin Link & Footer Note with frosted badge */}
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 253, 249, 0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(229, 190, 94, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            boxShadow: '0 4px 15px rgba(45, 34, 23, 0.08)',
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
              color: 'var(--color-text-light)',
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
