import React from 'react'
import { Project } from '@/types/project'
import { ProjectCard } from './ProjectCard'

interface ProjectGridProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
  onOpenProject: (project: Project) => void
  onEditProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenProject,
  onEditProject,
  onDeleteProject,
}) => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isSelected={selectedProjectId === project.id}
          onSelect={() => onSelectProject(project.id)}
          onOpen={() => onOpenProject(project)}
          onEdit={() => onEditProject(project)}
          onDelete={() => onDeleteProject(project)}
        />
      ))}
    </div>
  )
}
