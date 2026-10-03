import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktop } from '@/store/desktopStore'

export const ContextMenu: React.FC = () => {
  const { contextMenu, closeContextMenu } = useDesktop()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contextMenu.isOpen) return

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu()
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu()
    }

    window.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [contextMenu.isOpen, closeContextMenu])

  if (!contextMenu.isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.1 }}
        style={{
          position: 'fixed',
          left: `${contextMenu.x}px`,
          top: `${contextMenu.y}px`,
          zIndex: 99999,
        }}
        className="min-w-[190px] py-1.5 rounded-xl bg-[#1b1e33]/95 border border-white/20 shadow-2xl backdrop-blur-3xl text-xs text-white select-none pointer-events-auto"
      >
        {contextMenu.title && (
          <div className="px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/40 border-b border-white/10 mb-1 truncate">
            {contextMenu.title}
          </div>
        )}

        {contextMenu.options.map((opt, i) => {
          if (opt.divider) {
            return <div key={`div-${i}`} className="my-1 border-b border-white/10" />
          }

          return (
            <button
              key={`opt-${i}`}
              onClick={() => {
                if (opt.disabled || !opt.action) return
                opt.action()
                closeContextMenu()
              }}
              disabled={opt.disabled}
              className={`w-full px-3.5 py-1.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                opt.disabled
                  ? 'text-white/30 cursor-not-allowed'
                  : opt.destructive
                  ? 'text-rose-400 hover:bg-rose-600 hover:text-white'
                  : 'hover:bg-blue-600 hover:text-white'
              }`}
            >
              <span>{opt.label}</span>
            </button>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
