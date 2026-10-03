import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WindowState } from '@/types/window'
import { TrafficLights } from './TrafficLights'
import { useWindowManager } from '@/store/windowStore'

interface MacWindowProps {
  windowState: WindowState
  children: React.ReactNode
  toolbar?: React.ReactNode
}

export const MacWindow: React.FC<MacWindowProps> = ({ windowState, children, toolbar }) => {
  const {
    id,
    title,
    x,
    y,
    width,
    height,
    zIndex,
    isOpen,
    isMinimized,
    isMaximized,
  } = windowState

  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindowId,
  } = useWindowManager()

  const isFocused = activeWindowId === id
  const windowRef = useRef<HTMLDivElement>(null)

  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  // Resizing state
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartRef = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 })

  // Responsive mobile detection
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Drag handlers
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click and not maximized and not mobile
    if (e.button !== 0 || isMaximized || isMobile) return
    focusWindow(id)
    setIsDragging(true)
    dragOffsetRef.current = {
      x: e.clientX - x,
      y: e.clientY - y,
    }
    e.preventDefault()
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffsetRef.current.x
      const newY = e.clientY - dragOffsetRef.current.y
      updateWindowPosition(id, newX, newY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, id, updateWindowPosition])

  // Resize handlers
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isMaximized || isMobile) return
    focusWindow(id)
    setIsResizing(true)
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: width,
      startHeight: height,
    }
    e.preventDefault()
    e.stopPropagation()
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartRef.current.startX
      const deltaY = e.clientY - resizeStartRef.current.startY
      updateWindowSize(
        id,
        resizeStartRef.current.startWidth + deltaX,
        resizeStartRef.current.startHeight + deltaY,
      )
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, id, updateWindowSize])

  // Double click title bar to toggle maximize
  const handleTitleDoubleClick = () => {
    if (!isMobile) {
      maximizeWindow(id)
    }
  }

  // Keyboard accessibility: ESC closes window if focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocused) {
        closeWindow(id)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [id, isFocused, closeWindow])

  if (!isOpen || isMinimized) return null

  // If mobile, force full screen below menu bar
  const windowStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        top: '32px',
        left: '0px',
        width: '100vw',
        height: 'calc(100vh - 32px)',
        zIndex,
      }
    : {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
      }

  return (
    <AnimatePresence>
      <motion.div
        ref={windowRef}
        style={windowStyle}
        onMouseDown={() => focusWindow(id)}
        initial={{ scale: 0.94, opacity: 0, y: isMobile ? 10 : 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className={`flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl transition-shadow select-none
          ${isMobile ? 'rounded-none' : 'rounded-xl border'}
          ${
            isFocused
              ? 'border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] bg-[#171a2b]/90 text-white'
              : 'border-white/10 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] bg-[#131524]/80 text-white/80'
          }`}
      >
        {/* Title Bar Chrome */}
        <div
          onMouseDown={handleTitleMouseDown}
          onDoubleClick={handleTitleDoubleClick}
          className={`h-10 px-4 flex items-center justify-between border-b transition-colors select-none ${
            isMaximized || isMobile ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
          } ${
            isFocused
              ? 'bg-white/[0.07] border-white/10 text-white/90'
              : 'bg-white/[0.03] border-white/5 text-white/60'
          }`}
        >
          {/* Left: Traffic Lights */}
          <div className="flex items-center space-x-2 w-20">
            <TrafficLights
              onClose={() => closeWindow(id)}
              onMinimize={() => minimizeWindow(id)}
              onMaximize={() => maximizeWindow(id)}
              isMaximized={isMaximized}
            />
          </div>

          {/* Center: Window Title */}
          <div className="flex-1 text-center font-medium text-xs tracking-wide truncate px-2 text-white/90 pointer-events-none">
            {title}
          </div>

          {/* Right: Window Spacer or Quick Action */}
          <div className="w-20 flex justify-end items-center">
            {isFocused && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 hidden sm:inline-block"></span>
            )}
          </div>
        </div>

        {/* Optional App Toolbar */}
        {toolbar && (
          <div className="border-b border-white/10 bg-white/[0.04] px-3 py-2 text-sm select-none">
            {toolbar}
          </div>
        )}

        {/* Window Content Body */}
        <div className="flex-1 overflow-auto bg-black/25 relative text-slate-100 flex flex-col">
          {children}
        </div>

        {/* Resize Handle (Desktop Only) */}
        {!isMaximized && !isMobile && (
          <div
            onMouseDown={handleResizeMouseDown}
            aria-label="Resize window"
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 opacity-40 hover:opacity-100 transition-opacity"
          >
            <svg className="w-2.5 h-2.5 text-white/70" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="8" cy="8" r="1" />
              <circle cx="4" cy="8" r="1" />
              <circle cx="8" cy="4" r="1" />
            </svg>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
