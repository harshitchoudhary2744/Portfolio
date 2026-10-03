import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { DesktopItem, ContextMenuState, ContextMenuOption } from '@/types/desktop'
import { FinderViewMode } from '@/types/project'
import { INITIAL_DESKTOP_ITEMS } from '@/config/desktopApps'
import { siteConfig } from '@/config/site'

interface ToastNotification {
  id: string
  title: string
  message: string
  type?: 'success' | 'error' | 'info'
}

interface DesktopContextType {
  desktopItems: DesktopItem[]
  selectedItemId: string | null
  setSelectedItemId: (id: string | null) => void
  updateItemPosition: (id: string, x: number, y: number) => void
  finderViewMode: FinderViewMode
  setFinderViewMode: (mode: FinderViewMode) => void
  wallpaper: string
  setWallpaper: (wp: string) => void
  contextMenu: ContextMenuState
  openContextMenu: (e: React.MouseEvent, options: ContextMenuOption[], title?: string) => void
  closeContextMenu: () => void
  toasts: ToastNotification[]
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

const DesktopContext = createContext<DesktopContextType | null>(null)

export const DesktopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(INITIAL_DESKTOP_ITEMS)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [finderViewMode, setFinderViewModeState] = useState<FinderViewMode>('grid')
  const [wallpaper, setWallpaperState] = useState<string>('/wallpapers/macos-blue.png')
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    options: [],
  })

  // Hydrate desktop state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(siteConfig.storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.finderViewMode) {
          setFinderViewModeState(parsed.finderViewMode)
        }
        if (parsed.wallpaper) {
          setWallpaperState(parsed.wallpaper)
        }
        if (parsed.desktopPositions) {
          setDesktopItems((prev) =>
            prev.map((item) => {
              const saved = parsed.desktopPositions[item.id]
              return saved ? { ...item, x: saved.x, y: saved.y } : item
            }),
          )
        }
      }
    } catch (e) {
      console.warn('Failed to hydrate desktop store', e)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Persist desktop settings to localStorage
  useEffect(() => {
    if (!isHydrated) return
    try {
      const existing = localStorage.getItem(siteConfig.storageKey)
      const parsed = existing ? JSON.parse(existing) : {}

      const positions: Record<string, { x: number; y: number }> = {}
      desktopItems.forEach((item) => {
        positions[item.id] = { x: item.x, y: item.y }
      })

      const updated = {
        ...parsed,
        finderViewMode,
        wallpaper,
        desktopPositions: positions,
      }
      localStorage.setItem(siteConfig.storageKey, JSON.stringify(updated))
    } catch (e) {
      console.warn('Failed to save desktop state to localStorage', e)
    }
  }, [desktopItems, finderViewMode, wallpaper, isHydrated])

  const setFinderViewMode = useCallback((mode: FinderViewMode) => {
    setFinderViewModeState(mode)
  }, [])

  const setWallpaper = useCallback((wp: string) => {
    setWallpaperState(wp)
  }, [])

  const updateItemPosition = useCallback((id: string, x: number, y: number) => {
    setDesktopItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item)),
    )
  }, [])

  const openContextMenu = useCallback((e: React.MouseEvent, options: ContextMenuOption[], title?: string) => {
    e.preventDefault()
    e.stopPropagation()

    const x = Math.min(e.clientX, window.innerWidth - 220)
    const y = Math.min(e.clientY, window.innerHeight - (options.length * 34 + 40))

    setContextMenu({
      isOpen: true,
      x,
      y,
      options,
      title,
    })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev))
  }, [])

  const showToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5)
    setToasts((prev) => [...prev, { id, title, message, type }])

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Close context menu on global click or Escape
  useEffect(() => {
    const handleClick = () => closeContextMenu()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu()
    }

    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeContextMenu])

  const value = useMemo(
    () => ({
      desktopItems,
      selectedItemId,
      setSelectedItemId,
      updateItemPosition,
      finderViewMode,
      setFinderViewMode,
      wallpaper,
      setWallpaper,
      contextMenu,
      openContextMenu,
      closeContextMenu,
      toasts,
      showToast,
      removeToast,
    }),
    [
      desktopItems,
      selectedItemId,
      updateItemPosition,
      finderViewMode,
      setFinderViewMode,
      wallpaper,
      setWallpaper,
      contextMenu,
      openContextMenu,
      closeContextMenu,
      toasts,
      showToast,
      removeToast,
    ],
  )

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
}

export const useDesktop = () => {
  const context = useContext(DesktopContext)
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider')
  }
  return context
}
