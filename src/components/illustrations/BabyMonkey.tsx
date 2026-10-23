import React from 'react'
import { motion } from 'framer-motion'

interface BabyMonkeyProps {
  className?: string
  size?: number
  animate?: boolean
}

export const BabyMonkey: React.FC<BabyMonkeyProps> = ({ className = '', size = 180, animate = true }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 220"
      width={size}
      height={size * 1.1}
      className={`baby-monkey-svg ${className}`}
      initial={animate ? { scale: 0.95 } : false}
      aria-label="Ilustração do Macaquinho Baby"
      role="img"
    >
      <defs>
        <radialGradient id="monkeyFur" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#A87754" />
          <stop offset="100%" stopColor="#7A4F32" />
        </radialGradient>
        <radialGradient id="monkeyFace" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEBD2" />
          <stop offset="100%" stopColor="#F5D2B0" />
        </radialGradient>
      </defs>

      {/* Jungle Vine from top */}
      <path
        d="M 100 0 C 105 30, 95 60, 100 80"
        stroke="#587C60"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="102" cy="35" r="4" fill="#7E9A82" />
      <circle cx="96" cy="65" r="5" fill="#7E9A82" />

      {/* Swinging monkey group */}
      <motion.g
        animate={animate ? { rotate: [-8, 8, -8] } : false}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        style={{ transformOrigin: '100px 80px' }}
      >
        {/* Arm holding vine */}
        <path
          d="M 100 80 C 100 95, 88 105, 80 115"
          stroke="#7A4F32"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tail (curling) */}
        <motion.path
          d="M 125 155 C 150 160, 165 140, 150 120 C 140 108, 125 118, 134 128"
          stroke="#7A4F32"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          animate={animate ? { rotate: [-5, 6, -5] } : false}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          style={{ transformOrigin: '125px 155px' }}
        />

        {/* Body */}
        <ellipse cx="100" cy="145" rx="32" ry="26" fill="url(#monkeyFur)" />
        {/* Tummy */}
        <ellipse cx="100" cy="147" rx="20" ry="17" fill="url(#monkeyFace)" />

        {/* Feet */}
        <ellipse cx="85" cy="168" rx="10" ry="7" fill="url(#monkeyFace)" />
        <ellipse cx="115" cy="168" rx="10" ry="7" fill="url(#monkeyFace)" />

        {/* Big Ears */}
        <circle cx="62" cy="108" r="14" fill="url(#monkeyFur)" />
        <circle cx="62" cy="108" r="8" fill="url(#monkeyFace)" />

        <circle cx="138" cy="108" r="14" fill="url(#monkeyFur)" />
        <circle cx="138" cy="108" r="8" fill="url(#monkeyFace)" />

        {/* Head */}
        <circle cx="100" cy="108" r="32" fill="url(#monkeyFur)" />

        {/* Face heart-like mask */}
        <ellipse cx="88" cy="105" rx="16" ry="15" fill="url(#monkeyFace)" />
        <ellipse cx="112" cy="105" rx="16" ry="15" fill="url(#monkeyFace)" />
        <ellipse cx="100" cy="116" rx="22" ry="14" fill="url(#monkeyFace)" />

        {/* Cheeks */}
        <circle cx="78" cy="115" r="6" fill="#F9ADA4" opacity="0.6" />
        <circle cx="122" cy="115" r="6" fill="#F9ADA4" opacity="0.6" />

        {/* Eyes */}
        <motion.g
          animate={animate ? { scaleY: [1, 1, 0.1, 1, 1] } : false}
          transition={{ repeat: Infinity, duration: 4.6, times: [0, 0.9, 0.93, 0.96, 1] }}
          style={{ transformOrigin: '100px 102px' }}
        >
          <circle cx="88" cy="102" r="5" fill="#362215" />
          <circle cx="86.5" cy="100.5" r="1.8" fill="#FFFFFF" />

          <circle cx="112" cy="102" r="5" fill="#362215" />
          <circle cx="110.5" cy="100.5" r="1.8" fill="#FFFFFF" />
        </motion.g>

        {/* Snout & Smile */}
        <ellipse cx="100" cy="113" rx="4" ry="2.8" fill="#5E3821" />
        <path
          d="M 92 120 Q 100 126 108 120"
          stroke="#5E3821"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>
    </motion.svg>
  )
}
