import React, { useState, useEffect } from 'react'
import type { EventSettings } from './types'
import { DEFAULT_EVENT_SETTINGS } from './config/defaults'
import { getEventSettings, checkIsAdminAuthenticated } from './services/supabase'
import { AudioProvider } from './context/AudioContext'
import { AudioPlayerController } from './components/audio/AudioPlayerController'
import { SafariScrollVideoBackground } from './components/background/SafariScrollVideoBackground'
import { HeroSection } from './components/sections/HeroSection'
import { IntroMessageSection } from './components/sections/IntroMessageSection'
import { CountdownSection } from './components/sections/CountdownSection'
import { EventDetailsSection } from './components/sections/EventDetailsSection'
import { LocationSection } from './components/sections/LocationSection'
import { RSVPSection } from './components/sections/RSVPSection'
import { GuestbookSection } from './components/sections/GuestbookSection'
import { ClosingSection } from './components/sections/ClosingSection'
import { AdminPanel } from './components/admin/AdminPanel'
import { AdminLogin } from './components/admin/AdminLogin'

export const App: React.FC = () => {
  const [settings, setSettings] = useState<EventSettings>(DEFAULT_EVENT_SETTINGS)
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin' || window.location.pathname === '/admin'
  })
  const [isAdminAuth, setIsAdminAuth] = useState(() => checkIsAdminAuthenticated())

  // Listen to hash change (e.g. #admin)
  useEffect(() => {
    const handleHash = () => {
      setIsAdminView(window.location.hash === '#admin' || window.location.pathname === '/admin')
      setIsAdminAuth(checkIsAdminAuthenticated())
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Fetch event settings on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await getEventSettings()
        setSettings(data)
      } catch (err) {
        console.error('Failed to load settings', err)
      }
    }
    load()
  }, [])

  const handleOpenAdmin = () => {
    window.location.hash = '#admin'
    setIsAdminView(true)
    setIsAdminAuth(checkIsAdminAuthenticated())
  }

  const handleBackToInvite = () => {
    window.location.hash = ''
    setIsAdminView(false)
  }

  const handleSettingsUpdated = (newSettings: EventSettings) => {
    setSettings(newSettings)
  }

  // ----------------------------------------------------
  // ADMIN VIEW
  // ----------------------------------------------------
  if (isAdminView) {
    if (!isAdminAuth) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminAuth(true)}
          onBackToInvite={handleBackToInvite}
        />
      )
    }

    return (
      <AdminPanel
        settings={settings}
        onSettingsUpdated={handleSettingsUpdated}
        onLogout={() => setIsAdminAuth(false)}
        onBackToInvite={handleBackToInvite}
      />
    )
  }

  // ----------------------------------------------------
  // PUBLIC INVITATION VIEW
  // ----------------------------------------------------
  return (
    <AudioProvider initialAudioUrl={settings.audio_url}>
      <div className="safari-experience" style={{ minHeight: '100vh', position: 'relative' }}>
        {/* Animated Full HD 1080p Scroll-Driven Video Background */}
        <SafariScrollVideoBackground />

        {/* Floating discrete music controller */}
        <AudioPlayerController />

        {/* Content sections floating above animated background */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* A. Abertura Cinematográfica */}
          <HeroSection settings={settings} onEnter={() => {}} />

          {/* B. Apresentação (Mensagem dos Pais) */}
          <IntroMessageSection settings={settings} />

          {/* C. Contagem Regressiva */}
          <CountdownSection settings={settings} />

          {/* D. Data e Horário */}
          <EventDetailsSection settings={settings} />

          {/* E. Localização e Mapa */}
          <LocationSection settings={settings} />

          {/* F. Confirmação de Presença (RSVP) */}
          <RSVPSection settings={settings} />

          {/* G. Mural de Mensagens para o Lucca */}
          <GuestbookSection settings={settings} />

          {/* H. Encerramento Afetivo */}
          <ClosingSection settings={settings} onOpenAdmin={handleOpenAdmin} />
        </div>
      </div>
    </AudioProvider>
  )
}

export default App
