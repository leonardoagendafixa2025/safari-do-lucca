import React from 'react'
import { motion } from 'framer-motion'

interface SafariBirdProps {
  className?: string
  size?: number
  animate?: boolean
  direction?: 'left' | 'right'
}

export const SafariBird: React.FC<SafariBirdProps> = ({
  className = '',
  size = 60,
  animate = true,
  direction = 'right',
}) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 80"
      width={size}
      height={(size * 80) / 100}
      className={`safari-bird-svg ${className}`}
      style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
      animate={animate ? { y: [-3, 3, -3] } : false}
      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      aria-label="Passarinho do Safari"
      role="img"
    >
      <defs>
        <radialGradient id="birdGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F5BE5D" />
          <stop offset="100%" stopColor="#E08C70" />
        </radialGradient>
      </defs>

      {/* Tail feather */}
      <path d="M 28 48 L 12 55 L 20 44 Z" fill="#C97255" />

      {/* Body */}
      <ellipse cx="50" cy="45" rx="24" ry="18" fill="url(#birdGrad)" />
      <ellipse cx="56" cy="48" rx="14" ry="12" fill="#FFF7E6" opacity="0.85" />

      {/* Head */}
      <circle cx="68" cy="35" r="14" fill="#F5BE5D" />

      {/* Beak */}
      <path d="M 80 35 L 94 38 L 80 43 Z" fill="#CA9E3B" />

      {/* Eye */}
      <circle cx="72" cy="33" r="2.5" fill="#33251B" />
      <circle cx="71.2" cy="32.2" r="0.8" fill="#FFFFFF" />

      {/* Cheek */}
      <circle cx="68" cy="39" r="3" fill="#F9ADA4" opacity="0.7" />

      {/* Wing with flapping animation */}
      <motion.g
        style={{ transformOrigin: '42px 42px' }}
        animate={animate ? { rotate: [-15, 15, -15] } : false}
        transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
      >
        <path
          d="M 42 42 C 30 35, 32 55, 48 48 C 52 46, 50 40, 42 42 Z"
          fill="#587C60"
        />
      </motion.g>

      {/* Little feet */}
      <line x1="46" y1="62" x2="44" y2="70" stroke="#CA9E3B" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="62" x2="54" y2="70" stroke="#CA9E3B" strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  )
}
