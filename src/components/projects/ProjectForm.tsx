import React, { useState, useEffect } from 'react'
import { Project, ProjectFormData } from '@/types/project'
import { createProject, updateProject } from '@/lib/supabase/projects'
import { useDesktop } from '@/store/desktopStore'
import { Plus, X, Sparkles, Loader2, Check } from 'lucide-react'

interface ProjectFormProps {
  initialData?: Project | null
  onSuccess: (savedProject: Project) => void
  onCancel: () => void
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const isEditing = Boolean(initialData?.id)
  const { showToast } = useDesktop()

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [longDescription, setLongDescription] = useState(initialData?.long_description || '')
  const [category, setCategory] = useState(initialData?.category || 'AI / Machine Learning')
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || ['Python', 'PyTorch'])
  const [newTechInput, setNewTechInput] = useState('')
  const [githubUrl, setGithubUrl] = useState(initialData?.github_url || '')
  const [liveUrl, setLiveUrl] = useState(initialData?.live_url || '')
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sort_order ?? 1)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Auto-generate slug from title if creating new project
  useEffect(() => {
    if (!isEditing && title && !slug) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
      )
    }
  }, [title, isEditing, slug])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!title.trim()) {
      errs.title = 'Project name is required'
    } else if (title.trim().length < 3) {
      errs.title = 'Name must be at least 3 characters'
    }

    if (!slug.trim()) {
      errs.slug = 'Slug is required'
    } else if (!/^[a-z0-9-_]+$/.test(slug.trim())) {
      errs.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    if (!description.trim()) {
      errs.description = 'Short description is required'
    }

    // URL validations
    const urlPattern = /^https?:\/\/.+/i
    if (githubUrl.trim() && !urlPattern.test(githubUrl.trim())) {
      errs.githubUrl = 'Must be a valid URL starting with http:// or https://'
    }
    if (liveUrl.trim() && !urlPattern.test(liveUrl.trim())) {
      errs.liveUrl = 'Must be a valid URL starting with http:// or https://'
    }
    if (imageUrl.trim() && !urlPattern.test(imageUrl.trim())) {
      errs.imageUrl = 'Must be a valid URL starting with http:// or https://'
    }

    if (techStack.length === 0) {
      errs.techStack = 'Add at least one technology stack badge'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAddTech = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = newTechInput.trim()
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed])
      setNewTechInput('')
    }
  }

  const handleRemoveTech = (techToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== techToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    if (!validate()) return

    setIsSubmitting(true)

    const payload: ProjectFormData = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      long_description: longDescription.trim() || null,
      category: category.trim(),
      tech_stack: techStack,
      github_url: githubUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      image_url: imageUrl.trim() || null,
      featured,
      sort_order: Number(sortOrder) || 0,
    }

    try {
      if (isEditing && initialData?.id) {
        const res = await updateProject(initialData.id, payload)
        if (res.error) {
          setServerError(res.error.message)
          setIsSubmitting(false)
          return
        }
        showToast('Project Updated', `"${payload.title}" was updated in the database.`, 'success')
        onSuccess(res.data!)
      } else {
        const res = await createProject(payload)
        if (res.error) {
          setServerError(res.error.message)
          setIsSubmitting(false)
          return
        }
        showToast('Project Created', `"${payload.title}" was saved to the database.`, 'success')
        onSuccess(res.data!)
      }
    } catch (err: any) {
      setServerError(err?.message || 'An unexpected error occurred.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col space-y-5 text-white max-w-2xl mx-auto w-full select-text">
      {serverError && (
        <div className="p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
          <strong>Database Error:</strong> {serverError}
        </div>
      )}

      {/* Title & Slug Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/80 mb-1.5">
            Project Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI Code Translator"
            className={`w-full bg-white/[0.06] border rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none transition-colors ${
              errors.title ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-blue-400'
            }`}
          />
          {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-white/80 mb-1.5">
            Unique Slug <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="e.g. ai-code-translator"
            className={`w-full bg-white/[0.06] border rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none transition-colors ${
              errors.slug ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-blue-400'
            }`}
          />
          {errors.slug && <p className="text-[11px] text-rose-400 mt-1">{errors.slug}</p>}
        </div>
      </div>

      {/* Category & Sort Order */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/80 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#1b1f33] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
          >
            <option value="AI / Machine Learning">AI / Machine Learning</option>
            <option value="Deep Learning">Deep Learning</option>
            <option value="Web / Full Stack">Web / Full Stack</option>
            <option value="Systems & Backend">Systems & Backend</option>
            <option value="Web / Data Analytics">Web / Data Analytics</option>
            <option value="Open Source Tool">Open Source Tool</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/80 mb-1.5">Sort Order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-xs font-medium text-white/80 mb-1.5">
          Short Description (Finder preview) <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief 1-2 sentence overview shown on the Finder card..."
          className={`w-full bg-white/[0.06] border rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none transition-colors ${
            errors.description ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-blue-400'
          }`}
        />
        {errors.description && <p className="text-[11px] text-rose-400 mt-1">{errors.description}</p>}
      </div>

      {/* Tech Stack Chips & Input */}
      <div>
        <label className="block text-xs font-medium text-white/80 mb-1.5">
          Technology Stack <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-1.5 p-2 bg-white/[0.03] border border-white/10 rounded-lg min-h-[44px] mb-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium"
            >
              <span>{tech}</span>
              <button
                type="button"
                onClick={() => handleRemoveTech(tech)}
                className="text-blue-300 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newTechInput}
            onChange={(e) => setNewTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddTech()
              }
            }}
            placeholder="Type technology (e.g. PyTorch, TypeScript) and press Enter"
            className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
          />
          <button
            type="button"
            onClick={() => handleAddTech()}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg border border-white/10 cursor-pointer"
          >
            Add Tech
          </button>
        </div>
        {errors.techStack && <p className="text-[11px] text-rose-400 mt-1">{errors.techStack}</p>}
      </div>

      {/* URLs: GitHub, Demo, Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/80 mb-1.5">GitHub Repository URL</label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/project"
            className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
          />
          {errors.githubUrl && <p className="text-[11px] text-rose-400 mt-1">{errors.githubUrl}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-white/80 mb-1.5">Live Demo URL</label>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://demo.example.com"
            className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
          />
          {errors.liveUrl && <p className="text-[11px] text-rose-400 mt-1">{errors.liveUrl}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/80 mb-1.5">Project Thumbnail / Banner URL</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/... or /project-images/demo.png"
          className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
        />
        {errors.imageUrl && <p className="text-[11px] text-rose-400 mt-1">{errors.imageUrl}</p>}
      </div>

      {/* Long Description */}
      <div>
        <label className="block text-xs font-medium text-white/80 mb-1.5">
          Detailed About / Case Study (Optional)
        </label>
        <textarea
          rows={4}
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          placeholder="Elaborate on architectural decisions, algorithms, benchmarks, or learnings..."
          className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center space-x-3 pt-1 select-none">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 rounded text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="featured" className="text-xs text-white/90 font-medium cursor-pointer flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Feature on top of Projects list</span>
        </label>
      </div>

      {/* Actions Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3 select-none">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-white/10"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all flex items-center space-x-2 cursor-pointer border border-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving to Database...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
