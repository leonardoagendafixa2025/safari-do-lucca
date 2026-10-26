import React, { useEffect, useRef, useState, useCallback } from 'react'

interface SafariScrollVideoBackgroundProps {
  videoSrc?: string
}

export const SafariScrollVideoBackground: React.FC<SafariScrollVideoBackgroundProps> = ({
  videoSrc = '/fundo_video.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Scroll & animation progress refs
  const targetProgressRef = useRef<number>(0)
  const currentProgressRef = useRef<number>(0)
  const rafIdRef = useRef<number | null>(null)
  const isMobileUnlockedRef = useRef<boolean>(false)

  // Calculate target progress from scroll position
  const updateScrollProgress = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset || 0
    const docHeight = document.documentElement.scrollHeight
    const winHeight = window.innerHeight
    const maxScroll = Math.max(1, docHeight - winHeight)

    const progress = Math.min(1, Math.max(0, scrollY / maxScroll))
    targetProgressRef.current = progress
  }, [])

  // Continuous animation loop using native video.seeking
  useEffect(() => {
    let active = true

    const loop = () => {
      if (!active) return

      const diff = targetProgressRef.current - currentProgressRef.current

      // Lerp smoothing factor for natural fluid motion
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.16
      } else {
        currentProgressRef.current = targetProgressRef.current
      }

      const video = videoRef.current
      if (video && video.duration && !video.seeking) {
        const targetSeconds = Math.min(
          video.duration,
          Math.max(0, currentProgressRef.current * video.duration)
        )
        const timeDiff = Math.abs(video.currentTime - targetSeconds)

        // Only seek if difference is greater than ~1 frame (0.03s at 24fps)
        if (timeDiff > 0.03) {
          try {
            if (
              'fastSeek' in video &&
              typeof (video as unknown as { fastSeek: (t: number) => void }).fastSeek === 'function'
            ) {
              ;(video as unknown as { fastSeek: (t: number) => void }).fastSeek(targetSeconds)
            } else {
              video.currentTime = targetSeconds
            }
          } catch {
            // Fallback
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(loop)
    }

    rafIdRef.current = requestAnimationFrame(loop)

    return () => {
      active = false
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  // Setup video event handlers & mobile gesture unlocks
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setIsVideoReady(true)
      updateScrollProgress()
    }

    const handleSeeked = () => {
      if (video.duration && !video.seeking) {
        const targetSeconds = currentProgressRef.current * video.duration
        if (Math.abs(video.currentTime - targetSeconds) > 0.03) {
          try {
            video.currentTime = Math.min(video.duration, Math.max(0, targetSeconds))
          } catch {
            // Ignored
          }
        }
      }
    }

    const handleError = () => {
      console.warn('Safari video failed to load:', video.error)
      setLoadError(true)
    }

    // Touch & mobile gesture unlock for iOS Safari & Android Chrome
    const unlockMobileVideo = () => {
      if (isMobileUnlockedRef.current) return
      isMobileUnlockedRef.current = true

      try {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              video.pause()
              if (video.duration) {
                video.currentTime = currentProgressRef.current * video.duration
              }
            })
            .catch(() => {
              // Handled by browser
            })
        }
      } catch {
        // Fallback
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('canplay', handleLoadedMetadata)
    video.addEventListener('seeked', handleSeeked)
    video.addEventListener('error', handleError)

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress, { passive: true })
    window.addEventListener('touchstart', unlockMobileVideo, { passive: true, once: true })
    window.addEventListener('pointerdown', unlockMobileVideo, { passive: true, once: true })

    // Check ready state immediately if already cached
    updateScrollProgress()
    if (video.readyState >= 1) {
      handleLoadedMetadata()
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('canplay', handleLoadedMetadata)
      video.removeEventListener('seeked', handleSeeked)
      video.removeEventListener('error', handleError)

      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
      window.removeEventListener('touchstart', unlockMobileVideo)
      window.removeEventListener('pointerdown', unlockMobileVideo)
    }
  }, [updateScrollProgress])

  if (loadError) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: 'var(--color-cream-bg, #FAF7F0)',
      }}
    >
      {/* Full HD 1080p Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        muted
        autoPlay={false}
        loop={false}
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          display: 'block',
          opacity: isVideoReady ? 1 : 0,
          transition: 'opacity 0.6s ease-out',
        }}
      />

      {/* Subtle edge vignette for cinematic depth without washing out color vibrancy */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 100px rgba(45, 34, 23, 0.16)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
