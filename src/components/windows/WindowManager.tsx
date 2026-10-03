import React, { useState } from 'react'
import { useWindowManager } from '@/store/windowStore'
import { MacWindow } from './MacWindow'
import { FinderWindow } from '@/components/finder/FinderWindow'
import { ProjectViewer } from '@/components/projects/ProjectViewer'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { AboutApp } from '@/components/apps/AboutApp'
import { ResumeApp } from '@/components/apps/ResumeApp'
import { ContactApp } from '@/components/apps/ContactApp'
import { TerminalApp } from '@/components/apps/TerminalApp'
import { SafariApp } from '@/components/apps/SafariApp'
import { ProjectDeleteDialog } from '@/components/projects/ProjectDeleteDialog'
import { deleteProject } from '@/lib/supabase/projects'
import { useDesktop } from '@/store/desktopStore'
import { Project } from '@/types/project'

export const WindowManager: React.FC = () => {
  const { windows, closeWindow, openWindow } = useWindowManager()
  const { showToast } = useDesktop()

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEditProject = (project: Project) => {
    openWindow('project-form', {
      id: 'project-form',
      title: `Edit — ${project.title}`,
      data: project,
    })
  }

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project)
  }

  const confirmDelete = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    const res = await deleteProject(projectToDelete.id)
    setIsDeleting(false)

    if (res.error) {
      showToast('Error', res.error.message, 'error')
    } else {
      showToast('Project Deleted', `"${projectToDelete.title}" was removed from the database.`, 'success')
      // Close project detail window if open
      closeWindow(`project-${projectToDelete.slug}`)
      // Ensure Finder window is open and refreshed
      openWindow('finder')
    }
    setProjectToDelete(null)
  }

  const handleFormSuccess = (savedProject: Project) => {
    closeWindow('project-form')
    // Open the newly created or updated project in viewer
    openWindow('project-detail', {
      id: `project-${savedProject.slug}`,
      title: savedProject.title,
      data: savedProject,
    })
    // Also make sure Finder is open to see the new project
    openWindow('finder')
  }

  return (
    <div id="window-container" className="fixed inset-0 pointer-events-none select-none overflow-hidden z-20">
      {Object.values(windows).map((win) => {
        if (!win.isOpen || win.isMinimized) return null

        return (
          <div key={win.id} className="pointer-events-auto">
            <MacWindow windowState={win}>
              {win.appId === 'finder' && <FinderWindow />}

              {win.appId === 'project-detail' && win.data && (
                <ProjectViewer
                  project={win.data as Project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              )}

              {win.appId === 'project-form' && (
                <ProjectForm
                  initialData={win.data as Project | null}
                  onSuccess={handleFormSuccess}
                  onCancel={() => closeWindow('project-form')}
                />
              )}

              {win.appId === 'about' && <AboutApp />}

              {win.appId === 'resume' && <ResumeApp />}

              {win.appId === 'contact' && <ContactApp />}

              {win.appId === 'terminal' && <TerminalApp />}

              {win.appId === 'safari' && <SafariApp initialUrl={win.data?.url} />}
            </MacWindow>
          </div>
        )
      })}

      {/* Global Delete Confirmation Dialog */}
      {projectToDelete && (
        <div className="pointer-events-auto">
          <ProjectDeleteDialog
            project={projectToDelete}
            isDeleting={isDeleting}
            onConfirm={confirmDelete}
            onCancel={() => setProjectToDelete(null)}
          />
        </div>
      )}
    </div>
  )
}
