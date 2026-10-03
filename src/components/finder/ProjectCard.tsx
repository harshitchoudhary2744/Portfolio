import React from 'react'
import { Project } from '@/types/project'
import { Folder, Code2, Cpu, Globe, Database, ExternalLink, Sparkles } from 'lucide-react'
import { GithubIcon } from '@/components/common/BrandIcons'
import { useDesktop } from '@/store/desktopStore'

interface ProjectCardProps {
  project: Project
  isSelected: boolean
  onSelect: () => void
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}

function getCategoryIcon(category: string) {
  const c = category.toLowerCase()
  if (c.includes('ai') || c.includes('learning') || c.includes('neural')) {
    return <Cpu className="w-8 h-8 text-violet-400" />
  }
  if (c.includes('web') || c.includes('frontend') || c.includes('full')) {
    return <Globe className="w-8 h-8 text-sky-400" />
  }
  if (c.includes('system') || c.includes('backend') || c.includes('c++')) {
    return <Code2 className="w-8 h-8 text-emerald-400" />
  }
  if (c.includes('data') || c.includes('analytics') || c.includes('sql')) {
    return <Database className="w-8 h-8 text-amber-400" />
  }
  return <Folder className="w-8 h-8 text-blue-400" />
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onSelect,
  onOpen,
  onEdit,
  onDelete,
}) => {
  const { openContextMenu } = useDesktop()

  const handleContextMenu = (e: React.MouseEvent) => {
    onSelect()
    openContextMenu(
      e,
      [
        {
          label: 'Open Details',
          action: onOpen,
        },
        ...(project.github_url
          ? [
              {
                label: 'Open GitHub',
                action: () => window.open(project.github_url!, '_blank', 'noopener,noreferrer'),
              },
            ]
          : []),
        ...(project.live_url
          ? [
              {
                label: 'Open Live Demo',
                action: () => window.open(project.live_url!, '_blank', 'noopener,noreferrer'),
              },
            ]
          : []),
        {
          label: 'Edit Project',
          divider: true,
          action: onEdit,
        },
        {
          label: 'Delete Project',
          destructive: true,
          action: onDelete,
        },
      ],
      project.title,
    )
  }

  return (
    <div
      onClick={onSelect}
      onDoubleClick={onOpen}
      onContextMenu={handleContextMenu}
      className={`group relative flex flex-col p-3.5 rounded-xl transition-all cursor-pointer select-none border text-left ${
        isSelected
          ? 'bg-blue-600/25 border-blue-500/50 shadow-md shadow-blue-500/10'
          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5 hover:border-white/10'
      }`}
    >
      {/* Thumbnail or Category Symbol */}
      <div className="relative w-full h-28 rounded-lg overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center mb-3">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="p-4 rounded-full bg-white/[0.04] border border-white/10 group-hover:scale-110 transition-transform">
            {getCategoryIcon(project.category)}
          </div>
        )}

        {/* Featured Pill */}
        {project.featured && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-medium flex items-center space-x-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Title & Category */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-white/95 truncate group-hover:text-blue-300 transition-colors">
          {project.title}
        </h4>
        <p className="text-[11px] text-white/45 mt-0.5 truncate">{project.category}</p>

        {/* Short description */}
        <p className="text-xs text-white/65 mt-1.5 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Tech Badges */}
      <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-white/5">
        {project.tech_stack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-[10px] font-medium bg-white/[0.06] text-white/75 px-1.5 py-0.5 rounded border border-white/10"
          >
            {tech}
          </span>
        ))}
        {project.tech_stack.length > 3 && (
          <span className="text-[10px] text-white/40 px-1 py-0.5">
            +{project.tech_stack.length - 3}
          </span>
        )}
      </div>
    </div>
  )
}
