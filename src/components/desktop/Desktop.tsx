import React from 'react'
import { MenuBar } from '@/components/menubar/MenuBar'
import { Dock } from '@/components/dock/Dock'
import { WindowManager } from '@/components/windows/WindowManager'
import { DesktopIcon } from './DesktopIcon'
import { DesktopIntro } from './DesktopIntro'
import { ContextMenu } from './ContextMenu'
import { NotificationToast } from '@/components/common/NotificationToast'
import { useDesktop } from '@/store/desktopStore'
import { useWindowManager } from '@/store/windowStore'

export const Desktop: React.FC = () => {
  const { desktopItems, wallpaper, openContextMenu, setSelectedItemId } = useDesktop()
  const { openWindow, minimizeAll } = useWindowManager()

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    // Only trigger if clicking directly on the desktop background
    if ((e.target as HTMLElement).closest('#window-container, button, input, .cursor-pointer')) {
      return
    }

    openContextMenu(
      e,
      [
        {
          label: 'New Project...',
          action: () => openWindow('project-form', { title: 'New Project' }),
        },
        {
          label: 'Open Projects Folder',
          action: () => openWindow('finder'),
        },
        {
          label: 'Open Terminal',
          action: () => openWindow('terminal'),
        },
        { divider: true, label: '' },
        {
          label: 'Show Desktop',
          action: minimizeAll,
        },
        {
          label: 'About Harshit',
          action: () => openWindow('about'),
        },
      ],
      'Desktop',
    )
  }

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Deselect desktop icon if clicking background
    if ((e.target as HTMLElement).id === 'desktop-surface') {
      setSelectedItemId(null)
    }
  }

  return (
    <div
      id="desktop-surface"
      onContextMenu={handleDesktopContextMenu}
      onClick={handleDesktopClick}
      className="relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans"
    >
      {/* Dynamic macOS Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundColor: '#131838',
        }}
      >
        {/* Subtle vignette and contrast gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 pointer-events-none" />
      </div>

      {/* Top Menu Bar */}
      <MenuBar />

      {/* Desktop Intro Hero (Centered) */}
      <DesktopIntro />

      {/* Desktop Icons (Left side) */}
      <div className="absolute inset-0 pt-10 pb-20 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {desktopItems.map((item) => (
            <DesktopIcon key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Window Manager (Renders all active MacWindows) */}
      <WindowManager />

      {/* Bottom Floating Dock */}
      <Dock />

      {/* Global Desktop Context Menu */}
      <ContextMenu />

      {/* System Toast Alerts */}
      <NotificationToast />
    </div>
  )
}
