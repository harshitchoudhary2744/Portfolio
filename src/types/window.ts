import { ReactNode } from 'react'

export type AppId =
  | 'finder'
  | 'project-detail'
  | 'project-form'
  | 'about'
  | 'resume'
  | 'contact'
  | 'terminal'
  | 'safari'
  | 'settings'

export interface WindowState {
  id: string
  appId: AppId
  title: string
  x: number
  y: number
  width: number
  height: number
  minWidth?: number
  minHeight?: number
  zIndex: number
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  previousBounds?: {
    x: number
    y: number
    width: number
    height: number
  }
  // Optional app-specific payload data (e.g., project slug/record)
  data?: any
}

export interface AppDefinition {
  id: AppId
  name: string
  icon: string
  defaultTitle: string
  defaultWidth: number
  defaultHeight: number
  minWidth?: number
  minHeight?: number
  singleton?: boolean // only one instance allowed (like Finder, About)
  dockItem?: boolean
  desktopItem?: boolean
  description?: string
}
