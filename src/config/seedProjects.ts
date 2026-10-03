import { Project } from '@/types/project'

export const SEED_PROJECTS: Project[] = [
  {
    id: 'seed-1',
    title: 'AI Code Translator & Optimizer',
    slug: 'ai-code-translator',
    description: 'Neural transpiler translating legacy codebases between C++, Python, and Rust with syntax verification and latency analysis.',
    long_description: 'An advanced transformer-based code translation and AST refactoring engine. It processes complex logic syntax across programming languages while preserving semantics, checking safety constraints, and benchmark performance optimizations.',
    category: 'AI / Machine Learning',
    tech_stack: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'Tree-sitter'],
    github_url: 'https://github.com',
    live_url: 'https://demo.example.com',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    sort_order: 1,
    created_at: new Date('2025-01-15').toISOString(),
    updated_at: new Date('2025-01-15').toISOString(),
  },
]
