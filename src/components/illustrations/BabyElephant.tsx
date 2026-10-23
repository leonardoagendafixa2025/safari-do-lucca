import React from 'react'
import { motion } from 'framer-motion'

interface BabyElephantProps {
  className?: string
  size?: number
  animate?: boolean
}

export const BabyElephant: React.FC<BabyElephantProps> = ({ className = '', size = 180, animate = true }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`baby-elephant-svg ${className}`}
      initial={animate ? { scale: 0.95 } : false}
      animate={animate ? { scale: [0.98, 1.02, 0.98] } : false}
      transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
      aria-label="Ilustração do Elefantinho Baby"
      role="img"
    >
      <defs>
        <radialGradient id="elephantBody" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#DFE8EC" />
          <stop offset="100%" stopColor="#B4C6CF" />
        </radialGradient>
        <radialGradient id="elephantEarInner" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F9D4D0" />
          <stop offset="100%" stopColor="#F5B8B1" />
        </radialGradient>
      </defs>

      {/* Flapping Big Ears */}
      <motion.g
        style={{ transformOrigin: '65px 85px' }}
        animate={animate ? { rotate: [-8, 6, -8] } : false}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
      >
        <ellipse cx="48" cy="85" rx="36" ry="46" fill="url(#elephantBody)" transform="rotate(-15 48 85)" />
        <ellipse cx="48" cy="85" rx="24" ry="34" fill="url(#elephantEarInner)" opacity="0.85" transform="rotate(-15 48 85)" />
      </motion.g>

      <motion.g
        style={{ transformOrigin: '135px 85px' }}
        animate={animate ? { rotate: [8, -6, 8] } : false}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
      >
        <ellipse cx="152" cy="85" rx="36" ry="46" fill="url(#elephantBody)" transform="rotate(15 152 85)" />
        <ellipse cx="152" cy="85" rx="24" ry="34" fill="url(#elephantEarInner)" opacity="0.85" transform="rotate(15 152 85)" />
      </motion.g>

      {/* Body & Paws */}
      <ellipse cx="100" cy="148" rx="44" ry="34" fill="url(#elephantBody)" />
      <ellipse cx="100" cy="152" rx="28" ry="22" fill="#EEF4F7" opacity="0.8" />

      {/* Feet with cute toenails */}
      <g id="elephant-feet">
        <ellipse cx="70" cy="168" rx="14" ry="9" fill="#B4C6CF" />
        <circle cx="64" cy="170" r="2.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="70" cy="171" r="2.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="76" cy="170" r="2.5" fill="#FFFFFF" opacity="0.9" />

        <ellipse cx="130" cy="168" rx="14" ry="9" fill="#B4C6CF" />
        <circle cx="124" cy="170" r="2.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="130" cy="171" r="2.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="136" cy="170" r="2.5" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Head */}
      <ellipse cx="100" cy="90" rx="42" ry="38" fill="url(#elephantBody)" />

      {/* Baby tuft of hair */}
      <path
        d="M 97 53 C 94 44, 98 40, 100 42 C 102 40, 106 44, 103 53 Z"
        fill="#98ABB6"
      />

      {/* Rosy Cheeks */}
      <circle cx="72" cy="102" r="8" fill="#F9ADA4" opacity="0.5" />
      <circle cx="128" cy="102" r="8" fill="#F9ADA4" opacity="0.5" />

      {/* Eyes with blink */}
      <motion.g
        style={{ transformOrigin: '100px 84px' }}
        animate={animate ? { scaleY: [1, 1, 0.1, 1, 1] } : false}
        transition={{ repeat: Infinity, duration: 5, times: [0, 0.9, 0.93, 0.96, 1] }}
      >
        <circle cx="82" cy="84" r="6" fill="#2E3C44" />
        <circle cx="80" cy="82" r="2.2" fill="#FFFFFF" />
        <circle cx="83.5" cy="85.5" r="1" fill="#FFFFFF" />

        <circle cx="118" cy="84" r="6" fill="#2E3C44" />
        <circle cx="116" cy="82" r="2.2" fill="#FFFFFF" />
        <circle cx="119.5" cy="85.5" r="1" fill="#FFFFFF" />
      </motion.g>

      {/* Swinging Animated Trunk */}
      <motion.g
        style={{ transformOrigin: '100px 98px' }}
        animate={animate ? { rotate: [-10, 12, -10] } : false}
        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
      >
        <path
          d="M 93 98 C 92 115, 84 135, 104 136 C 118 137, 122 122, 114 118 C 108 116, 103 125, 106 128"
          stroke="url(#elephantBody)"
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />
        <line x1="93" y1="108" x2="103" y2="108" stroke="#9BB0BC" strokeWidth="2" strokeLinecap="round" />
        <line x1="91" y1="116" x2="101" y2="116" stroke="#9BB0BC" strokeWidth="2" strokeLinecap="round" />
      </motion.g>

      {/* Floating tiny heart from trunk */}
      <motion.path
        d="M 124 108 C 124 104, 120 102, 118 105 C 116 102, 112 104, 112 108 C 112 113, 118 117, 118 117 C 118 117, 124 113, 124 108 Z"
        fill="#E08C70"
        opacity="0.85"
        animate={animate ? { y: [-2, -8, -2], opacity: [0.6, 1, 0.6] } : false}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}
