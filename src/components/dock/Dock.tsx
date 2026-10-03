import React from 'react'
import { motion } from 'framer-motion'
import { DOCK_ITEMS } from '@/config/desktopApps'
import { DockItem } from './DockItem'
import { useWindowManager } from '@/store/windowStore'
import { Sparkles } from 'lucide-react'

export const Dock: React.FC = () => {
  const { windows, activeWindowId, openWindow, minimizeWindow, restoreWindow } = useWindowManager()

  const handleDockClick = (appId: any) => {
    // Check if window is already open
    const targetWin = Object.values(windows).find((w) => w.appId === appId && w.isOpen)

    if (targetWin) {
      if (targetWin.isMinimized) {
        restoreWindow(targetWin.id)
      } else if (activeWindowId === targetWin.id) {
        // Toggle minimize if clicking currently active window
        minimizeWindow(targetWin.id)
      } else {
        restoreWindow(targetWin.id)
      }
    } else {
      openWindow(appId)
    }
  }

  return (
    <footer className="fixed bottom-3 left-0 right-0 flex justify-center z-40 pointer-events-none select-none px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-3xl glass-dock border border-white/20 shadow-2xl backdrop-blur-3xl"
      >
        {/* Core Apps */}
        {DOCK_ITEMS.map((item) => {
          const isOpen = Object.values(windows).some(
            (w) => w.appId === item.appId && w.isOpen && !w.isMinimized,
          )
          const isFocused = Boolean(
            activeWindowId && windows[activeWindowId]?.appId === item.appId,
          )

          return (
            <DockItem
              key={item.appId}
              appId={item.appId}
              name={item.name}
              icon={item.icon}
              isOpen={isOpen}
              isFocused={isFocused}
              onClick={() => handleDockClick(item.appId)}
            />
          )
        })}

        {/* Vertical Divider */}
        <div className="w-[1px] h-9 bg-white/15 my-auto mx-1" />

        {/* Ask Me Action Pill (Matching Reference Screenshot) */}
        <motion.button
          onClick={() => openWindow('contact')}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="h-10 px-3.5 rounded-2xl bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-500/25 border border-white/25 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="font-semibold">Ask Me</span>
        </motion.button>
      </motion.div>
    </footer>
  )
}
