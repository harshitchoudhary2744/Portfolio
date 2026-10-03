import React from 'react'
import { Project } from '@/types/project'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface ProjectDeleteDialogProps {
  project: Project
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export const ProjectDeleteDialog: React.FC<ProjectDeleteDialogProps> = ({
  project,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm rounded-2xl bg-[#1b1e33] border border-white/20 p-5 shadow-2xl text-white flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/95">
              Delete &ldquo;{project.title}&rdquo;?
            </h3>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              This action cannot be undone. The project record will be permanently deleted from the database.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2.5 pt-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors cursor-pointer border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
