import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface MenuItemConfig {
  label: string
  action?: () => void
  disabled?: boolean
  shortcut?: string
  divider?: boolean
}

interface MenuDropdownProps {
  isOpen: boolean
  items: MenuItemConfig[]
  onClose: () => void
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ isOpen, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -4, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.12 }}
        className="absolute left-0 top-full mt-1 min-w-[200px] py-1 rounded-xl bg-[#1c2035]/95 border border-white/20 shadow-2xl backdrop-blur-2xl z-[9999] select-none text-xs text-white/90"
      >
        {items.map((item, idx) => {
          if (item.divider) {
            return <div key={`div-${idx}`} className="my-1 border-b border-white/10" />
          }

          return (
            <button
              key={`item-${idx}`}
              onClick={() => {
                if (item.disabled || !item.action) return
                item.action()
                onClose()
              }}
              disabled={item.disabled}
              className={`w-full px-3.5 py-1.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                item.disabled
                  ? 'text-white/30 cursor-not-allowed'
                  : 'hover:bg-blue-600 hover:text-white active:bg-blue-700'
              }`}
            >
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="text-[10px] text-white/40 tracking-wider font-mono">
                  {item.shortcut}
                </span>
              )}
            </button>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
