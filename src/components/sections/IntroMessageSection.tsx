import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Volume2, VolumeX, Play } from 'lucide-react'
import type { EventSettings } from '../../types'
import { BabyGiraffe, FootprintsTrail, MonsteraLeaf } from '../illustrations'

interface IntroMessageSectionProps {
  settings: EventSettings
}

export const IntroMessageSection: React.FC<IntroMessageSectionProps> = ({ settings }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
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
      p.catch(() => {
        // Autoplay policy or video pending
      })
    }
  }, [videoLoaded])

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
      video.play()
      setIsPlaying(true)
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

          {/* Lucca's Special Animation Video (Replaces the Giraffe) */}
          <div
            style={{
              margin: '0.5rem 0 1.75rem 0',
              width: '100%',
              maxWidth: '480px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '2px solid rgba(229, 190, 94, 0.65)',
                boxShadow: '0 16px 36px -8px rgba(45, 34, 23, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                background: 'linear-gradient(135deg, rgba(255, 253, 249, 0.95) 0%, rgba(243, 236, 225, 0.85) 100%)',
                cursor: videoLoaded ? 'pointer' : 'default',
              }}
              onClick={videoLoaded ? togglePlay : undefined}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                loop
                preload="auto"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  display: videoLoaded && !videoError ? 'block' : 'none',
                  objectFit: 'cover',
                  borderRadius: '22px',
                }}
                onLoadedData={() => {
                  setVideoLoaded(true)
                  setVideoError(false)
                }}
                onError={() => {
                  setVideoError(true)
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/fundo/luca.mp4" type="video/mp4" />
                <source src="/luca.mp4" type="video/mp4" />
              </video>

              {/* Sound Toggle Button */}
              {videoLoaded && !videoError && (
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
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isMuted ? 'Ativar Som' : 'Silenciar'}</span>
                  </button>
                </div>
              )}

              {/* Play / Pause Overlay Icon when paused */}
              {videoLoaded && !videoError && !isPlaying && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.25)',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-brown-900)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Play size={24} fill="currentColor" style={{ marginLeft: '3px' }} />
                  </div>
                </div>
              )}

              {/* Friendly Fallback / While video is being added */}
              {(!videoLoaded || videoError) && (
                <div
                  style={{
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BabyGiraffe size={120} />
                  <p
                    style={{
                      marginTop: '0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--color-sage-800)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    🎬 Vídeo especial do Lucca
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Insira o arquivo luca.mp4 na pasta fundo
                  </span>
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
