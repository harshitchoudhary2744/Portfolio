import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Search,
  Plus,
  ArrowUpDown,
  Filter,
} from 'lucide-react'
import { FinderViewMode, ProjectFilterCategory, ProjectSortOption } from '@/types/project'
import { useDesktop } from '@/store/desktopStore'

interface FinderToolbarProps {
  itemCount: number
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedCategory: ProjectFilterCategory
  onCategoryChange: (cat: ProjectFilterCategory) => void
  sortBy: ProjectSortOption
  onSortChange: (sort: ProjectSortOption) => void
  onNewProject: () => void
  isDemoMode?: boolean
}

export const FinderToolbar: React.FC<FinderToolbarProps> = ({
  itemCount,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onNewProject,
  isDemoMode = false,
}) => {
  const { finderViewMode, setFinderViewMode } = useDesktop()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs select-none">
      {/* Left: Navigation and path info */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-white/5 border border-white/10 rounded-md p-0.5">
          <button
            className="p-1 rounded text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors cursor-not-allowed"
            title="Back (Disabled)"
            disabled
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1 rounded text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors cursor-not-allowed"
            title="Forward (Disabled)"
            disabled
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center space-x-1.5 pl-1">
          <span className="font-semibold text-white/90">Projects</span>
          <span className="text-white/30">•</span>
          <span className="text-white/50">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          {isDemoMode && (
            <span className="ml-1 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-medium" title="Data stored in local session. Set Supabase keys in .env to connect live database">
              Local DB
            </span>
          )}
        </div>
      </div>

      {/* Center & Right: Search, Filter, View Toggles & New Project Button */}
      <div className="flex items-center space-x-2 flex-1 justify-end max-w-xl">
        {/* Search input */}
        <div className="relative flex-1 min-w-[130px] max-w-[220px]">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-white/[0.07] border border-white/10 focus:border-blue-400/50 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Category filter dropdown */}
        <div className="relative hidden md:block">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as ProjectFilterCategory)}
            className="bg-white/[0.07] border border-white/10 text-white/80 rounded-lg px-2.5 py-1 text-xs cursor-pointer hover:bg-white/10 transition-colors focus:outline-none"
          >
            <option value="all" className="bg-[#1c2035] text-white">All Categories</option>
            <option value="ai-ml" className="bg-[#1c2035] text-white">AI / Machine Learning</option>
            <option value="web" className="bg-[#1c2035] text-white">Web / Full Stack</option>
            <option value="systems" className="bg-[#1c2035] text-white">Systems & Backend</option>
            <option value="data" className="bg-[#1c2035] text-white">Data Analytics</option>
          </select>
        </div>

        {/* View Mode Toggle (Grid / List) */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
          <button
            onClick={() => setFinderViewMode('grid')}
            title="Icon / Grid View"
            className={`p-1 rounded cursor-pointer transition-colors ${
              finderViewMode === 'grid'
                ? 'bg-blue-600/80 text-white shadow-sm'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFinderViewMode('list')}
            title="List View"
            className={`p-1 rounded cursor-pointer transition-colors ${
              finderViewMode === 'list'
                ? 'bg-blue-600/80 text-white shadow-sm'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* + New Project Button */}
        <button
          onClick={onNewProject}
          className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-medium transition-all shadow-md shadow-blue-500/20 flex items-center space-x-1.5 cursor-pointer border border-blue-400/30 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>
    </div>
  )
}
