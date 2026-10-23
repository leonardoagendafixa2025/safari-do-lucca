import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, Music, AlertCircle } from 'lucide-react'
import { useAudio } from '../../context/AudioContext'

export const AudioPlayerController: React.FC = () => {
  const { isPlaying, volume, isMuted, error, audioUrl, togglePlay, setVolume, toggleMute } = useAudio()
  const [showControls, setShowControls] = useState(false)

  return (
    <div
      className="audio-player-floating"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 90,
      }}
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
        {/* Expanded Volume / Info Popup */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'var(--color-cream-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.85rem 1.1rem',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                minWidth: '220px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-brown-900)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Music size={14} color="var(--color-sage-600)" /> Trilha do Safari
                </span>
                <span style={{ fontSize: '0.75rem', color: isPlaying ? 'var(--color-sage-600)' : 'var(--color-text-light)', fontWeight: 600 }}>
                  {isPlaying ? 'Tocando' : 'Pausado'}
                </span>
              </div>

              {!audioUrl ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-terracotta-500)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={14} /> Áudio aguardando envio no Painel
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Desmutar' : 'Mutar'}
                    style={{ padding: '0.2rem', color: 'var(--color-brown-800)' }}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    aria-label="Volume da música"
                    style={{
                      width: '100%',
                      accentColor: 'var(--color-sage-600)',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              )}

              {error && (
                <div style={{ fontSize: '0.7rem', color: 'var(--color-terracotta-700)', lineHeight: 1.2 }}>
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.button
            onClick={togglePlay}
            onMouseEnter={() => setShowControls(true)}
            aria-label={isPlaying ? 'Pausar música da festa' : 'Tocar música da festa'}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-full)',
              background: isPlaying
                ? 'linear-gradient(135deg, var(--color-sage-600) 0%, var(--color-olive-700) 100%)'
                : 'linear-gradient(135deg, var(--color-sand-200) 0%, var(--color-sand-300) 100%)',
              color: isPlaying ? '#FFFFFF' : 'var(--color-brown-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isPlaying ? 'var(--shadow-gold)' : 'var(--shadow-md)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              position: 'relative',
              transition: 'all var(--transition-fast)',
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} fill="currentColor" style={{ marginLeft: '2px' }} />
            )}

            {/* Visualizer Waves (3 animated bars) */}
            {isPlaying && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '7px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '2px',
                  height: '8px',
                }}
              >
                {[0.4, 0.9, 0.5].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      width: '2px',
                      background: '#FFFFFF',
                      borderRadius: '1px',
                    }}
                    animate={{
                      height: ['2px', '8px', '3px'],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.7,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.button>

          {/* Quick Expand Toggle Button */}
          <button
            onClick={() => setShowControls(prev => !prev)}
            aria-label="Abrir configurações de som"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-cream-card)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-brown-800)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
