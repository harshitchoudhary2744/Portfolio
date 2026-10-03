import { AppId, WindowState } from './window'

export type DesktopItemType = 'folder' | 'file' | 'app'

export interface DesktopItem {
  id: string
  name: string
  type: DesktopItemType
  appId: AppId
  icon: string
  x: number
  y: number
  targetData?: any
}

export interface ContextMenuOption {
  label: string
  icon?: string
  action?: () => void
  disabled?: boolean
  destructive?: boolean
  divider?: boolean
}

export interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
  options: ContextMenuOption[]
  title?: string
}

export interface PersistedDesktopState {
  version: string
  windows: Record<string, Partial<WindowState>>
  openWindowIds: string[]
  activeWindowId: string | null
  finderViewMode: 'grid' | 'list'
  desktopPositions: Record<string, { x: number; y: number }>
  wallpaper: string
}
