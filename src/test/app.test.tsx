import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import App from '../App'

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = ''
  })

  it('renders the main Safari do Lucca hero section', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Lucca/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Começar a Aventura/i })).toBeInTheDocument()
    })
  })

  it('displays the countdown section', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Contagem Regressiva/i })).toBeInTheDocument()
    })
  })

  it('allows filling and interacting with the RSVP form', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Ex: Ana Maria Silva/i)).toBeInTheDocument()
    })

    const nameInput = screen.getByPlaceholderText(/Ex: Ana Maria Silva/i)
    fireEvent.change(nameInput, { target: { value: 'Maria Silva' } })

    const confirmButton = screen.getByRole('button', { name: /Confirmar Presença/i })
    expect(confirmButton).toBeInTheDocument()
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
      expect(screen.getByText(/Início às 14:00h/i)).toBeInTheDocument()
    })
  })
})
