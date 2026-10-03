import { useState, useEffect, useCallback, useMemo } from 'react'
import { Project, ProjectFilterCategory, ProjectSortOption } from '@/types/project'
import { getProjects, deleteProject } from '@/lib/supabase/projects'
import { useDesktop } from '@/store/desktopStore'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<ProjectFilterCategory>('all')
  const [sortBy, setSortBy] = useState<ProjectSortOption>('order')

  const { showToast } = useDesktop()

  const fetchProjectsList = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const res = await getProjects()
    if (res.error) {
      setError(res.error.message || 'Failed to load projects')
      setProjects([])
    } else {
      setProjects(res.data)
      setIsDemoMode(res.isDemo)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchProjectsList()
  }, [fetchProjectsList])

  const handleDelete = useCallback(
    async (id: string, title?: string) => {
      const res = await deleteProject(id)
      if (res.error) {
        showToast('Error', res.error.message, 'error')
        return false
      }
      showToast('Project Removed', `"${title || 'Project'}" was deleted successfully.`, 'success')
      await fetchProjectsList()
      return true
    },
    [fetchProjectsList, showToast],
  )

  // Filter and search
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const inTitle = p.title.toLowerCase().includes(q)
          const inDesc = p.description.toLowerCase().includes(q)
          const inCategory = p.category.toLowerCase().includes(q)
          const inTech = p.tech_stack.some((t) => t.toLowerCase().includes(q))
          if (!inTitle && !inDesc && !inCategory && !inTech) return false
        }

        // Category filter
        if (selectedCategory !== 'all') {
          const cat = p.category.toLowerCase()
          if (selectedCategory === 'ai-ml') {
            return cat.includes('ai') || cat.includes('machine') || cat.includes('deep') || cat.includes('learning')
          }
          if (selectedCategory === 'web') {
            return cat.includes('web') || cat.includes('frontend') || cat.includes('full') || cat.includes('react')
          }
          if (selectedCategory === 'systems') {
            return cat.includes('system') || cat.includes('backend') || cat.includes('c++') || cat.includes('store')
          }
          if (selectedCategory === 'data') {
            return cat.includes('data') || cat.includes('analytics') || cat.includes('crypto')
          }
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'order') {
          return a.sort_order - b.sort_order
        }
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title)
        }
        return 0
      })
  }, [projects, searchQuery, selectedCategory, sortBy])

  return {
    projects,
    filteredProjects,
    isLoading,
    error,
    isDemoMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    refresh: fetchProjectsList,
    handleDelete,
  }
}
