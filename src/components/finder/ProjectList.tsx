import React from 'react'
import { Project } from '@/types/project'
import { Folder, ExternalLink, Sparkles, MoreHorizontal } from 'lucide-react'
import { GithubIcon } from '@/components/common/BrandIcons'
import { useDesktop } from '@/store/desktopStore'

interface ProjectListProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
  onOpenProject: (project: Project) => void
  onEditProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenProject,
  onEditProject,
  onDeleteProject,
}) => {
  const { openContextMenu } = useDesktop()

  const handleRowContextMenu = (e: React.MouseEvent, project: Project) => {
    onSelectProject(project.id)
    openContextMenu(
      e,
      [
        {
          label: 'Open Details',
          action: () => onOpenProject(project),
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
          action: () => onEditProject(project),
        },
        {
          label: 'Delete Project',
          destructive: true,
          action: () => onDeleteProject(project),
        },
      ],
      project.title,
    )
  }

  return (
    <div className="w-full overflow-x-auto select-none">
      <table className="w-full text-left text-xs text-white/80 border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-white/45 font-medium uppercase tracking-wider text-[11px]">
            <th className="py-2.5 px-4">Name</th>
            <th className="py-2.5 px-4">Category</th>
            <th className="py-2.5 px-4">Tech Stack</th>
            <th className="py-2.5 px-4 hidden md:table-cell">Updated</th>
            <th className="py-2.5 px-4 text-right">Links</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {projects.map((project) => {
            const isSelected = selectedProjectId === project.id
            const dateStr = new Date(project.updated_at || project.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })

            return (
              <tr
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                onDoubleClick={() => onOpenProject(project)}
                onContextMenu={(e) => handleRowContextMenu(e, project)}
                className={`transition-colors cursor-pointer group ${
                  isSelected ? 'bg-blue-600/25 text-white' : 'hover:bg-white/[0.04]'
                }`}
              >
                {/* Title */}
                <td className="py-2.5 px-4 flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Folder className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-white/95 truncate flex items-center space-x-1.5">
                      <span>{project.title}</span>
                      {project.featured && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-normal">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-2.5 px-4 text-white/60 truncate">{project.category}</td>

                {/* Tech Stack */}
                <td className="py-2.5 px-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {project.tech_stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] bg-white/[0.06] text-white/75 px-1.5 py-0.5 rounded border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="text-[10px] text-white/40">+{project.tech_stack.length - 3}</span>
                    )}
                  </div>
                </td>

                {/* Updated Date */}
                <td className="py-2.5 px-4 text-white/40 hidden md:table-cell whitespace-nowrap">
                  {dateStr}
                </td>

                {/* Action Links */}
                <td className="py-2.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={(e) => handleRowContextMenu(e, project)}
                      className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
