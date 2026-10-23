import React, { useState, useEffect } from 'react'
import { Search, Download, Trash2, CheckCircle2, XCircle, Phone, Loader2 } from 'lucide-react'
import type { RSVP } from '../../types'
import { getRSVPs, deleteRSVP } from '../../services/supabase'

export function exportRSVPsToCSV(rsvps: RSVP[], eventTitle: string): void {
  const headers = [
    'Nome Completo',
    'Confirmou Presença',
    'Qtd Acompanhantes',
    'Nomes dos Acompanhantes',
    'Telefone/WhatsApp',
    'Observações/Restrições',
    'Data de Confirmação',
  ]

  const rows = rsvps.map((r) => [
    `"${r.guest_name.replace(/"/g, '""')}"`,
    r.attending ? '"Sim"' : '"Não"',
    r.companions_count || 0,
    `"${(r.companion_names || []).join(', ').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
    `"${new Date(r.created_at).toLocaleString('pt-BR')}"`,
  ])

  // UTF-8 BOM \uFEFF to correctly display accents in Microsoft Excel
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `convidados_${eventTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const AdminGuestList: React.FC<{ eventTitle: string }> = ({ eventTitle }) => {
  const [list, setList] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'declined'>('all')

  const fetchGuests = async () => {
    setLoading(true)
    try {
      const data = await getRSVPs()
      setList(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir a resposta de "${name}"?`)) {
      await deleteRSVP(id)
      setList(prev => prev.filter(item => item.id !== id))
    }
  }

  const filtered = list.filter((r) => {
    const matchesSearch = r.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.companion_names || []).some(c => c.toLowerCase().includes(search.toLowerCase())) ||
      (r.notes || '').toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false
    if (filter === 'confirmed') return r.attending === true
    if (filter === 'declined') return r.attending === false
    return true
  })

  const totalAttendees = list
    .filter(r => r.attending)
    .reduce((acc, curr) => acc + 1 + (curr.companions_count || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header controls & Export Button */}
      <div
        className="safari-card"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-brown-900)', margin: 0 }}>
            Lista de Convidados
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Total de {list.length} respostas registradas ({totalAttendees} presentes estimados)
          </span>
        </div>

        <button
          onClick={() => exportRSVPsToCSV(list, eventTitle)}
          disabled={list.length === 0}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
        >
          <Download size={16} />
          <span>Exportar Planilha CSV</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
          <Search
            size={18}
            color="var(--color-text-light)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Buscar por convidado, acompanhante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-cream-card)',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {/* Status Filter buttons */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['all', 'confirmed', 'declined'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: filter === mode ? 'var(--color-sage-600)' : 'var(--color-cream-card)',
                color: filter === mode ? '#FFFFFF' : 'var(--color-brown-900)',
                border: '1px solid var(--color-border)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {mode === 'all' ? 'Todos' : mode === 'confirmed' ? 'Confirmados' : 'Recusados'}
            </button>
          ))}
        </div>
      </div>

      {/* Guests Table */}
      <div className="safari-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Loader2 size={32} className="animate-spin" color="var(--color-sage-600)" />
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>Carregando lista de convidados...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Nenhum convidado encontrado</p>
            <span style={{ fontSize: '0.85rem' }}>Tente alterar os termos de busca ou filtros.</span>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-sand-200)', color: 'var(--color-brown-900)' }}>
                <th style={{ padding: '0.85rem 0.75rem' }}>Convidado</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Presença</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Acompanhantes</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Contato / Notas</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Data</th>
                <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rsvp) => (
                <tr key={rsvp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: 'var(--color-brown-900)' }}>
                    {rsvp.guest_name}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: rsvp.attending ? 'var(--color-sage-100)' : 'var(--color-terracotta-100)',
                        color: rsvp.attending ? 'var(--color-sage-800)' : 'var(--color-terracotta-700)',
                      }}
                    >
                      {rsvp.attending ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {rsvp.attending ? 'Confirmado' : 'Recusado'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    {rsvp.attending ? (
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--color-brown-900)' }}>
                          +{rsvp.companions_count}
                        </span>
                        {rsvp.companion_names && rsvp.companion_names.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.2rem' }}>
                            {rsvp.companion_names.join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-light)' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', maxWidth: '240px' }}>
                    {rsvp.phone && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-sage-800)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={12} /> {rsvp.phone}
                      </div>
                    )}
                    {rsvp.notes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                        &ldquo;{rsvp.notes}&rdquo;
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                    {new Date(rsvp.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDelete(rsvp.id, rsvp.guest_name)}
                      aria-label="Excluir confirmação"
                      title="Excluir"
                      style={{
                        padding: '0.4rem',
                        color: 'var(--color-terracotta-500)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'background var(--transition-fast)',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
