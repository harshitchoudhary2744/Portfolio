import { supabase, isSupabaseConfigured } from './client'
import { Project, ProjectFormData } from '@/types/project'
import { SEED_PROJECTS } from '@/config/seedProjects'

const LOCAL_STORAGE_PROJECTS_KEY = 'harshit_portfolio_local_projects_v2'

// Helper for local mock storage when Supabase is not configured yet
function getLocalProjects(): Project[] {
  try {
    // Clean up old v1 key if present
    localStorage.removeItem('harshit_portfolio_local_projects_v1')

    const raw = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(SEED_PROJECTS))
      return SEED_PROJECTS
    }
    const parsed: Project[] = JSON.parse(raw)
    // Filter out previous dummy project slugs if they exist
    const dummySlugs = [
      'coininsight-dashboard',
      'medical-unet-segmentation',
      'distributed-kv-store',
      'autonomous-drone-navigator',
    ]
    const cleaned = parsed.filter((p) => !dummySlugs.includes(p.slug))
    if (cleaned.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(SEED_PROJECTS))
      return SEED_PROJECTS
    }
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(cleaned))
    }
    return cleaned
  } catch {
    return SEED_PROJECTS
  }
}

function saveLocalProjects(projects: Project[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects))
  } catch (e) {
    console.error('Failed to save to local storage fallback', e)
  }
}

/**
 * Fetch all projects, ordered by sort_order ascending, then created_at descending
 */
export async function getProjects(): Promise<{ data: Project[]; error: Error | null; isDemo: boolean }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: getLocalProjects(),
      error: null,
      isDemo: true,
    }
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase getProjects error:', error)
      return { data: [], error: new Error(error.message), isDemo: false }
    }

    return { data: (data as Project[]) || [], error: null, isDemo: false }
  } catch (err: any) {
    console.error('Network or fetch error:', err)
    return { data: [], error: err instanceof Error ? err : new Error('Failed to fetch projects'), isDemo: false }
  }
}

/**
 * Fetch a single project by its unique slug
 */
export async function getProjectBySlug(slug: string): Promise<{ data: Project | null; error: Error | null }> {
  if (!isSupabaseConfigured || !supabase) {
    const local = getLocalProjects()
    const found = local.find((p) => p.slug === slug) || null
    return { data: found, error: found ? null : new Error('Project not found') }
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as Project, error: null }
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch project') }
  }
}

/**
 * Create a new project in the database
 */
export async function createProject(
  payload: ProjectFormData,
): Promise<{ data: Project | null; error: Error | null }> {
  // Validate basic constraints
  if (!payload.title?.trim()) {
    return { data: null, error: new Error('Project title is required') }
  }
  if (!payload.slug?.trim()) {
    return { data: null, error: new Error('Project slug is required') }
  }
  if (!payload.description?.trim()) {
    return { data: null, error: new Error('Project description is required') }
  }

  const cleanSlug = payload.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')

  if (!isSupabaseConfigured || !supabase) {
    const local = getLocalProjects()
    if (local.some((p) => p.slug === cleanSlug)) {
      return { data: null, error: new Error('A project with this slug already exists') }
    }

    const newProject: Project = {
      id: 'local-' + Date.now().toString(),
      title: payload.title.trim(),
      slug: cleanSlug,
      description: payload.description.trim(),
      long_description: payload.long_description?.trim() || null,
      category: payload.category?.trim() || 'General',
      tech_stack: payload.tech_stack || [],
      github_url: payload.github_url?.trim() || null,
      live_url: payload.live_url?.trim() || null,
      image_url: payload.image_url?.trim() || null,
      featured: Boolean(payload.featured),
      sort_order: Number(payload.sort_order) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const updatedList = [newProject, ...local]
    saveLocalProjects(updatedList)
    return { data: newProject, error: null }
  }

  try {
    const newRecord = {
      title: payload.title.trim(),
      slug: cleanSlug,
      description: payload.description.trim(),
      long_description: payload.long_description?.trim() || null,
      category: payload.category?.trim() || 'General',
      tech_stack: payload.tech_stack || [],
      github_url: payload.github_url?.trim() || null,
      live_url: payload.live_url?.trim() || null,
      image_url: payload.image_url?.trim() || null,
      featured: Boolean(payload.featured),
      sort_order: Number(payload.sort_order) || 0,
    }

    const { data, error } = await supabase
      .from('projects')
      .insert(newRecord)
      .select('*')
      .single()

    if (error) {
      if (error.code === '23505') {
        return { data: null, error: new Error('A project with this slug already exists. Please choose a unique slug.') }
      }
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as Project, error: null }
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error('Failed to create project') }
  }
}

/**
 * Update an existing project
 */
export async function updateProject(
  id: string,
  payload: Partial<ProjectFormData>,
): Promise<{ data: Project | null; error: Error | null }> {
  if (!id) {
    return { data: null, error: new Error('Project ID is required for update') }
  }

  const cleanSlug = payload.slug
    ? payload.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    : undefined

  if (!isSupabaseConfigured || !supabase) {
    const local = getLocalProjects()
    const index = local.findIndex((p) => p.id === id)
    if (index === -1) {
      return { data: null, error: new Error('Project not found') }
    }

    if (cleanSlug && local.some((p) => p.slug === cleanSlug && p.id !== id)) {
      return { data: null, error: new Error('A project with this slug already exists') }
    }

    const updated: Project = {
      ...local[index],
      ...payload,
      slug: cleanSlug || local[index].slug,
      updated_at: new Date().toISOString(),
    }

    local[index] = updated
    saveLocalProjects(local)
    return { data: updated, error: null }
  }

  try {
    const updateRecord: Record<string, any> = {
      ...payload,
      updated_at: new Date().toISOString(),
    }
    if (cleanSlug) {
      updateRecord.slug = cleanSlug
    }

    const { data, error } = await supabase
      .from('projects')
      .update(updateRecord)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as Project, error: null }
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error('Failed to update project') }
  }
}

/**
 * Delete a project from database
 */
export async function deleteProject(id: string): Promise<{ success: boolean; error: Error | null }> {
  if (!id) {
    return { success: false, error: new Error('Project ID is required for deletion') }
  }

  if (!isSupabaseConfigured || !supabase) {
    const local = getLocalProjects()
    const filtered = local.filter((p) => p.id !== id)
    saveLocalProjects(filtered)
    return { success: true, error: null }
  }

  try {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      return { success: false, error: new Error(error.message) }
    }
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err instanceof Error ? err : new Error('Failed to delete project') }
  }
}
