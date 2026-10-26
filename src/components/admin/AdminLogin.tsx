import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, KeyRound, Loader2, ArrowLeft } from 'lucide-react'
import { signInAdmin } from '../../services/supabase'
import { LionCub } from '../illustrations'

interface AdminLoginProps {
  onLoginSuccess: () => void
  onBackToInvite: () => void
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToInvite }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signInAdmin(email.trim(), password)
      if (result.success) {
        onLoginSuccess()
      } else {
        setError(result.error || 'Credenciais inválidas.')
      }
    } catch {
      setError('Falha ao autenticar com o servidor.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        background: 'var(--color-cream-bg)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="safari-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
        }}
      >
        <button
          onClick={onBackToInvite}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-sage-800)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            alignSelf: 'flex-start',
          }}
        >
          <ArrowLeft size={16} /> Voltar ao Convite
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <LionCub size={110} />
        </div>

        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-brown-900)', marginBottom: '0.35rem' }}>
          Painel do Safari
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
          Acesso restrito para os administradores do evento
        </p>

        {error && (
          <div
            style={{
              background: 'var(--color-terracotta-100)',
              color: 'var(--color-terracotta-700)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              textAlign: 'left',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label
              htmlFor="admin_email"
              style={{
                display: 'block',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-brown-900)',
                marginBottom: '0.3rem',
              }}
            >
              E-mail do Administrador
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="var(--color-text-light)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                id="admin_email"
                type="email"
                required
                placeholder="exemplo@safaridolucca.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-cream-bg)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin_pass"
              style={{
                display: 'block',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-brown-900)',
                marginBottom: '0.3rem',
              }}
            >
              Senha de Acesso
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={18}
                color="var(--color-text-light)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                id="admin_pass"
                type="password"
                required
                placeholder="Sua senha secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-cream-bg)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

      </motion.div>
    </div>
  )
}
