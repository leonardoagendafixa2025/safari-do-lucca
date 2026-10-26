import React, { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Compass, ChevronDown } from 'lucide-react'
import type { EventSettings } from '../../types'
import { SafariBird, PalmFrond, HangingVine } from '../illustrations'
import { useAudio } from '../../context/AudioContext'

interface HeroSectionProps {
  settings: EventSettings
  onEnter: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onEnter }) => {
  const { startAudio } = useAudio()
  const [hasEntered, setHasEntered] = useState(false)

  const handleEnterSafari = async () => {
    // 1. Trigger celebratory confetti
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#76977D', '#E08C70', '#E5BE5E', '#DFD5C3', '#4A382A'],
    })

    // 2. Start audio playback
    await startAudio()

    setHasEntered(true)
    onEnter()

    // 3. Smooth scroll to first content section
    const target = document.getElementById('apresentacao')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="abertura"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Decorative Hanging Vines & Foliage Top Corners */}
      <div style={{ position: 'absolute', top: 0, left: '-10px', pointerEvents: 'none', zIndex: 1 }}>
        <HangingVine height={180} />
      </div>
      <div style={{ position: 'absolute', top: 0, right: '-10px', pointerEvents: 'none', zIndex: 1, transform: 'scaleX(-1)' }}>
        <HangingVine height={180} />
      </div>

      <div style={{ position: 'absolute', top: '15px', left: '20px', pointerEvents: 'none', opacity: 0.75 }}>
        <PalmFrond size={110} />
      </div>
      <div style={{ position: 'absolute', top: '15px', right: '20px', pointerEvents: 'none', opacity: 0.75 }}>
        <PalmFrond size={110} flipped />
      </div>

      {/* Floating Safari Bird */}
      <div style={{ position: 'absolute', top: '12%', right: '15%', zIndex: 2 }}>
        <SafariBird size={55} direction="left" />
      </div>

      {/* Main Container with Glassmorphic Plaque */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '85vh',
        }}
      >
        <motion.div
          className="safari-card"
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            maxWidth: '560px',
            width: '100%',
            padding: '2.75rem 2rem',
            borderRadius: '32px',
            background: 'rgba(255, 253, 249, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(229, 190, 94, 0.65)',
            boxShadow: '0 25px 60px -10px rgba(45, 34, 23, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.7) inset',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Badge: ✧ UMA MISSÃO ESPECIAL ✧ */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="gold-badge"
            style={{
              marginBottom: '1.25rem',
              letterSpacing: '0.1em',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            <span>✧ UMA MISSÃO ESPECIAL ✧</span>
          </motion.div>

          {/* Callout: PREPARE-SE PARA EXPLORAR! */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-sage-800)',
              fontWeight: 800,
              marginBottom: '0.5rem',
            }}
          >
            PREPARE-SE PARA EXPLORAR!
          </motion.p>

          {/* Big Name "Lucca" */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', margin: '0.2rem 0 0.6rem 0' }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 11vw, 5.5rem)',
                fontWeight: 800,
                letterSpacing: '0.03em',
                lineHeight: 1.05,
                color: 'var(--color-brown-900)',
                textShadow: '0 2px 10px rgba(92, 69, 51, 0.08)',
              }}
            >
              {settings.child_name || 'Lucca'}
            </h1>

            {/* Underline accent with sparkles */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
              <span style={{ width: '45px', height: '2px', background: 'var(--color-gold-400)', borderRadius: '2px' }} />
              <Compass size={16} color="var(--color-gold-500)" />
              <span style={{ width: '45px', height: '2px', background: 'var(--color-gold-400)', borderRadius: '2px' }} />
            </div>
          </motion.div>

          {/* Subtitle: Meu primeiro aninho */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.35rem, 3.8vw, 1.85rem)',
              fontStyle: 'italic',
              fontWeight: 700,
              color: 'var(--color-terracotta-700)',
              marginBottom: '0.65rem',
            }}
          >
            {settings.event_subtitle || 'Meu primeiro aninho'}
          </motion.p>

          {/* Invitation intro text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.55,
              maxWidth: '440px',
              margin: '0 auto 1.85rem auto',
            }}
          >
            Uma celebração cheia de encanto, descobertas e alegria espera por você!
          </motion.p>

          {/* Entrance Button: ◉ COMEÇAR A AVENTURA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <motion.button
              onClick={handleEnterSafari}
              className="btn-primary"
              style={{
                padding: '1.15rem 2.6rem',
                fontSize: '1.15rem',
                letterSpacing: '0.06em',
                boxShadow: '0 10px 25px rgba(88, 124, 96, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>◉</span>
              <span>COMEÇAR A AVENTURA</span>
            </motion.button>
          </motion.div>

          {/* Helper subtext */}
          <p style={{ marginTop: '0.95rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Toque para entrar e descobrir essa surpresa especial.
          </p>

          {/* Scroll indicator */}
          {hasEntered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ marginTop: '1.5rem', color: 'var(--color-sage-600)', cursor: 'pointer' }}
              onClick={() => {
                const target = document.getElementById('apresentacao')
                if (target) target.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <ChevronDown size={28} />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Responsive media styling for animals */}
      <style>{`
        @media (min-width: 640px) {
          .hero-animal-side {
            display: block !important;
          }
        }
      `}</style>
    </section>
  )
}
