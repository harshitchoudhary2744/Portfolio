import React from 'react'
import { DesktopProvider } from '@/store/desktopStore'
import { WindowProvider } from '@/store/windowStore'
import { Desktop } from '@/components/desktop/Desktop'

export default function App() {
  return (
    <DesktopProvider>
      <WindowProvider>
        <Desktop />
      </WindowProvider>
    </DesktopProvider>
  )
}
