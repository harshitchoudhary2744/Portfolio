import React, { useState } from 'react'
import { MenuDropdown, MenuItemConfig } from './MenuDropdown'
import { SystemStatus } from './SystemStatus'
import { useWindowManager } from '@/store/windowStore'
import { useDesktop } from '@/store/desktopStore'
import { siteConfig } from '@/config/site'

export const MenuBar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const { openWindow, closeWindow, activeWindowId, minimizeAll, bringAllToFront, maximizeWindow } =
    useWindowManager()
  const { setFinderViewMode, showToast } = useDesktop()

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName)
  }

  // Menu configurations
  const appleMenu: MenuItemConfig[] = [
    {
      label: "About This Mac Portfolio",
      action: () => openWindow('about'),
    },
    { divider: true, label: '' },
    {
      label: 'System Specs: ' + siteConfig.systemVersion,
      disabled: true,
    },
    {
      label: 'Database: Supabase PostgreSQL',
      disabled: true,
    },
    { divider: true, label: '' },
    {
      label: 'Restart Desktop Session',
      action: () => {
        showToast('Session Reset', 'Reloading desktop environment...', 'info')
        setTimeout(() => window.location.reload(), 500)
      },
    },
  ]

  const fileMenu: MenuItemConfig[] = [
    {
      label: 'New Project...',
      shortcut: '⌘N',
      action: () => openWindow('project-form', { title: 'New Project' }),
    },
    {
      label: 'New Terminal Tab',
      shortcut: '⌘T',
      action: () => openWindow('terminal'),
    },
    { divider: true, label: '' },
    {
      label: 'Close Active Window',
      shortcut: '⌘W',
      disabled: !activeWindowId,
      action: () => {
        if (activeWindowId) closeWindow(activeWindowId)
      },
    },
  ]

  const viewMenu: MenuItemConfig[] = [
    {
      label: 'as Icons (Grid View)',
      action: () => setFinderViewMode('grid'),
    },
    {
      label: 'as List (Table View)',
      action: () => setFinderViewMode('list'),
    },
    { divider: true, label: '' },
    {
      label: 'Show Desktop (Minimize All)',
      action: minimizeAll,
    },
  ]

  const goMenu: MenuItemConfig[] = [
    {
      label: 'Projects Folder',
      action: () => openWindow('finder'),
    },
    {
      label: 'Resume.pdf',
      action: () => openWindow('resume'),
    },
    {
      label: 'About Me',
      action: () => openWindow('about'),
    },
    {
      label: 'Contact',
      action: () => openWindow('contact'),
    },
    {
      label: 'Terminal',
      action: () => openWindow('terminal'),
    },
  ]

  const windowMenu: MenuItemConfig[] = [
    {
      label: 'Minimize Active',
      shortcut: '⌘M',
      disabled: !activeWindowId,
      action: () => {
        if (activeWindowId) {
          useWindowManager
        }
      },
    },
    {
      label: 'Zoom / Maximize',
      disabled: !activeWindowId,
      action: () => {
        if (activeWindowId) maximizeWindow(activeWindowId)
      },
    },
    { divider: true, label: '' },
    {
      label: 'Bring All to Front',
      action: bringAllToFront,
    },
  ]

  const helpMenu: MenuItemConfig[] = [
    {
      label: "How to use Harshit's Portfolio",
      action: () =>
        showToast(
          'Quick Guide',
          'Double-click any desktop folder/app or click the bottom Dock icons to open windows.',
          'info',
        ),
    },
    {
      label: 'Connect Live Supabase DB',
      action: () =>
        showToast(
          'Database Setup',
          'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to connect your PostgreSQL database.',
          'info',
        ),
    },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 h-8 px-3 glass-menubar flex items-center justify-between text-xs text-white z-50 select-none shadow-sm">
      {/* Left: System Emblem + Portfolio title + Dropdown Menus */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Original Apple-inspired system emblem */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('system')}
            className={`p-1.5 rounded hover:bg-white/10 transition-colors flex items-center cursor-pointer ${
              openMenu === 'system' ? 'bg-white/15' : ''
            }`}
            title="System Menu"
          >
            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" />
            </svg>
          </button>
          <MenuDropdown
            isOpen={openMenu === 'system'}
            items={appleMenu}
            onClose={() => setOpenMenu(null)}
          />
        </div>

        {/* Website Identity */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('app')}
            className={`font-semibold text-white/95 px-2 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer text-xs ${
              openMenu === 'app' ? 'bg-white/15' : ''
            }`}
          >
            {siteConfig.title}
          </button>
          <MenuDropdown
            isOpen={openMenu === 'app'}
            items={appleMenu}
            onClose={() => setOpenMenu(null)}
          />
        </div>

        {/* Traditional Menus */}
        <div className="hidden md:flex items-center space-x-0.5">
          <div className="relative">
            <button
              onClick={() => toggleMenu('file')}
              className={`px-2 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer ${
                openMenu === 'file' ? 'bg-white/15 text-white' : ''
              }`}
            >
              File
            </button>
            <MenuDropdown
              isOpen={openMenu === 'file'}
              items={fileMenu}
              onClose={() => setOpenMenu(null)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => toggleMenu('view')}
              className={`px-2 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer ${
                openMenu === 'view' ? 'bg-white/15 text-white' : ''
              }`}
            >
              View
            </button>
            <MenuDropdown
              isOpen={openMenu === 'view'}
              items={viewMenu}
              onClose={() => setOpenMenu(null)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => toggleMenu('go')}
              className={`px-2 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer ${
                openMenu === 'go' ? 'bg-white/15 text-white' : ''
              }`}
            >
              Go
            </button>
            <MenuDropdown
              isOpen={openMenu === 'go'}
              items={goMenu}
              onClose={() => setOpenMenu(null)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => toggleMenu('window')}
              className={`px-2 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer ${
                openMenu === 'window' ? 'bg-white/15 text-white' : ''
              }`}
            >
              Window
            </button>
            <MenuDropdown
              isOpen={openMenu === 'window'}
              items={windowMenu}
              onClose={() => setOpenMenu(null)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => toggleMenu('help')}
              className={`px-2 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer ${
                openMenu === 'help' ? 'bg-white/15 text-white' : ''
              }`}
            >
              Help
            </button>
            <MenuDropdown
              isOpen={openMenu === 'help'}
              items={helpMenu}
              onClose={() => setOpenMenu(null)}
            />
          </div>
        </div>

        {/* Quick Nav direct buttons (matching reference screenshot style!) */}
        <div className="hidden lg:flex items-center space-x-1 pl-2 border-l border-white/10">
          <button
            onClick={() => openWindow('finder')}
            className="px-2 py-0.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Projects
          </button>
          <button
            onClick={() => openWindow('contact')}
            className="px-2 py-0.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
          <button
            onClick={() => openWindow('resume')}
            className="px-2 py-0.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Resume
          </button>
        </div>
      </div>

      {/* Right: Live Clock, Wi-Fi, Battery, Spotlight */}
      <SystemStatus onSpotlightClick={() => openWindow('finder')} />
    </header>
  )
}
