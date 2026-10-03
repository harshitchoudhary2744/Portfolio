import React, { useState } from 'react'
import { FinderToolbar } from './FinderToolbar'
import { ProjectGrid } from './ProjectGrid'
import { ProjectList } from './ProjectList'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { ProjectDeleteDialog } from '@/components/projects/ProjectDeleteDialog'
import { useProjects } from '@/hooks/useProjects'
import { useDesktop } from '@/store/desktopStore'
import { useWindowManager } from '@/store/windowStore'
import { Project } from '@/types/project'

export const FinderWindow: React.FC = () => {
  const {
    filteredProjects,
    projects,
    isLoading,
    error,
    isDemoMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    refresh,
    handleDelete,
  } = useProjects()

  const { finderViewMode } = useDesktop()
  const { openWindow } = useWindowManager()

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Actions
  const handleOpenProject = (project: Project) => {
    openWindow('project-detail', {
      id: `project-${project.slug}`,
      title: project.title,
      data: project,
    })
  }

  const handleEditProject = (project: Project) => {
    openWindow('project-form', {
      id: 'project-form',
      title: `Edit — ${project.title}`,
      data: project,
    })
  }

  const handleNewProject = () => {
    openWindow('project-form', {
      id: 'project-form',
      title: 'New Project',
      data: null,
    })
  }

  const confirmDelete = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    await handleDelete(projectToDelete.id, projectToDelete.title)
    setIsDeleting(false)
    setProjectToDelete(null)
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Finder Toolbar */}
      <div className="border-b border-white/10 bg-white/[0.03] px-3.5 py-2.5">
        <FinderToolbar
          itemCount={filteredProjects.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onNewProject={handleNewProject}
          isDemoMode={isDemoMode}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState message="Loading projects from database..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : projects.length === 0 ? (
          <EmptyState onNewProject={handleNewProject} />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            onNewProject={handleNewProject}
            isSearchEmpty={true}
            searchQuery={searchQuery}
          />
        ) : finderViewMode === 'grid' ? (
          <ProjectGrid
            projects={filteredProjects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onOpenProject={handleOpenProject}
            onEditProject={handleEditProject}
            onDeleteProject={(p) => setProjectToDelete(p)}
          />
        ) : (
          <ProjectList
            projects={filteredProjects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onOpenProject={handleOpenProject}
            onEditProject={handleEditProject}
            onDeleteProject={(p) => setProjectToDelete(p)}
          />
        )}
      </div>

      {/* Delete Confirmation Sheet */}
      {projectToDelete && (
        <ProjectDeleteDialog
          project={projectToDelete}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </div>
  )
}
