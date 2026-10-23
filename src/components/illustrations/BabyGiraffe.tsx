import React from 'react'
import { motion } from 'framer-motion'

interface BabyGiraffeProps {
  className?: string
  size?: number
  animate?: boolean
}

export const BabyGiraffe: React.FC<BabyGiraffeProps> = ({ className = '', size = 180, animate = true }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 220"
      width={size}
      height={size * 1.1}
      className={`baby-giraffe-svg ${className}`}
      initial={animate ? { scale: 0.95 } : false}
      animate={animate ? { scale: [0.98, 1.02, 0.98] } : false}
      transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
      aria-label="Ilustração da Girafinha Baby"
      role="img"
    >
      <defs>
        <radialGradient id="giraffeBody" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFF2D6" />
          <stop offset="100%" stopColor="#FAD38E" />
        </radialGradient>
      </defs>

      {/* Body */}
      <ellipse cx="100" cy="180" rx="42" ry="28" fill="url(#giraffeBody)" />
      <circle cx="82" cy="178" r="8" fill="#C97A3E" opacity="0.8" />
      <circle cx="118" cy="175" r="9" fill="#C97A3E" opacity="0.8" />
      <circle cx="100" cy="188" r="6.5" fill="#C97A3E" opacity="0.8" />

      {/* Legs */}
      <rect x="74" y="190" width="12" height="22" rx="6" fill="#FAD38E" />
      <rect x="74" y="206" width="12" height="6" rx="3" fill="#8C5023" />
      <rect x="114" y="190" width="12" height="22" rx="6" fill="#FAD38E" />
      <rect x="114" y="206" width="12" height="6" rx="3" fill="#8C5023" />

      {/* Head and Neck Group */}
      <motion.g
        style={{ transformOrigin: '100px 170px' }}
        animate={animate ? { rotate: [-4, 5, -4] } : false}
        transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
      >
        <path
          d="M 91 170 L 91 88 C 91 85, 109 85, 109 88 L 109 170 Z"
          fill="url(#giraffeBody)"
        />
        <path
          d="M 89 86 Q 84 94 89 102 Q 84 110 89 118 Q 84 126 89 134 Q 84 142 89 150 Q 84 158 89 166"
          stroke="#C97A3E"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        <path d="M 96 102 C 99 99, 106 101, 105 106 C 104 110, 97 110, 96 106 Z" fill="#C97A3E" opacity="0.85" />
        <path d="M 94 124 C 98 120, 104 122, 103 128 C 102 133, 95 133, 94 128 Z" fill="#C97A3E" opacity="0.85" />
        <path d="M 96 146 C 99 142, 106 144, 105 150 C 103 154, 97 154, 96 150 Z" fill="#C97A3E" opacity="0.85" />

        {/* Giraffe Head */}
        <line x1="88" y1="62" x2="82" y2="44" stroke="#FAD38E" strokeWidth="5" strokeLinecap="round" />
        <circle cx="81" cy="42" r="5.5" fill="#8C5023" />
        <line x1="112" y1="62" x2="118" y2="44" stroke="#FAD38E" strokeWidth="5" strokeLinecap="round" />
        <circle cx="119" cy="42" r="5.5" fill="#8C5023" />

        <ellipse cx="68" cy="62" rx="14" ry="7" fill="#FAD38E" transform="rotate(-25 68 62)" />
        <ellipse cx="68" cy="62" rx="8" ry="4" fill="#F7A399" transform="rotate(-25 68 62)" />
        <ellipse cx="132" cy="62" rx="14" ry="7" fill="#FAD38E" transform="rotate(25 132 62)" />
        <ellipse cx="132" cy="62" rx="8" ry="4" fill="#F7A399" transform="rotate(25 132 62)" />

        <ellipse cx="100" cy="74" rx="28" ry="24" fill="url(#giraffeBody)" />

        <ellipse cx="100" cy="85" rx="20" ry="14" fill="#FFE5BD" />
        <ellipse cx="94" cy="84" rx="2.5" ry="3.5" fill="#8C5023" transform="rotate(-15 94 84)" />
        <ellipse cx="106" cy="84" rx="2.5" ry="3.5" fill="#8C5023" transform="rotate(15 106 84)" />

        <path d="M 94 91 Q 100 95 106 91" stroke="#8C5023" strokeWidth="2" strokeLinecap="round" fill="none" />

        <circle cx="78" cy="82" r="6" fill="#F9ADA4" opacity="0.6" />
        <circle cx="122" cy="82" r="6" fill="#F9ADA4" opacity="0.6" />

        <motion.g
          style={{ transformOrigin: '100px 70px' }}
          animate={animate ? { scaleY: [1, 1, 0.1, 1, 1] } : false}
          transition={{ repeat: Infinity, duration: 4.5, times: [0, 0.9, 0.93, 0.96, 1] }}
        >
          <circle cx="86" cy="70" r="5.5" fill="#3D2614" />
          <circle cx="84" cy="68" r="2" fill="#FFFFFF" />
          <path d="M 83 65 L 80 62 M 86 64 L 85 60" stroke="#3D2614" strokeWidth="1.5" strokeLinecap="round" />

          <circle cx="114" cy="70" r="5.5" fill="#3D2614" />
          <circle cx="112" cy="68" r="2" fill="#FFFFFF" />
          <path d="M 117 65 L 120 62 M 114 64 L 115 60" stroke="#3D2614" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
      </motion.g>
    </motion.svg>
  )
}
