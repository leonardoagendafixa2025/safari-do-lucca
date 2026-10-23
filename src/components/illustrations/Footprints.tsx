import React from 'react'

interface FootprintsProps {
  className?: string
  color?: string
}

export const FootprintsTrail: React.FC<FootprintsProps> = ({
  className = '',
  color = 'rgba(115, 89, 70, 0.22)',
}) => {
  return (
    <div className={`footprints-trail ${className}`} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
      <svg viewBox="0 0 40 40" width="22" height="22" style={{ transform: 'rotate(-15deg)' }}>
        <ellipse cx="20" cy="25" rx="10" ry="8" fill={color} />
        <circle cx="12" cy="12" r="3" fill={color} />
        <circle cx="18" cy="8" r="3.2" fill={color} />
        <circle cx="26" cy="10" r="3" fill={color} />
        <circle cx="31" cy="16" r="2.6" fill={color} />
      </svg>
      <svg viewBox="0 0 40 40" width="22" height="22" style={{ transform: 'rotate(15deg) translateY(-4px)' }}>
        <ellipse cx="20" cy="25" rx="10" ry="8" fill={color} />
        <circle cx="9" cy="16" r="2.6" fill={color} />
        <circle cx="14" cy="10" r="3" fill={color} />
        <circle cx="22" cy="8" r="3.2" fill={color} />
        <circle cx="28" cy="12" r="3" fill={color} />
      </svg>
      <svg viewBox="0 0 40 40" width="22" height="22" style={{ transform: 'rotate(-10deg) translateY(2px)' }}>
        <ellipse cx="20" cy="25" rx="10" ry="8" fill={color} />
        <circle cx="12" cy="12" r="3" fill={color} />
        <circle cx="18" cy="8" r="3.2" fill={color} />
        <circle cx="26" cy="10" r="3" fill={color} />
        <circle cx="31" cy="16" r="2.6" fill={color} />
      </svg>
    </div>
  )
}
