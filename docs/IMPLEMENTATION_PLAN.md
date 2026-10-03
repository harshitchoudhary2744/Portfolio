# IMPLEMENTATION PLAN — Harshit macOS Portfolio

## 1. Delivery Strategy

Build the project in vertical slices so that a functional version exists early.

Priority order:

**Desktop shell → Window system → Finder → Supabase projects → Project CRUD → persistence → polish**

Do not spend most of the time on visual polish before the data and window architecture work.

---

# PHASE 0 — Project Setup

### Tasks

1. Create Next.js application with TypeScript.
2. Configure Tailwind CSS.
3. Add Lucide React.
4. Add Supabase client.
5. Create `.env.example`.
6. Create `.gitignore`.
7. Set up basic folder structure.
8. Add README with setup instructions.
9. Add scripts for development/build/lint.

### Deliverable

A blank but running Next.js application.

---

# PHASE 1 — Visual Foundation

### Tasks

1. Implement global CSS variables.
2. Add the macOS-inspired wallpaper.
3. Create app-wide font stack.
4. Add the desktop shell.
5. Add the menu bar.
6. Add desktop icon component.
7. Add Dock.
8. Add portfolio intro text.

### Desktop composition

```text
┌─────────────────────────────────────────────┐
│ Menu Bar                                    │
├─────────────────────────────────────────────┤
│                                             │
│ Desktop                                     │
│                                             │
│ Icons                         Portfolio      │
│                                             │
│                                             │
│                   Dock                      │
└─────────────────────────────────────────────┘
```

### Deliverable

The website already visually resembles the reference screenshot.

---

# PHASE 2 — Reusable Window System

### Tasks

Create:
- `MacWindow`
- `WindowManager`
- `TrafficLights`
- `WindowHeader`

Implement:
- open
- close
- minimize
- maximize
- restore
- z-index management

Then add desktop dragging.

After dragging works, add resizing.

### Important

Do not create separate custom window implementations for Projects, About, Contact, etc.

All windows must use the same reusable window component.

### Deliverable

A Finder window can be opened, dragged, minimized, maximized and closed.

---

# PHASE 3 — Central App Registry

Create:

```text
config/desktopApps.ts
```

Example conceptual registry:

```ts
{
  id: "projects",
  name: "Projects",
  type: "folder",
  icon: "...",
  window: "finder"
}
```

The Dock and desktop should both reference the registry.

This prevents duplicated configuration.

### Deliverable

Adding a new application requires adding configuration plus its component, not rewriting the desktop.

---

# PHASE 4 — Finder / Projects UI

### Tasks

1. Create Finder toolbar.
2. Add icon view.
3. Add list view.
4. Add search field.
5. Add sort options.
6. Add empty state.
7. Add loading state.
8. Add project item component.
9. Add project detail window.

Initially use temporary in-memory sample projects.

### Deliverable

A fully navigable Projects Finder with fake/sample data.

---

# PHASE 5 — Supabase Integration

### Tasks

1. Create Supabase project.
2. Create `projects` table.
3. Create indexes where useful.
4. Enable RLS.
5. Add public read policy.
6. Add secure server-side write mechanism.
7. Add typed project model.
8. Implement project data layer.

### Data layer

Implement:

```text
getProjects
getProjectBySlug
createProject
updateProject
deleteProject
```

### Deliverable

Projects window reads real data from Supabase.

---

# PHASE 6 — New Project Functionality

### Tasks

1. Add `+ New Project`.
2. Create Mac-style form window.
3. Add form validation.
4. Add loading state.
5. Submit to secure backend action.
6. Save to Supabase.
7. Refresh project list.
8. Show success message.
9. Open newly created project if appropriate.

### Deliverable

The owner can add a project from the portfolio itself.

---

# PHASE 7 — Edit / Delete

### Tasks

1. Context menu.
2. Edit project.
3. Reuse project form.
4. Delete confirmation.
5. Delete from Supabase.
6. Refresh Finder.

### Deliverable

Projects function like manageable portfolio records rather than static cards.

---

# PHASE 8 — Local UI Persistence

