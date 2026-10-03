# TRD — Harshit macOS Portfolio

## 1. Technical Objective

Build a browser-based personal portfolio that behaves like a lightweight macOS-inspired desktop.

The system must have two layers:

### Client
Responsible for:
- desktop shell
- windows
- menus
- Dock
- Finder-like folder
- project browsing
- project creation/editing UI
- local UI persistence

### Backend
Responsible for:
- project CRUD
- permanent storage
- optional image metadata / URLs
- future CMS-like expansion

## 2. Recommended Technology Stack

### Frontend
- Next.js
- TypeScript
- React
- Tailwind CSS
- Lucide React for icons
- Framer Motion only for subtle animations where useful

### Backend / Persistence
- Supabase
- PostgreSQL

### Hosting
- Vercel

### Client Persistence
- localStorage
- optionally IndexedDB only if later required

### Why this stack

It is modern but still practical:
- React makes the desktop/window system modular.
- TypeScript improves reliability.
- Tailwind keeps styling centralized.
- Supabase removes the need to build a custom CRUD backend.
- PostgreSQL gives real persistent storage.
- Vercel is straightforward for deployment.

## 3. High-Level Architecture

```text
Browser
  |
  v
Next.js App
  |
  +----------------------------+
  |                            |
  v                            v
Desktop UI                  Client State
  |                         Zustand/React Context
  |
  +--> Window Manager
  +--> Menu Bar
  +--> Dock
  +--> Desktop Icons
  +--> Finder
  +--> Project Viewer
  +--> Project Editor
  |
  v
Supabase Client
  |
  v
Supabase Postgres
```

## 4. Suggested Folder Structure

```text
app/
  page.tsx
  layout.tsx
  globals.css

components/
  desktop/
    Desktop.tsx
    DesktopIcon.tsx
    DesktopGrid.tsx

  menubar/
    MenuBar.tsx
    MenuItem.tsx
    SystemStatus.tsx

  dock/
    Dock.tsx
    DockItem.tsx

  windows/
    WindowManager.tsx
    MacWindow.tsx
    TrafficLights.tsx
    WindowHeader.tsx

  finder/
    FinderWindow.tsx
    FinderToolbar.tsx
    ProjectGrid.tsx
    ProjectList.tsx
    ProjectItem.tsx

  projects/
    ProjectViewer.tsx
    ProjectForm.tsx
    ProjectDeleteDialog.tsx

  apps/
    AboutApp.tsx
    ContactApp.tsx
    ResumeApp.tsx

  common/
    Button.tsx
    Modal.tsx
    LoadingState.tsx
    EmptyState.tsx
    ErrorState.tsx

lib/
  supabase/
    client.ts
    types.ts
    projects.ts

store/
  desktopStore.ts
  windowStore.ts

hooks/
  useProjects.ts
  usePersistedDesktopState.ts
  useWindowManager.ts

types/
  project.ts
  window.ts
  desktop.ts

config/
  desktopApps.ts
  site.ts

supabase/
  migrations/
    001_projects.sql

public/
  wallpapers/
  project-images/
  icons/

docs/
  PRD.md
  TRD.md
  IMPLEMENTATION_PLAN.md
  DESIGN.md
```

## 5. Database Schema

Use a table named:

`projects`

Suggested SQL:

