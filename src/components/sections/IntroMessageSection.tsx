import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Volume2, VolumeX, Play } from 'lucide-react'
import type { EventSettings } from '../../types'
import { FootprintsTrail, MonsteraLeaf } from '../illustrations'

interface IntroMessageSectionProps {
  settings: EventSettings
}

export const IntroMessageSection: React.FC<IntroMessageSectionProps> = ({ settings }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')

    const p = video.play()
    if (p !== undefined) {
      p.then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [])

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    const next = !video.muted
    video.muted = next
    setIsMuted(next)
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <section
      id="apresentacao"
      style={{
        padding: '5rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative' }}>
        {/* Footprint trail transition from hero */}
        <div style={{ marginBottom: '2.5rem' }}>
          <FootprintsTrail />
        </div>

        {/* Main Presentation Card */}
        <motion.div
          className="safari-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '680px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Decorative Corner Foliage */}
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', pointerEvents: 'none', opacity: 0.8 }}>
            <MonsteraLeaf size={60} color="var(--color-sage-300)" />
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-terracotta-500)',
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1rem',
            }}
          >
            <Heart size={16} fill="currentColor" />
            <span>Mensagem com Amor</span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.3rem)',
              marginBottom: '1.25rem',
              color: 'var(--color-brown-900)',
            }}
          >
            Nossa Maior Aventura
          </h2>

          {/* Lucca's Special Animation Video (Vertical 9:16 Reel Frame) */}
          <div
            style={{
              margin: '0.5rem auto 1.75rem auto',
              width: '100%',
              maxWidth: '320px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '2.5px solid rgba(229, 190, 94, 0.75)',
                boxShadow: '0 20px 40px -10px rgba(45, 34, 23, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                background: '#000000',
                cursor: 'pointer',
                aspectRatio: '9 / 16',
              }}
              onClick={togglePlay}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                src="/luca.mp4"
                poster="/luca_poster.jpg"
                playsInline
                autoPlay
                muted
                loop
                preload="auto"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Sound Toggle Button */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  zIndex: 5,
                }}
              >
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Ativar som do vídeo' : 'Silenciar som do vídeo'}
                  style={{
                    background: 'rgba(45, 34, 23, 0.82)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span>{isMuted ? 'Ativar Som' : 'Silenciar'}</span>
                </button>
              </div>

              {/* Play / Pause Overlay Icon when paused */}
              {!isPlaying && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.3)',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.92)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-brown-900)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                    }}
                  >
                    <Play size={26} fill="currentColor" style={{ marginLeft: '3px' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loving Message Text (Editable from Admin Panel!) */}
          <blockquote
            style={{
              fontSize: 'clamp(1.05rem, 3vw, 1.25rem)',
              lineHeight: 1.8,
              color: 'var(--color-brown-800)',
              fontStyle: 'italic',
              margin: '0 0 1.75rem 0',
              position: 'relative',
            }}
          >
            &ldquo;{settings.intro_message || 'Há um ano, começou a aventura mais linda das nossas vidas. Agora, chegou a hora de celebrar o primeiro aninho do nosso pequeno explorador!'}&rdquo;
          </blockquote>

          {/* Signature / Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-sand-200)',
              width: '100%',
              maxWidth: '300px',
            }}
          >
            <Sparkles size={16} color="var(--color-gold-500)" />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'var(--color-sage-800)',
                letterSpacing: '0.04em',
              }}
            >
              Com carinho, Papais do {settings.child_name || 'Lucca'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
