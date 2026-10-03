import React, { useState } from 'react'

interface TrafficLightsProps {
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  isMaximized?: boolean
  disabled?: boolean
}

export const TrafficLights: React.FC<TrafficLightsProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="flex items-center space-x-2 py-1 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="group"
      aria-label="Window Controls"
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        disabled={disabled}
        aria-label="Close Window"
        className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#e0443e] active:bg-[#bf332c] border border-[rgba(0,0,0,0.18)] shadow-sm flex items-center justify-center transition-transform hover:scale-105 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        {isHovered && (
          <svg className="w-1.5 h-1.5 text-[#4c0000] stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Minimize button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onMinimize()
        }}
        disabled={disabled}
        aria-label="Minimize Window"
        className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#dea123] active:bg-[#be8717] border border-[rgba(0,0,0,0.18)] shadow-sm flex items-center justify-center transition-transform hover:scale-105 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        {isHovered && (
          <svg className="w-1.5 h-1.5 text-[#593b00] stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        )}
      </button>

      {/* Maximize / Zoom button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onMaximize()
        }}
        disabled={disabled}
        aria-label={isMaximized ? 'Restore Window' : 'Zoom Window'}
        className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1fa332] active:bg-[#188026] border border-[rgba(0,0,0,0.18)] shadow-sm flex items-center justify-center transition-transform hover:scale-105 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      >
        {isHovered && (
          <svg className="w-1.5 h-1.5 text-[#004d11] stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {isMaximized ? (
              <>
                <polyline points="4 14 10 14 10 20"></polyline>
                <polyline points="20 10 14 10 14 4"></polyline>
              </>
            ) : (
              <>
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
              </>
            )}
          </svg>
        )}
      </button>
    </div>
  )
}