```sql
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  category text,
  tech_stack text[] not null default '{}',
  github_url text,
  live_url text,
  image_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Add an update trigger for `updated_at`.

## 6. Security / RLS

Use Supabase Row Level Security.

Because this is a personal portfolio and no admin authentication is initially required, choose one of these approaches:

### Recommended MVP
Allow public read access.

For write operations:
- Prefer protected writes through a simple admin mechanism rather than exposing unrestricted anonymous database writes.

A practical initial architecture is:
- Public users can `SELECT`.
- Project creation/edit/delete is performed through server-side actions or protected API routes.
- Store a secret only in server-side environment variables.
- Never expose the Supabase service-role key to the browser.

If a full authentication flow is introduced later, replace the protected-write mechanism with Supabase Auth.

## 7. Environment Variables

Expected variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never commit real credentials.

Provide `.env.example`.

## 8. Project API / Data Layer

Create a single project data layer.

Functions should resemble:

```ts
getProjects()
getProjectBySlug(slug)
createProject(project)
updateProject(id, project)
deleteProject(id)
```

UI components must not contain direct SQL.

## 9. Window Manager

Every window should have a common model:

```ts
type WindowState = {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
};
```

Required window behavior:
- open
- close
- minimize
- maximize
- restore
- bring to front
- drag
- resize on desktop

Double-clicking the title bar can toggle maximize.

The last active window gets the highest z-index.

## 10. Virtual Desktop Model

Desktop files/folders are application-level UI objects, not the user's real operating-system files.

Example:

```ts
type DesktopItem = {
  id: string;
  type: "folder" | "file" | "app";
  name: string;
  icon: string;
  action: string;
};
```

Desktop items are configured centrally.

## 11. Projects Folder Model

The Projects Finder window should fetch records from the database.

Do not hard-code project cards into the UI.

The UI should map over fetched records:

```text
projects.map(project => ...)
```

Adding a project must therefore require no frontend code change.

## 12. Project Creation Flow

Use a modal/window form.

Fields:
- Title
- Slug
- Description
- Long Description
- Category
- Tech Stack
- GitHub URL
- Live URL
- Image URL
- Featured
- Sort Order

Validation:
- title required
- slug required and unique
- description required
- valid URL format when URLs are provided

Submission:
1. validate
2. show loading
3. call protected backend action
4. save to Supabase
5. re-fetch / invalidate project query
6. close form
7. show success
8. project appears in Finder

## 13. Editing and Deleting

Editing should reuse the same form.

Deletion:
- require confirmation
- show project title
- perform delete
- update UI after success

## 14. Local Persistence

Persist a versioned object:

```text
harshit-desktop-state-v1
```

Store:
- window states
- desktop positions
- Finder view mode
- Dock hidden/shown
- optional wallpaper selection

Do not store:
- passwords
- service-role keys
- private auth tokens
- sensitive form data

When state schema changes, handle version migration.

## 15. Startup Behavior

On page load:

```text
1. Render desktop shell
2. Read local desktop state
3. Restore window / icon layout
4. Fetch projects
5. Hydrate Projects Finder
6. Mark UI ready
```

Do not block the entire page waiting for project data.

Show a Finder loading state where appropriate.

## 16. Data Freshness

For MVP:
- fetch projects when Projects window opens
- refresh after CRUD
- optionally refresh on window focus

Avoid polling.

## 17. Error Handling

Provide:
- friendly empty state
- database error state
- retry action
- form validation messages
- offline/network message where detectable

Example:

```text
Projects couldn't be loaded.
Check your connection and try again.
[Retry]
```

## 18. Browser / OS Safety

This is a visual simulation.

Never:
- call arbitrary shell commands
- use `eval`
- execute visitor code
- access the user's filesystem without explicit browser permission and a real product requirement

## 19. External Links

GitHub / live-demo buttons should open in a new tab.

Use safe external-link attributes.

## 20. Performance

- Use dynamic imports for heavier windows if useful.
- Optimize images.
- Keep the main desktop shell lightweight.
- Avoid mounting every hidden app at startup.
- Memoize static desktop items.
- Keep database requests centralized.

## 21. Testing

Minimum tests:
- project list renders
- project form validates
- create project calls data layer
- project detail resolves by slug
- delete confirmation works
- window open/close works
- minimize/restore works
- state rehydrates from localStorage
- empty database state renders correctly

## 22. Definition of Technical Completion

The system is technically complete when:
- `npm install` succeeds
- environment variables are documented
- Supabase schema can be applied
- `npm run dev` launches the app
- Projects loads from Supabase
- New Project writes to Supabase
- Edit/Delete work
- refreshing keeps project data
- returning later keeps project data
- windows behave consistently
- local desktop state is restored
- no secrets are exposed client-side
