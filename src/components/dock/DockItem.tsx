import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AppId } from '@/types/window'
import {
  Folder,
  Compass,
  User,
  FileText,
  Terminal,
  Mail,
  Sparkles,
  LayoutGrid,
  ExternalLink,
} from 'lucide-react'

interface DockItemProps {
  appId: AppId
  name: string
  icon: string
  isOpen: boolean
  isFocused: boolean
  onClick: () => void
}

export const DockItem: React.FC<DockItemProps> = ({
  appId,
  name,
  icon,
  isOpen,
  isFocused,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const renderIcon = () => {
    switch (appId) {
      case 'finder':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center p-2.5 shadow-md shadow-blue-500/30 border border-white/20">
            {/* macOS Finder-style two-tone face or folder */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Folder className="w-6 h-6 text-white drop-shadow" />
            </div>
          </div>
        )
      case 'safari':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-blue-400 via-cyan-500 to-sky-600 flex items-center justify-center p-2.5 shadow-md shadow-cyan-500/30 border border-white/20">
            <Compass className="w-6 h-6 text-white drop-shadow" />
          </div>
        )
      case 'about':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center p-2.5 shadow-md shadow-pink-500/30 border border-white/20">
            <User className="w-6 h-6 text-white drop-shadow" />
          </div>
        )
      case 'resume':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center p-2.5 shadow-md shadow-orange-500/30 border border-white/20">
            <FileText className="w-6 h-6 text-white drop-shadow" />
          </div>
        )
      case 'terminal':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-slate-900 via-zinc-800 to-neutral-900 flex items-center justify-center p-2.5 shadow-md shadow-black/50 border border-white/20">
            <Terminal className="w-6 h-6 text-emerald-400 drop-shadow" />
          </div>
        )
      case 'contact':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-violet-700 flex items-center justify-center p-2.5 shadow-md shadow-purple-500/30 border border-white/20">
            <Mail className="w-6 h-6 text-white drop-shadow" />
          </div>
        )
      default:
        return (
          <div className="w-full h-full rounded-2xl bg-slate-800 flex items-center justify-center p-2.5 border border-white/20">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
        )
    }
  }

  return (
    <div
      className="relative flex flex-col items-center group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-[#16192b]/95 border border-white/20 shadow-lg text-[11px] font-medium text-white whitespace-nowrap backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95 duration-100 z-50">
          {name}
        </div>
      )}

      {/* Interactive Icon Button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.18, y: -4 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer outline-none relative"
        aria-label={name}
      >
        {renderIcon()}
      </motion.button>

      {/* Active Dot Indicator */}
      <div className="h-1.5 flex items-center justify-center mt-0.5">
        {isOpen && (
          <motion.div
            layoutId={`active-dot-${appId}`}
            className={`w-1 h-1 rounded-full ${
              isFocused ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'bg-white/40'
            }`}
          />
        )}
      </div>
    </div>
  )
}
