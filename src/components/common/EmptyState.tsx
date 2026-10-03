import React from 'react'
import { FolderPlus } from 'lucide-react'

interface EmptyStateProps {
  onNewProject: () => void
  isSearchEmpty?: boolean
  searchQuery?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onNewProject,
  isSearchEmpty = false,
  searchQuery = '',
}) => {
  if (isSearchEmpty) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none min-h-[260px]">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4 text-white/50">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white/90 mb-1">No Matches Found</h3>
        <p className="text-sm text-white/50 max-w-sm">
          No projects matched &ldquo;{searchQuery}&rdquo;. Try another term or clear your filter.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none min-h-[280px]">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400 shadow-inner">
        <FolderPlus className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-white/95 mb-1.5">No Projects Yet</h3>
      <p className="text-sm text-white/60 max-w-md mb-6 leading-relaxed">
        Add your first project to populate Harshit&apos;s Projects folder and store it permanently in the database.
      </p>
      <button
        onClick={onNewProject}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2 cursor-pointer border border-blue-400/30"
      >
        <FolderPlus className="w-4 h-4" />
        <span>+ New Project</span>
      </button>
    </div>
  )
}