Implement a small state layer for:
- window positions
- sizes
- minimized/maximized state
- desktop icon positions
- Finder view
- Dock state

Persist to:

```text
localStorage
```

Use a versioned key.

### Important

Database persistence is used for projects.

localStorage persistence is used for interface state.

These two responsibilities must remain separate.

### Deliverable

Closing and reopening the site preserves the desktop arrangement.

---

# PHASE 9 — macOS Interaction Polish

Implement:

### Window behavior
- correct focus
- smooth open animation
- smooth minimize
- double-click maximize
- active/inactive title bar appearance

### Desktop behavior
- single click selects
- double click opens
- selected item highlight
- optional right-click context menu

### Dock behavior
- hover enlargement effect
- active app indicator
- click to open
- click active app to focus/minimize

### Menu bar behavior
- working dropdown menus
- File → New Project
- File → Close Window
- Go → Projects
- Window → minimize/restore controls
- Help → About

Do not attempt to reproduce every macOS system feature.

---

# PHASE 10 — Project Detail Experience

When a project opens, show a polished project window.

Content:

```text
Project Name
Category
Description

Tech Stack
[Python] [PyTorch] [React]

About the Project
...

[GitHub] [Live Demo]
```

Optional:
- screenshot
- architecture image
- project status
- year

Use a consistent window style.

---

# PHASE 11 — Additional Apps

Implement basic:
- About Me
- Resume
- Contact

These should reuse the same window system.

### Resume

Prefer a PDF viewer or embedded document preview where practical.

### Contact

Show:
- Email
- GitHub
- LinkedIn
- optional contact form

---

# PHASE 12 — Mobile Adaptation

### Desktop

Keep the strongest macOS experience.

### Mobile

Transform:
- windows → full-screen panels
- Dock → compact bottom navigation
- desktop icons → responsive grid
- Finder columns → stacked layout

Do not force desktop dragging on narrow screens if it harms usability.

---

# PHASE 13 — Visual Polish

Use the provided reference screenshot as a visual direction.

Tune:
- wallpaper crop
- menu bar height
- desktop icon spacing
- Dock translucency
- glass blur
- shadows
- corner radius
- typography
- window chrome
- hover transitions

Keep the appearance cohesive.

---

# PHASE 14 — Testing

### Manual test checklist

1. Load homepage.
2. Open Projects.
3. Drag Projects window.
4. Minimize Projects.
5. Restore Projects.
6. Maximize Projects.
7. Close Projects.
8. Reopen Projects.
9. Add project.
10. Refresh page.
11. Confirm project still exists.
12. Close browser.
13. Return later.
14. Confirm project still exists.
15. Edit project.
16. Delete project.
17. Test with zero projects.
18. Test slow network.
19. Test invalid form.
20. Test mobile layout.

---

# PHASE 15 — Deployment

### Tasks

1. Create production build.
2. Add Vercel project.
3. Configure environment variables.
4. Deploy.
5. Verify Supabase policies.
6. Test project creation in production.
7. Test project persistence after deployment.
8. Test mobile.

---

# PHASE 16 — Final Cleanup

Before final delivery:

- remove dead code
- remove fake data except clearly labeled seed/demo data
- remove hard-coded project cards
- ensure no secrets are committed
- ensure errors are user-friendly
- update README
- document database setup
- document deployment
- document how to add projects
- document localStorage state
- add screenshots to README if useful

---

# 3. Definition of Done

The portfolio is done when this exact sequence works:

```text
Open website
     ↓
macOS-like desktop appears
     ↓
Open Projects folder
     ↓
Projects fetched from Supabase
     ↓
Click + New Project
     ↓
Fill form
     ↓
Save
     ↓
Project inserted in database
     ↓
Project appears in Finder immediately
     ↓
Refresh website
     ↓
Project still exists
     ↓
Close browser
     ↓
Return days later
     ↓
Project still exists
```

And:

```text
Window positions/state
        ↓
localStorage
        ↓
restored on next visit
```

---

# 4. Practical Development Rule

At every phase, keep the application runnable.

Do not wait until the end to discover that the window system, data model and routing conflict.

Build small, testable slices and commit frequently.
