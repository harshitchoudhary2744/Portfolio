export interface Project {
  id: string
  title: string
  slug: string
  description: string
  long_description?: string | null
  category: string
  tech_stack: string[]
  github_url?: string | null
  live_url?: string | null
  image_url?: string | null
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
}

export type ProjectFilterCategory = 'all' | 'ai-ml' | 'web' | 'systems' | 'data' | 'other'

export type FinderViewMode = 'grid' | 'list'

export type ProjectSortOption = 'order' | 'newest' | 'title'
