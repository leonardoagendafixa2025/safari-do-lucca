import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ExternalLink, Copy, Check } from 'lucide-react'
import type { EventSettings } from '../../types'
import { BabyElephant, FootprintsTrail } from '../illustrations'

interface LocationSectionProps {
  settings: EventSettings
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  const [copied, setCopied] = useState(false)

  if (!settings.show_location) return null

  const handleCopyAddress = async () => {
    try {
      const fullText = `${settings.venue_name} - ${settings.venue_address}`
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <section
      id="localizacao"
      style={{
        padding: '4rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <FootprintsTrail />
        </div>

        {/* Location Card */}
        <motion.div
          className="safari-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '2.75rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            background: 'rgba(255, 253, 249, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(229, 190, 94, 0.45)',
            boxShadow: '0 16px 48px -8px rgba(45, 34, 23, 0.16)',
          }}
        >
          {/* Header */}
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
            <MapPin size={16} />
            <span>Ponto de Encontro</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.4rem)', color: 'var(--color-brown-900)' }}>
            Como Chegar
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Nossa base de expedição espera por você!
          </p>

          {/* Baby Elephant */}
          <div style={{ marginBottom: '1.25rem' }}>
            <BabyElephant size={140} />
          </div>

          {/* Venue Name */}
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)',
              fontWeight: 800,
              color: 'var(--color-brown-900)',
              marginBottom: '0.5rem',
            }}
          >
            {settings.venue_name || 'Espaço Safari Encantado'}
          </h3>

          {/* Address */}
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--color-text-muted)',
              maxWidth: '480px',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}
          >
            {settings.venue_address}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
            }}
          >
            {/* Open Google Maps */}
            <a
              href={settings.maps_url || `https://maps.google.com/?q=${encodeURIComponent(settings.venue_address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                fontSize: '0.95rem',
                padding: '0.85rem 1.8rem',
              }}
            >
              <ExternalLink size={18} />
              <span>Abrir no Google Maps</span>
            </a>

            {/* Copy Address */}
            <button
              onClick={handleCopyAddress}
              className="btn-secondary"
              style={{
                fontSize: '0.95rem',
                padding: '0.85rem 1.6rem',
                position: 'relative',
              }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-sage-800)' }}
                  >
                    <Check size={18} /> Copiado!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Copy size={18} /> Copiar Endereço
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
