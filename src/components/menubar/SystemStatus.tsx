import React, { useState, useEffect } from 'react'
import { Wifi, Battery, Search, SlidersHorizontal } from 'lucide-react'

interface SystemStatusProps {
  onSpotlightClick: () => void
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ onSpotlightClick }) => {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }) + ' ' + now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      setTimeStr(formatted)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center space-x-3.5 text-xs text-white/85 font-medium select-none">
      {/* Battery */}
      <div className="flex items-center space-x-1.5 opacity-90 hover:opacity-100 transition-opacity" title="Battery: 100% (Power Adapter Connected)">
        <span className="text-[11px] hidden sm:inline">100%</span>
        <div className="relative flex items-center">
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Wi-Fi */}
      <div className="opacity-90 hover:opacity-100 transition-opacity" title="Wi-Fi: Connected to High-Speed Fiber">
        <Wifi className="w-3.5 h-3.5 text-white/90" />
      </div>

      {/* Spotlight Search Icon */}
      <button
        onClick={onSpotlightClick}
        className="opacity-90 hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
        title="Spotlight Search"
      >
        <Search className="w-3.5 h-3.5 text-white/90" />
      </button>

      {/* Control Center */}
      <div className="opacity-90 hover:opacity-100 transition-opacity hidden sm:block" title="Control Center">
        <SlidersHorizontal className="w-3 h-3 text-white/90" />
      </div>

      {/* Clock */}
      <div className="text-[11px] tracking-tight font-medium opacity-90 pl-1">
        {timeStr || 'Mon Sep 28 9:41 AM'}
      </div>
    </div>
  )
}
