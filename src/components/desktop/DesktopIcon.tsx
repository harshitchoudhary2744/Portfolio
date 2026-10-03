import React, { useState, useRef, useEffect } from 'react'
import { DesktopItem } from '@/types/desktop'
import { Folder, FileText, User, Mail, Sparkles } from 'lucide-react'
import { useWindowManager } from '@/store/windowStore'
import { useDesktop } from '@/store/desktopStore'

interface DesktopIconProps {
  item: DesktopItem
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ item }) => {
  const { openWindow } = useWindowManager()
  const { selectedItemId, setSelectedItemId, updateItemPosition, openContextMenu } = useDesktop()

  const isSelected = selectedItemId === item.id
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, itemX: item.x, itemY: item.y })

  const handleOpen = () => {
    openWindow(item.appId)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // only left click
    setSelectedItemId(item.id)

    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      itemX: item.x,
      itemY: item.y,
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragRef.current.startX
      const deltaY = e.clientY - dragRef.current.startY

      // Keep within bounds
      const nextX = Math.max(12, Math.min(window.innerWidth - 90, dragRef.current.itemX + deltaX))
      const nextY = Math.max(40, Math.min(window.innerHeight - 140, dragRef.current.itemY + deltaY))

      updateItemPosition(item.id, nextX, nextY)
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
  }, [isDragging, item.id, updateItemPosition])

  const handleContextMenu = (e: React.MouseEvent) => {
    setSelectedItemId(item.id)
    openContextMenu(
      e,
      [
        {
          label: `Open ${item.name}`,
          action: handleOpen,
        },
        {
          label: 'Get Info',
          action: () => openWindow('about'),
        },
      ],
      item.name,
    )
  }

  const renderIconGraphic = () => {
    if (item.type === 'folder' || item.icon === 'folder') {
      return (
        <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-lg group-hover:scale-105 transition-transform">
          {/* macOS Big Sur / Sonoma vivid blue folder */}
          <svg className="w-12 h-12 text-[#24a0ed]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
          </svg>
        </div>
      )
    }

    if (item.type === 'file' || item.icon === 'file-text') {
      return (
        <div className="relative w-11 h-12 flex items-center justify-center filter drop-shadow-lg group-hover:scale-105 transition-transform">
          {/* PDF document card */}
          <div className="w-10 h-12 bg-white rounded-md shadow-md border border-slate-300 relative flex flex-col items-center justify-center p-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 bg-slate-200 border-l border-b border-slate-300 rounded-bl" />
            <div className="text-[8px] font-black text-rose-600 uppercase tracking-tighter mt-1">PDF</div>
            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
          </div>
        </div>
      )
    }

    if (item.icon === 'user') {
      return (
        <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-lg group-hover:scale-105 transition-transform">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center shadow-md border border-white/20">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      )
    }

    return (
      <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-lg group-hover:scale-105 transition-transform">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md border border-white/20">
          <Mail className="w-6 h-6 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onDoubleClick={handleOpen}
      onContextMenu={handleContextMenu}
      style={{
        position: 'absolute',
        left: `${item.x}px`,
        top: `${item.y}px`,
      }}
      className={`group w-24 p-2 flex flex-col items-center justify-center rounded-xl cursor-pointer select-none transition-all ${
        isSelected
          ? 'bg-white/15 backdrop-blur-sm'
          : 'hover:bg-white/[0.08]'
      }`}
    >
      {renderIconGraphic()}

      <span
        className={`mt-1.5 text-xs text-center font-medium leading-tight max-w-full px-1.5 py-0.5 rounded truncate ${
          isSelected
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
        }`}
      >
        {item.name}
      </span>
    </div>
  )
}
