import React, { useState } from 'react'
import { LayoutDashboard, Sliders, Users, MessageSquare, LogOut, ArrowLeft } from 'lucide-react'
import type { EventSettings } from '../../types'
import { signOutAdmin } from '../../services/supabase'
import { AdminDashboard } from './AdminDashboard'
import { AdminEventSettings } from './AdminEventSettings'
import { AdminGuestList } from './AdminGuestList'
import { AdminMessages } from './AdminMessages'
import { LionCub } from '../illustrations'

interface AdminPanelProps {
  settings: EventSettings
  onSettingsUpdated: (newSettings: EventSettings) => void
  onLogout: () => void
  onBackToInvite: () => void
}

type TabKey = 'dashboard' | 'settings' | 'guests' | 'messages'

export const AdminPanel: React.FC<AdminPanelProps> = ({
  settings,
  onSettingsUpdated,
  onLogout,
  onBackToInvite,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')

  const handleLogout = async () => {
    await signOutAdmin()
    onLogout()
  }

  const tabs: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'settings', label: 'Configurações', icon: Sliders },
    { key: 'guests', label: 'Convidados', icon: Users },
    { key: 'messages', label: 'Recados', icon: MessageSquare },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          background: 'var(--color-cream-card)',
          borderBottom: '1px solid var(--color-border)',
          padding: '1rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1100px',
            padding: 0,
          }}
        >
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LionCub size={40} animate={false} />
            <div>
              <h1 style={{ fontSize: '1.15rem', color: 'var(--color-brown-900)', margin: 0, lineHeight: 1.2 }}>
                Painel do Safari • {settings.child_name || 'Lucca'}
              </h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Gestão do Convite de 1 Aninho
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onBackToInvite}
              className="btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={16} />
              <span>Ver Convite</span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-terracotta-500)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid var(--color-border)',
              }}
              title="Sair do painel"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '1100px', padding: '1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  background: isActive ? 'var(--color-sage-600)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <AdminDashboard
              onGoToGuests={() => setActiveTab('guests')}
              onGoToMessages={() => setActiveTab('messages')}
            />
          )}

          {activeTab === 'settings' && (
            <AdminEventSettings
              settings={settings}
              onSettingsUpdated={onSettingsUpdated}
            />
          )}

          {activeTab === 'guests' && (
            <AdminGuestList eventTitle={settings.event_title} />
          )}

          {activeTab === 'messages' && (
            <AdminMessages />
          )}
        </div>
      </div>
    </div>
  )
}
