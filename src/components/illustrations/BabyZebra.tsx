import React from 'react'
import { motion } from 'framer-motion'

interface BabyZebraProps {
  className?: string
  size?: number
  animate?: boolean
}

export const BabyZebra: React.FC<BabyZebraProps> = ({ className = '', size = 180, animate = true }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`baby-zebra-svg ${className}`}
      initial={animate ? { scale: 0.95 } : false}
      animate={animate ? { scale: [0.98, 1.02, 0.98] } : false}
      transition={{ repeat: Infinity, duration: 4.4, ease: 'easeInOut' }}
      aria-label="Ilustração da Zebrinha Baby"
      role="img"
    >
      <defs>
        <radialGradient id="zebraCoat" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EDE8DE" />
        </radialGradient>
      </defs>

      {/* Tail with brush */}
      <motion.g
        animate={animate ? { rotate: [-10, 15, -10] } : false}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        style={{ transformOrigin: '140px 145px' }}
      >
        <path d="M 135 145 C 155 142, 165 125, 160 110" stroke="#EDE8DE" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 160 110 C 163 105, 168 112, 162 118" stroke="#382F2D" strokeWidth="6" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Body */}
      <ellipse cx="100" cy="148" rx="42" ry="32" fill="url(#zebraCoat)" />

      {/* Body Stripes */}
      <path d="M 80 135 Q 92 142 85 155" stroke="#4A3D39" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M 100 132 Q 104 145 98 158" stroke="#4A3D39" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M 118 135 Q 112 145 116 156" stroke="#4A3D39" strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {/* Feet with hooves */}
      <g id="zebra-feet">
        <rect x="74" y="166" width="14" height="18" rx="6" fill="#EDE8DE" />
        <rect x="74" y="176" width="14" height="8" rx="4" fill="#3D322E" />
        <rect x="112" y="166" width="14" height="18" rx="6" fill="#EDE8DE" />
        <rect x="112" y="176" width="14" height="8" rx="4" fill="#3D322E" />
      </g>

      {/* Mane crest (Mohawk style on head/neck) */}
      <g id="zebra-mane">
        {[76, 84, 92, 100, 108, 116, 124].map((x, i) => (
          <path
            key={i}
            d={`M ${x} 48 L ${x + 2} 32`}
            stroke={i % 2 === 0 ? '#382F2D' : '#EDE8DE'}
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Ears */}
      <motion.g
        animate={animate ? { rotate: [-5, 5, -5] } : false}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ transformOrigin: '70px 55px' }}
      >
        <ellipse cx="70" cy="55" rx="14" ry="7" fill="#EDE8DE" transform="rotate(-35 70 55)" />
        <ellipse cx="70" cy="55" rx="9" ry="4" fill="#F7A399" transform="rotate(-35 70 55)" />
      </motion.g>

      <motion.g
        animate={animate ? { rotate: [5, -5, 5] } : false}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ transformOrigin: '130px 55px' }}
      >
        <ellipse cx="130" cy="55" rx="14" ry="7" fill="#EDE8DE" transform="rotate(35 130 55)" />
        <ellipse cx="130" cy="55" rx="9" ry="4" fill="#F7A399" transform="rotate(35 130 55)" />
      </motion.g>

      {/* Head */}
      <ellipse cx="100" cy="85" rx="36" ry="34" fill="url(#zebraCoat)" />

      {/* Head stripes */}
      <path d="M 88 56 Q 96 68 86 76" stroke="#4A3D39" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 112 56 Q 104 68 114 76" stroke="#4A3D39" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 100 52 L 100 66" stroke="#4A3D39" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Snout */}
      <ellipse cx="100" cy="98" rx="18" ry="14" fill="#5A4742" />
      <circle cx="94" cy="96" r="2.2" fill="#2E2320" />
      <circle cx="106" cy="96" r="2.2" fill="#2E2320" />
      <path d="M 95 103 Q 100 106 105 103" stroke="#2E2320" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Cheeks */}
      <circle cx="72" cy="95" r="7" fill="#F9ADA4" opacity="0.6" />
      <circle cx="128" cy="95" r="7" fill="#F9ADA4" opacity="0.6" />

      {/* Eyes with blink */}
      <motion.g
        animate={animate ? { scaleY: [1, 1, 0.1, 1, 1] } : false}
        transition={{ repeat: Infinity, duration: 4.8, times: [0, 0.9, 0.93, 0.96, 1] }}
        style={{ transformOrigin: '100px 80px' }}
      >
        <circle cx="82" cy="80" r="6" fill="#2E2320" />
        <circle cx="80" cy="78" r="2" fill="#FFFFFF" />

        <circle cx="118" cy="80" r="6" fill="#2E2320" />
        <circle cx="116" cy="78" r="2" fill="#FFFFFF" />
      </motion.g>
    </motion.svg>
  )
}
