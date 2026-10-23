import React from 'react'
import { motion } from 'framer-motion'

interface LionCubProps {
  className?: string
  size?: number
  animate?: boolean
}

export const LionCub: React.FC<LionCubProps> = ({ className = '', size = 180, animate = true }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`lion-cub-svg ${className}`}
      initial={animate ? { scale: 0.95 } : false}
      animate={animate ? { scale: [0.98, 1.02, 0.98] } : false}
      transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
      aria-label="Ilustração do Leãozinho Baby"
      role="img"
    >
      <defs>
        <radialGradient id="lionManeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5BE5D" />
          <stop offset="100%" stopColor="#D99434" />
        </radialGradient>
        <radialGradient id="lionBodyGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FDE1A3" />
          <stop offset="100%" stopColor="#E9B766" />
        </radialGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7E9A82" />
          <stop offset="100%" stopColor="#587C60" />
        </linearGradient>
      </defs>

      {/* Tail wag */}
      <motion.g
        style={{ transformOrigin: '150px 150px' }}
        animate={animate ? { rotate: [-10, 18, -10] } : false}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <path
          d="M 130 148 C 158 140, 168 110, 160 92"
          stroke="#D99434"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="160" cy="90" r="10" fill="#B86C20" />
      </motion.g>

      {/* Body & Paws */}
      <g id="lion-body">
        <ellipse cx="100" cy="148" rx="42" ry="32" fill="url(#lionBodyGrad)" />
        <ellipse cx="100" cy="150" rx="26" ry="22" fill="#FFF6E0" opacity="0.9" />

        <ellipse cx="68" cy="165" rx="14" ry="10" fill="#E9B766" />
        <ellipse cx="132" cy="165" rx="14" ry="10" fill="#E9B766" />

        <ellipse cx="88" cy="168" rx="11" ry="8" fill="#FFF6E0" />
        <ellipse cx="112" cy="168" rx="11" ry="8" fill="#FFF6E0" />
        <circle cx="88" cy="166" r="3" fill="#D99434" opacity="0.4" />
        <circle cx="112" cy="166" r="3" fill="#D99434" opacity="0.4" />
      </g>

      {/* Big Fluffy Mane */}
      <motion.g
        id="lion-mane"
        style={{ transformOrigin: '100px 85px' }}
        animate={animate ? { rotate: [-2, 2, -2] } : false}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
      >
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => {
          const rad = (angle * Math.PI) / 180
          const cx = 100 + Math.cos(rad) * 44
          const cy = 82 + Math.sin(rad) * 44
          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={16}
              fill="url(#lionManeGrad)"
              opacity="0.96"
            />
          )
        })}
      </motion.g>

      {/* Ears with twitch */}
      <motion.g
        style={{ transformOrigin: '65px 55px' }}
        animate={animate ? { rotate: [-4, 4, -4] } : false}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <circle cx="65" cy="55" r="16" fill="#FDE1A3" />
        <circle cx="65" cy="55" r="9" fill="#F7A399" />
      </motion.g>

      <motion.g
        style={{ transformOrigin: '135px 55px' }}
        animate={animate ? { rotate: [4, -4, 4] } : false}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <circle cx="135" cy="55" r="16" fill="#FDE1A3" />
        <circle cx="135" cy="55" r="9" fill="#F7A399" />
      </motion.g>

      {/* Head */}
      <ellipse cx="100" cy="85" rx="42" ry="38" fill="url(#lionBodyGrad)" />

      {/* Rosy Cheeks */}
      <circle cx="74" cy="96" r="8" fill="#F9A492" opacity="0.5" />
      <circle cx="126" cy="96" r="8" fill="#F9A492" opacity="0.5" />

      {/* Snout / Muzzle */}
      <ellipse cx="100" cy="96" rx="18" ry="14" fill="#FFF9ED" />

      {/* Nose */}
      <path
        d="M 94 90 C 94 88, 106 88, 106 90 C 106 95, 100 98, 100 98 C 100 98, 94 95, 94 90 Z"
        fill="#613916"
      />

      {/* Mouth curve */}
      <path
        d="M 100 98 L 100 102 M 100 102 Q 94 107 88 103 M 100 102 Q 106 107 112 103"
        stroke="#613916"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Big Twinkling Baby Eyes (with blink) */}
      <motion.g
        style={{ transformOrigin: '100px 80px' }}
        animate={animate ? { scaleY: [1, 1, 0.1, 1, 1] } : false}
        transition={{ repeat: Infinity, duration: 4.8, times: [0, 0.9, 0.93, 0.96, 1] }}
      >
        <circle cx="82" cy="78" r="7" fill="#382413" />
        <circle cx="79.5" cy="75.5" r="2.5" fill="#FFFFFF" />
        <circle cx="84" cy="80" r="1.2" fill="#FFFFFF" />

        <circle cx="118" cy="78" r="7" fill="#382413" />
        <circle cx="115.5" cy="75.5" r="2.5" fill="#FFFFFF" />
        <circle cx="120" cy="80" r="1.2" fill="#FFFFFF" />
      </motion.g>

      {/* Cute Little Explorer Safari Hat Leaf */}
      <motion.g
        style={{ transformOrigin: '100px 48px' }}
        animate={animate ? { rotate: [-5, 5, -5] } : false}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      >
        <path
          d="M 100 48 C 112 36, 126 44, 120 54 C 110 55, 102 52, 100 48 Z"
          fill="url(#leafGrad)"
        />
        <path d="M 100 48 Q 110 47 118 51" stroke="#3D5A44" strokeWidth="1" fill="none" />
      </motion.g>
    </motion.svg>
  )
}
