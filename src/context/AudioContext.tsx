import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

const DEFAULT_AUDIO = '/musica.mp3'

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
  initialAudioUrl = DEFAULT_AUDIO,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [volume, setVolumeState] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrlState] = useState<string>(() => initialAudioUrl || DEFAULT_AUDIO)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sync initialAudioUrl if prop changes
  useEffect(() => {
    if (initialAudioUrl && initialAudioUrl.trim() !== '') {
      setAudioUrlState(initialAudioUrl)
    } else {
      setAudioUrlState(DEFAULT_AUDIO)
    }
  }, [initialAudioUrl])

  // Initialize and handle Audio instance
  useEffect(() => {
    const activeUrl = audioUrl || DEFAULT_AUDIO

    if (!audioRef.current) {
      audioRef.current = new Audio(activeUrl)
      audioRef.current.loop = true
      audioRef.current.volume = isMuted ? 0 : volume
    } else {
      if (!audioRef.current.src.endsWith(activeUrl)) {
        audioRef.current.src = activeUrl
        audioRef.current.loop = true
      }
    }

    const audio = audioRef.current

    const handleEnded = () => {
      // Loop backup in case browser loop attribute glitches
      audio.currentTime = 0
      audio.play().catch(() => setIsPlaying(false))
    }
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
  }, [audioUrl, isMuted, volume])

  // Volume & Mute listener
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const startAudio = useCallback(async (): Promise<boolean> => {
    setHasStarted(true)
    const activeUrl = audioUrl || DEFAULT_AUDIO

    if (!audioRef.current) {
      audioRef.current = new Audio(activeUrl)
      audioRef.current.loop = true
      audioRef.current.volume = isMuted ? 0 : volume
    } else if (!audioRef.current.src || audioRef.current.src === window.location.href) {
      audioRef.current.src = activeUrl
      audioRef.current.loop = true
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
    const activeUrl = audioUrl || DEFAULT_AUDIO

    if (!audioRef.current) {
      startAudio()
      return
    }

    if (!audioRef.current.src || audioRef.current.src === window.location.href) {
      audioRef.current.src = activeUrl
      audioRef.current.loop = true
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
        setError('Toque no ícone de som para permitir a reprodução.')
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
    setAudioUrlState(url || DEFAULT_AUDIO)
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
