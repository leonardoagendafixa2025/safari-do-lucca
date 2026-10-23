import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

interface AudioContextType {
  isPlaying: boolean
  hasStarted: boolean
  volume: number
  isMuted: boolean
  error: string | null
  audioUrl: string | null
  startAudio: () => Promise<boolean>
  togglePlay: () => void
  setVolume: (vol: number) => void
  toggleMute: () => void
  setAudioUrl: (url: string) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export const AudioProvider: React.FC<{ children: React.ReactNode; initialAudioUrl?: string }> = ({
  children,
  initialAudioUrl = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [volume, setVolumeState] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrlState] = useState<string | null>(initialAudioUrl || null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sync initialAudioUrl if prop changes
  useEffect(() => {
    if (initialAudioUrl) {
      setAudioUrlState(initialAudioUrl)
    }
  }, [initialAudioUrl])

  // Initialize and handle Audio instance
  useEffect(() => {
    if (!audioUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.loop = true
      audioRef.current.volume = isMuted ? 0 : volume
    } else {
      audioRef.current.src = audioUrl
    }

    const audio = audioRef.current

    const handleEnded = () => setIsPlaying(false)
    const handlePause = () => setIsPlaying(false)
    const handlePlay = () => {
      setIsPlaying(true)
      setError(null)
    }
    const handleError = () => {
      setError('Não foi possível carregar a música do safari.')
      setIsPlaying(false)
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('error', handleError)
    }
  }, [audioUrl])

  // Volume & Mute listener
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const startAudio = useCallback(async (): Promise<boolean> => {
    setHasStarted(true)
    if (!audioUrl) {
      // Audio not configured yet
      return false
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.loop = true
      audioRef.current.volume = isMuted ? 0 : volume
    }

    try {
      await audioRef.current.play()
      setIsPlaying(true)
      setError(null)
      return true
    } catch (err: unknown) {
      console.warn('Playback initiation prevented or file unreachable:', err)
      setError('Toque no ícone de música para ativar a reprodução.')
      setIsPlaying(false)
      return false
    }
  }, [audioUrl, isMuted, volume])

  const togglePlay = useCallback(() => {
    if (!audioUrl) {
      setError('Música ainda não configurada no Painel do Evento.')
      return
    }

    if (!audioRef.current) {
      startAudio()
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        setError(null)
      }).catch(err => {
        console.warn('Play failed', err)
        setError('Erro ao reproduzir o áudio.')
      })
    }
  }, [audioUrl, isPlaying, startAudio])

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val))
    setVolumeState(clamped)
    if (clamped > 0 && isMuted) {
      setIsMuted(false)
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  const setAudioUrl = useCallback((url: string) => {
    setAudioUrlState(url)
    setError(null)
  }, [])

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        hasStarted,
        volume,
        isMuted,
        error,
        audioUrl,
        startAudio,
        togglePlay,
        setVolume,
        toggleMute,
        setAudioUrl,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
