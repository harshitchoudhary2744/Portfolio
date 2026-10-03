# PRD — Harshit macOS Portfolio

## 1. Product Overview

### Product Name
**Harshit — Personal macOS Portfolio**

### Product Type
A personal portfolio website presented as a simulated macOS desktop.

### Core Idea
The portfolio should not behave like a normal scrolling portfolio website. It should feel like opening a lightweight macOS desktop in the browser.

The user lands on a desktop with:
- macOS-style menu bar
- Desktop wallpaper
- Desktop icons
- Finder-like folders
- Draggable application windows
- macOS-style Dock
- Context menus
- Project files/folders
- Persistent project data
- Optional terminal-style and about/contact apps

The most important folder is **Projects**. A user can open it, see all projects stored in the database, and click **New Project** to add another portfolio project. Once a project is created, it must still appear after the browser is closed and reopened days later.

## 2. Product Goals

1. Make the portfolio immediately recognizable as a macOS-inspired interactive desktop.
2. Make the UI feel like an operating system rather than a website dashboard.
3. Make the interaction model modular so additional applications and projects can be added later.
4. Persist portfolio project records in a real database.
5. Persist useful client-side desktop state such as window positions and sizes locally.
6. Make adding a project possible without changing source code.
7. Keep the implementation understandable and maintainable for a college student.
8. Ensure the system works well on desktop while remaining usable on smaller screens.

## 3. Non-Goals

The application is not intended to:
- Recreate macOS at the operating-system level.
- Access the visitor's real filesystem.
- Execute arbitrary shell commands.
- Implement a complete Finder clone.
- Implement real macOS authentication.
- Require a complicated backend architecture.
- Build a full CMS product.

This is a **macOS-inspired portfolio environment**.

## 4. Reference Visual Direction

Use the supplied reference screenshot as the visual starting point.

Important traits to preserve:
- Deep blue/purple macOS wallpaper feel
- White top-left Apple-style icon
- Text navigation in the menu bar
- Desktop icons aligned on the left
- Centered Dock at the bottom
- Large introductory portfolio text on the desktop
- Soft glass / translucent UI elements
- macOS-style iconography and spacing

Do not copy Apple's branding assets directly. Use an original Apple-inspired symbol or neutral system symbol.

## 5. Primary User Journey

### First Visit

1. User opens the website.
2. Desktop loads.
3. Menu bar appears at the top.
4. Wallpaper appears behind desktop content.
5. Desktop icons appear.
6. Dock appears at the bottom.
7. Intro message identifies the portfolio as Harshit's portfolio.
8. Projects folder is visible.

### Open Projects

1. User double-clicks the **Projects** folder.
2. A Finder-like window opens.
3. The window displays project icons/cards loaded from the database.
4. Existing projects appear automatically.
5. User can open a project by double-clicking it.
6. A project-detail window opens.

### Add Project

1. User opens Projects.
2. User clicks **+ New Project**.
3. A macOS-style form window/modal opens.
4. User enters project information.
5. User submits.
6. Client validates the form.
7. Backend writes the project to the database.
8. The Projects window refreshes.
9. The new project appears immediately.
10. Closing and reopening the website later still shows the project because it is stored in the database.

## 6. Desktop Applications / Objects

### Required Desktop Objects

- **Projects** folder
- **Resume.pdf** document
- **About Me** or About application
- **Contact** application
- Optional future apps such as Terminal, Skills, Certifications, etc.

### Required Dock Items

- Finder / Home
- Projects
- Safari-like browser icon for external links
- Mail / Contact
- GitHub
- Terminal
- Optional Trash

Dock items must be configurable from a central data structure rather than duplicated throughout the application.

## 7. Menu Bar

Left side:
- System icon
- **Harshit's Portfolio**
- File
- View
- Go
- Window
- Help

Right side:
- Time/date
- Wi-Fi-style status icon
- Battery-style indicator
- Search icon or Spotlight
- User/profile icon if needed

Menu items do not need full macOS functionality. They should expose useful portfolio actions.

Examples:
- File → New Project
- File → Close Window
- View → Show Desktop
- Go → Projects
- Window → Minimize All
- Help → About This Portfolio

## 8. Main Desktop

The desktop should contain:
- Wallpaper
- Intro copy
- Desktop icons
- Optional small widgets

Intro copy:

**Hey, I'm Harshit! Welcome to my**

**PORTFOLIO**

Supporting line:
**AI / ML / Web Development / Projects**

This should be editable from configuration.

## 9. Projects Finder Window

This is the core application.

### Header
- Traffic-light controls
- Back / forward buttons
- Current folder title
- View toggle
- Search
- New Project button

### Body
Support at least:
- Icon/Grid view
- List view

Each project should show:
- Project icon or thumbnail
- Project name
- Short description
- Technology badges
- Optional status label

### Project actions
Double click:
- Open project

Context menu:
- Open
- Open GitHub
- Open Live Demo
- Edit
- Delete

Delete requires confirmation.

## 10. Project Data Model

Minimum fields:

- id
- title
- slug
- description
- long_description
- category
- tech_stack
- github_url
- live_url
- image_url
- featured
- sort_order
- created_at
- updated_at

Optional future fields:
- year
- status
- screenshots
- case_study
- repo_visibility

## 11. Persistence Requirements

### Database
Use **Supabase Postgres** for project records.

Every project created through the UI must be persisted remotely.

### Local Browser State
Use `localStorage` for non-sensitive UI state such as:
- Desktop icon positions
- Window positions
- Window sizes
- Open/closed windows
- Last selected Finder view
- Dock visibility
- Wallpaper choice, if configurable
- Theme mode if configurable

Do not put project records only in localStorage.

### Rehydration
When the website opens:
1. Load default shell state.
2. Restore local UI state.
3. Fetch current project records from Supabase.
4. Render Projects using the fetched database records.

## 12. Responsiveness

Desktop is the primary experience.

On tablet/mobile:
- Desktop icons may become a responsive grid.
- Windows become full-screen or nearly full-screen.
- Dock can become a bottom app bar.
- Two-column layouts become stacked.
- Dragging can be reduced or disabled where necessary.

The mobile version must remain usable even if it cannot perfectly reproduce desktop macOS behavior.

## 13. Accessibility

Include:
- keyboard-accessible buttons
- visible focus states
- appropriate labels
- sensible heading structure
- readable contrast
- ESC to close modal windows
- Enter / Space activation for controls
- accessible dialogs

## 14. Performance

- Lazy-load project images.
- Avoid loading all app code at first render.
- Load the main shell quickly.
- Cache model-independent static portfolio content.
- Avoid unnecessary database requests.
- Use optimistic UI only where safe; database confirmation remains the source of truth.

## 15. Success Criteria

The project is successful when:

1. Opening the site feels like entering a macOS-style desktop.
2. Windows can open and close naturally.
3. Projects folder feels like Finder.
4. Existing projects are fetched from the database.
5. A new project can be created from the Projects window.
6. The new project immediately appears in the folder.
7. Refreshing the page preserves the project.
8. Closing the browser and returning days later still shows the project.
9. Window and desktop UI state can be restored locally.
10. The implementation remains modular enough to add future desktop apps without rewriting the shell.

## 16. Future Expansion

The architecture should make it easy to add:
- Skills folder
- Certifications folder
- Experience folder
- Blog / Notes
- Terminal
- GitHub browser
- Contact form
- Resume previewer
- Settings app
- Search / Spotlight
