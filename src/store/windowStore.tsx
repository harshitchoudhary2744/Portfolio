import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { WindowState, AppId } from '@/types/window'
import { APP_REGISTRY } from '@/config/desktopApps'
import { siteConfig } from '@/config/site'

interface WindowContextType {
  windows: Record<string, WindowState>
  activeWindowId: string | null
  openWindow: (appId: AppId, options?: { id?: string; title?: string; data?: any }) => string
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
  minimizeAll: () => void
  bringAllToFront: () => void
}

const WindowContext = createContext<WindowContextType | null>(null)

// Calculate safe default position centered or staggered on screen
function getDefaultWindowPosition(appId: AppId, index: number = 0) {
  const def = APP_REGISTRY[appId] || { defaultWidth: 800, defaultHeight: 520 }
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800

  const width = Math.min(def.defaultWidth, vw - 32)
  const height = Math.min(def.defaultHeight, vh - 120)

  // Stagger slightly if multiple windows
  const baseX = Math.max(20, Math.round((vw - width) / 2) + index * 24)
  const baseY = Math.max(48, Math.round((vh - height) / 2) - 20 + index * 24)

  return {
    x: Math.min(baseX, vw - width - 20),
    y: Math.min(baseY, vh - height - 80),
    width,
    height,
  }
}

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Record<string, WindowState>>({})
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [highestZIndex, setHighestZIndex] = useState<number>(100)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on startup
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(siteConfig.storageKey)
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw)
        if (parsed.version === '1.0' && parsed.windows) {
          setWindows(parsed.windows)
          setActiveWindowId(parsed.activeWindowId || null)
          // find highest zIndex
          const zIndexes = Object.values(parsed.windows as Record<string, WindowState>).map((w) => w.zIndex || 100)
          if (zIndexes.length > 0) {
            setHighestZIndex(Math.max(...zIndexes) + 1)
          }
        }
      }
    } catch (e) {
      console.warn('Failed to hydrate window state from localStorage', e)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Persist to localStorage on change (debounced / on update)
  useEffect(() => {
    if (!isHydrated) return
    try {
      const existing = localStorage.getItem(siteConfig.storageKey)
      const parsed = existing ? JSON.parse(existing) : {}
      const updated = {
        ...parsed,
        version: '1.0',
        windows,
        activeWindowId,
      }
      localStorage.setItem(siteConfig.storageKey, JSON.stringify(updated))
    } catch (e) {
      console.warn('Failed to save window state to localStorage', e)
    }
  }, [windows, activeWindowId, isHydrated])

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const target = prev[id]
      if (!target) return prev

      const nextZ = highestZIndex + 1
      setHighestZIndex(nextZ)
      setActiveWindowId(id)

      return {
        ...prev,
        [id]: {
          ...target,
          zIndex: nextZ,
          isMinimized: false, // focusing automatically un-minimizes
        },
      }
    })
  }, [highestZIndex])

  const openWindow = useCallback(
    (appId: AppId, options?: { id?: string; title?: string; data?: any }) => {
      const def = APP_REGISTRY[appId]
      const winId = options?.id || (def.singleton ? `window-${appId}` : `window-${appId}-${Date.now()}`)

      setWindows((prev) => {
        // If window already exists, bring it to front and un-minimize
        if (prev[winId]) {
          const nextZ = highestZIndex + 1
          setHighestZIndex(nextZ)
          setActiveWindowId(winId)
          return {
            ...prev,
            [winId]: {
              ...prev[winId],
              isOpen: true,
              isMinimized: false,
              zIndex: nextZ,
              title: options?.title || prev[winId].title,
              data: options?.data !== undefined ? options.data : prev[winId].data,
            },
          }
        }

        const nextZ = highestZIndex + 1
        setHighestZIndex(nextZ)
        setActiveWindowId(winId)

        const defaultPos = getDefaultWindowPosition(appId, Object.keys(prev).length)

        const newWindow: WindowState = {
          id: winId,
          appId,
          title: options?.title || def.defaultTitle,
          x: defaultPos.x,
          y: defaultPos.y,
          width: defaultPos.width,
          height: defaultPos.height,
          minWidth: def.minWidth || 360,
          minHeight: def.minHeight || 280,
          zIndex: nextZ,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          data: options?.data,
        }

        return {
          ...prev,
          [winId]: newWindow,
        }
      })

      return winId
    },
    [highestZIndex],
  )

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const target = prev[id]
      if (!target) return prev

      const next = { ...prev }
      delete next[id]

      // Select next topmost window as active
      const remaining = Object.values(next).filter((w) => w.isOpen && !w.isMinimized)
      if (remaining.length > 0) {
        remaining.sort((a, b) => b.zIndex - a.zIndex)
        setActiveWindowId(remaining[0].id)
      } else {
        setActiveWindowId(null)
      }

      return next
    })
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const target = prev[id]
      if (!target) return prev

      return {
        ...prev,
        [id]: {
          ...target,
          isMinimized: true,
        },
      }
    })

    // switch active window
    setActiveWindowId((current) => {
      if (current !== id) return current
      return null
    })
  }, [])

  const restoreWindow = useCallback((id: string) => {
    focusWindow(id)
  }, [focusWindow])

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const target = prev[id]
      if (!target) return prev

      const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800

      if (target.isMaximized) {
        // Restore previous bounds
        const prevBounds = target.previousBounds || {
          x: 40,
          y: 48,
          width: target.minWidth || 700,
          height: target.minHeight || 500,
        }
        return {
          ...prev,
          [id]: {
            ...target,
            isMaximized: false,
            x: prevBounds.x,
            y: prevBounds.y,
            width: prevBounds.width,
            height: prevBounds.height,
          },
        }
      } else {
        // Maximize respecting menu bar (height ~32px) and dock allowance
        const menuHeight = 32
        const dockMargin = 72
        return {
          ...prev,
          [id]: {
            ...target,
            isMaximized: true,
            previousBounds: {
              x: target.x,
              y: target.y,
              width: target.width,
              height: target.height,
            },
            x: 0,
            y: menuHeight,
            width: vw,
            height: vh - menuHeight - dockMargin,
          },
        }
      }
    })
  }, [])

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => {
      const target = prev[id]
      if (!target) return prev

      // Prevent dragging completely offscreen
      const safeY = Math.max(32, y) // below menu bar
      return {
        ...prev,
        [id]: {
          ...target,
          x,
          y: safeY,
          isMaximized: false, // moving cancels maximized state
        },
      }
    })
  }, [])

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) => {
      const target = prev[id]
      if (!target) return prev

      const minW = target.minWidth || 360
      const minH = target.minHeight || 280

      return {
        ...prev,
        [id]: {
          ...target,
          width: Math.max(minW, width),
          height: Math.max(minH, height),
          isMaximized: false,
        },
      }
    })
  }, [])

  const minimizeAll = useCallback(() => {
    setWindows((prev) => {
      const updated: Record<string, WindowState> = {}
      for (const [id, win] of Object.entries(prev)) {
        updated[id] = { ...win, isMinimized: true }
      }
      return updated
    })
    setActiveWindowId(null)
  }, [])

  const bringAllToFront = useCallback(() => {
    setWindows((prev) => {
      const updated: Record<string, WindowState> = {}
      for (const [id, win] of Object.entries(prev)) {
        updated[id] = { ...win, isMinimized: false }
      }
      return updated
    })
  }, [])

  const value = useMemo(
    () => ({
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      maximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      minimizeAll,
      bringAllToFront,
    }),
    [
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      maximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      minimizeAll,
      bringAllToFront,
    ],
  )

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
}

export const useWindowManager = () => {
  const context = useContext(WindowContext)
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowProvider')
  }
  return context
}
