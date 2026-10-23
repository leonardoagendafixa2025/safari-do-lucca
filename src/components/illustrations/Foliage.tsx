import React from 'react'
import { motion } from 'framer-motion'

interface FoliageProps {
  className?: string
  size?: number
  animate?: boolean
}

// 1. Monstera Leaf Component
export const MonsteraLeaf: React.FC<FoliageProps & { color?: string }> = ({
  className = '',
  size = 64,
  animate = true,
  color = '#76977D',
}) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`monstera-leaf ${className}`}
      animate={animate ? { rotate: [-4, 4, -4] } : false}
      transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <path
        d="M 50 92 C 50 65, 48 40, 50 8 C 65 18, 85 30, 88 52 C 90 68, 78 85, 50 92 Z"
        fill={color}
      />
      <path
        d="M 50 92 C 50 65, 52 40, 50 8 C 35 18, 15 30, 12 52 C 10 68, 22 85, 50 92 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Central rib */}
      <path d="M 50 94 L 50 12" stroke="#424F38" strokeWidth="2.5" strokeLinecap="round" />

      {/* Characteristic leaf slits / cutouts */}
      <ellipse cx="68" cy="42" rx="10" ry="2.5" fill="#FAF7F0" transform="rotate(25 68 42)" />
      <ellipse cx="70" cy="58" rx="12" ry="3" fill="#FAF7F0" transform="rotate(15 70 58)" />
      <ellipse cx="64" cy="74" rx="9" ry="2.8" fill="#FAF7F0" transform="rotate(5 64 74)" />

      <ellipse cx="32" cy="42" rx="10" ry="2.5" fill="#FAF7F0" transform="rotate(-25 32 42)" />
      <ellipse cx="30" cy="58" rx="12" ry="3" fill="#FAF7F0" transform="rotate(-15 30 58)" />
      <ellipse cx="36" cy="74" rx="9" ry="2.8" fill="#FAF7F0" transform="rotate(-5 36 74)" />
    </motion.svg>
  )
}

// 2. Palm Frond Component
export const PalmFrond: React.FC<FoliageProps & { flipped?: boolean }> = ({
  className = '',
  size = 80,
  animate = true,
  flipped = false,
}) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 100"
      width={size}
      height={(size * 100) / 120}
      className={`palm-frond ${className}`}
      style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
      animate={animate ? { rotate: [-3, 3, -3] } : false}
      transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      {/* Stem */}
      <path d="M 10 90 Q 60 70 110 20" stroke="#424F38" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Fronds leaflets */}
      <path d="M 30 78 Q 45 60 40 45" stroke="#587C60" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M 45 70 Q 65 50 62 35" stroke="#76977D" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M 60 62 Q 85 42 85 24" stroke="#587C60" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M 75 52 Q 100 32 105 15" stroke="#76977D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 90 40 Q 115 22 118 8" stroke="#587C60" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Downside leaflets */}
      <path d="M 38 82 Q 40 92 36 100" stroke="#76977D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 55 74 Q 62 86 62 95" stroke="#587C60" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 72 63 Q 84 75 88 85" stroke="#76977D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 88 50 Q 102 60 108 70" stroke="#587C60" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </motion.svg>
  )
}

// 3. Delicate Safari Flower / Blossom
export const SafariFlower: React.FC<FoliageProps & { color?: string }> = ({
  className = '',
  size = 32,
  animate = true,
  color = '#E08C70',
}) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      width={size}
      height={size}
      className={`safari-flower ${className}`}
      animate={animate ? { rotate: [0, 360] } : false}
      transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
      aria-hidden="true"
    >
      {[0, 72, 144, 216, 288].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180
        const cx = 30 + Math.cos(rad) * 12
        const cy = 30 + Math.sin(rad) * 12
        return (
          <ellipse
            key={idx}
            cx={cx}
            cy={cy}
            rx="8"
            ry="6"
            fill={color}
            opacity="0.85"
            transform={`rotate(${angle} ${cx} ${cy})`}
          />
        )
      })}
      <circle cx="30" cy="30" r="6" fill="#F5BE5D" />
      <circle cx="30" cy="30" r="3" fill="#CA9E3B" />
    </motion.svg>
  )
}

// 4. Hanging Jungle Vine
export const HangingVine: React.FC<{ height?: number; className?: string }> = ({
  height = 160,
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 160"
      width="40"
      height={height}
      className={`hanging-vine ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 25 0 Q 35 40 20 80 Q 8 120 28 160"
        stroke="#587C60"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28" cy="30" r="5" fill="#76977D" />
      <circle cx="16" cy="70" r="6" fill="#587C60" />
      <circle cx="20" cy="110" r="5" fill="#76977D" />
      <circle cx="25" cy="145" r="4" fill="#587C60" />
    </svg>
  )
}
