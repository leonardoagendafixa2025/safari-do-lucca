import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { App } from '../App'

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = ''
  })

  it('renders the main Safari do Lucca hero section', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /LUCCA/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Entrar no Safari/i })).toBeInTheDocument()
    })
  })

  it('displays the countdown section', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Contagem Regressiva/i })).toBeInTheDocument()
      expect(screen.getByText(/Dias/i)).toBeInTheDocument()
    })
  })

  it('allows filling and interacting with the RSVP form', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Seu Nome Completo \*/i)).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/Seu Nome Completo \*/i)
    fireEvent.change(nameInput, { target: { value: 'Tia Joana' } })
    expect(nameInput).toHaveValue('Tia Joana')

    const confirmBtn = screen.getByRole('button', { name: /Confirmar Presença/i })
    expect(confirmBtn).toBeInTheDocument()
  })

  it('switches to admin login when #admin hash is set', async () => {
    window.location.hash = '#admin'
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Painel do Safari/i })).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/exemplo@safaridolucca.com.br/i)).toBeInTheDocument()
    })
  })

  it('renders event details with formatted date and time', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Data & Horário/i })).toBeInTheDocument()
      expect(screen.getByText(/15:00/i)).toBeInTheDocument()
      expect(screen.getByText(/Domingo/i)).toBeInTheDocument()
      expect(screen.getByText(/13 de dezembro de 2026/i)).toBeInTheDocument()
    })
  })
})
