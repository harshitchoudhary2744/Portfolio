import React from 'react'
import { Project } from '@/types/project'
import { ExternalLink, Edit3, Trash2, Calendar, Sparkles, Code2, Tag } from 'lucide-react'
import { GithubIcon } from '@/components/common/BrandIcons'
import { useWindowManager } from '@/store/windowStore'

interface ProjectViewerProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export const ProjectViewer: React.FC<ProjectViewerProps> = ({ project, onEdit, onDelete }) => {
  const formattedDate = new Date(project.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6 text-white max-w-4xl mx-auto w-full select-text">
      {/* Banner Image if provided */}
      {project.image_url && (
        <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-lg">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          {project.featured && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md flex items-center space-x-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Project</span>
            </div>
          )}
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-medium mb-1 uppercase tracking-wider">
            <Tag className="w-3 h-3" />
            <span>{project.category}</span>
            <span className="text-white/30">•</span>
            <span className="text-white/45 flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/95">
            {project.title}
          </h2>

          <p className="text-sm md:text-base text-white/70 mt-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Action Buttons: GitHub, Demo, Edit, Delete */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 select-none">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/15 shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}

          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-md shadow-blue-500/25 transition-all flex items-center space-x-1.5 cursor-pointer border border-blue-400/30"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          )}

          <button
            onClick={() => onEdit(project)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Edit Project"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(project)}
            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tech Stack Chips */}
      <div>
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
          <Code2 className="w-3.5 h-3.5" />
          <span>Technologies & Architecture</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.08] text-white/90 border border-white/15 shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Long Description / Case Study */}
      {project.long_description && (
        <div className="border-t border-white/10 pt-5">
          <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
            About the Project
          </h4>
          <div className="text-sm text-white/80 leading-relaxed space-y-3 whitespace-pre-line bg-white/[0.02] p-4 rounded-xl border border-white/5">
            {project.long_description}
          </div>
        </div>
      )}
    </div>
  )
}
