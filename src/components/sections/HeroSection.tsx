import React, { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Compass, Sparkles, ChevronDown } from 'lucide-react'
import type { EventSettings } from '../../types'
import { LionCub, BabyGiraffe, BabyElephant, SafariBird, PalmFrond, HangingVine } from '../illustrations'
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

      {/* Main Container */}
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Safari Explorer Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="gold-badge"
          style={{ marginBottom: '1.25rem' }}
        >
          <Compass size={16} color="var(--color-gold-500)" />
          <span>Convite Especial • Safari Baby</span>
        </motion.div>

        {/* Subtitle Invitation Callout */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-sage-800)',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          Você está convidado para uma grande aventura!
        </motion.p>

        {/* Big Name "LUCCA" with majestic typography */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', margin: '0.5rem 0 1rem 0' }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.8rem, 12vw, 6.5rem)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              lineHeight: 1,
              color: 'var(--color-brown-900)',
              textShadow: '0 4px 18px rgba(92, 69, 51, 0.12)',
            }}
          >
            {settings.child_name || 'LUCCA'}
          </h1>

          {/* Underline accent with foliage leaf */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <span style={{ width: '40px', height: '2px', background: 'var(--color-gold-400)', borderRadius: '2px' }} />
            <Sparkles size={16} color="var(--color-gold-500)" />
            <span style={{ width: '40px', height: '2px', background: 'var(--color-gold-400)', borderRadius: '2px' }} />
          </div>
        </motion.div>

        {/* Subtitle: 1 Aninho */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
            fontStyle: 'italic',
            color: 'var(--color-terracotta-700)',
            marginBottom: '2rem',
          }}
        >
          {settings.event_subtitle || 'Uma Grande Aventura • 1 Aninho'}
        </motion.p>

        {/* Animal Showcase Trio (Lion, Elephant, Giraffe) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '1rem',
            margin: '0.5rem 0 2.5rem 0',
            maxWidth: '100%',
          }}
        >
          {/* Giraffe Left */}
          <div style={{ display: 'none', transform: 'translateY(-10px)' }} className="hero-animal-side">
            <BabyGiraffe size={130} />
          </div>

          {/* Lion Center (Featured Explorer) */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 120 }}
            style={{ position: 'relative' }}
          >
            <LionCub size={190} />
          </motion.div>

          {/* Elephant Right */}
          <div style={{ display: 'none', transform: 'translateY(-10px)' }} className="hero-animal-side">
            <BabyElephant size={140} />
          </div>
        </div>

        {/* Entrance Button "ENTRAR NO SAFARI" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.button
            onClick={handleEnterSafari}
            className="btn-primary"
            style={{
              padding: '1.15rem 2.5rem',
              fontSize: '1.15rem',
              letterSpacing: '0.06em',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Compass size={22} />
            <span>Entrar no Safari</span>
          </motion.button>
        </motion.div>

        {/* Helper subtext */}
        <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
          Toque para abrir a aventura e iniciar a trilha sonora
        </p>

        {/* Scroll indicator */}
        {hasEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ marginTop: '2.5rem', color: 'var(--color-sage-600)', cursor: 'pointer' }}
            onClick={() => {
              const target = document.getElementById('apresentacao')
              if (target) target.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <ChevronDown size={28} />
          </motion.div>
        )}
      </motion.div>

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
