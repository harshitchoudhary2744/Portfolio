# Harshit — macOS Personal Portfolio

A browser-based personal portfolio website engineered as an interactive macOS desktop environment. Projects are dynamically managed and persisted in **Supabase PostgreSQL**, while window arrangements, positions, sizes, and finder modes are persistently cached in **localStorage**.

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Key Features

- **macOS Desktop Environment**:
  - Full-screen silky cobalt-blue abstract wallpaper.
  - Functional top Menu Bar with system status (live clock, Wi-Fi, battery, spotlight) and popover menus.
  - Left-aligned draggable desktop icons (`Projects`, `Resume.pdf`, `About Me`, `Contact`).
  - Centered hero introduction: *"Hey, I'm Harshit! welcome to my PORTFOLIO"*.
  - Floating bottom Dock with glassmorphism, hover magnification, active app dot indicators, and an *Ask Me* shortcut button.
- **Centralized Reusable Window Manager (`MacWindow`)**:
  - ONE unified window system across all apps.
  - Dragging via title bar with desktop boundary enforcement.
  - Edge and corner resizing on desktop.
  - Traffic light buttons (Close, Minimize, Zoom/Maximize) with hover symbols (`×`, `−`, `+`).
  - Double-click title bar to toggle maximize/restore.
  - Visual focus state management and z-index ordering.
  - Keyboard accessibility (`Escape` key closes focused window).
- **Projects Finder**:
  - Dynamically fetched and rendered from **Supabase PostgreSQL** database.
  - Icon / Grid View and List / Table View with persistent view preference.
  - Instant client-side search by title, category, description, and tech stack.
  - Category filtering and sorting options.
  - `+ New Project` button opening the native macOS form modal.
- **Full Project CRUD**:
  - **Create**: Add new projects with validation, slug uniqueness, and automatic timestamps.
  - **Read**: Project Details window with banner, architecture details, and direct GitHub/Demo links.
  - **Update**: Right-click project -> *Edit* to modify existing records.
  - **Delete**: Right-click project -> *Delete* with native macOS confirmation sheet.
- **Built-in macOS Applications**:
  - **Projects Finder**: Central portfolio catalog.
  - **Resume.pdf Viewer**: Embedded document viewer with PDF download and print support.
  - **About Me**: Bio, education, location, and technical skill matrix.
  - **Contact**: Direct email composer with one-click email copying and social links.
  - **Terminal**: Interactive `zsh` terminal with commands (`help`, `whoami`, `projects`, `skills`, `contact`, `resume`, `date`, `clear`, `exit`).
  - **Safari Browser**: Web viewer with address bar and live demo frame.
- **Dual-Layer Persistence**:
  - `DATABASE`: Supabase PostgreSQL is the source of truth for portfolio project data.
  - `LOCALSTORAGE`: Key `harshit-desktop-state-v1` persists window bounds, desktop icon positions, and view preferences.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd portfolioweb

# Install dependencies
npm install
```

### 3. Supabase Setup (PostgreSQL Database)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/001_projects.sql` from this repository and run the SQL script. This creates the `projects` table, performance indexes, timestamp triggers, and Row Level Security (RLS) policies.
4. Go to **Project Settings** -> **API** and copy your:
   - `Project URL`
   - `anon public key`
5. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

*(Note: If you run the project without Supabase credentials, it will run in Local Storage Demo Mode, allowing you to test all CRUD operations seamlessly).*

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture

```text
portfolioweb/
├── public/
│   ├── wallpapers/          # Pristine macOS silk abstract wallpaper
│   ├── icons/               # Original system emblem SVG
│   └── project-images/      # Project thumbnail assets
├── src/
│   ├── components/
│   │   ├── apps/            # AboutApp, ContactApp, ResumeApp, TerminalApp, SafariApp
│   │   ├── common/          # EmptyState, ErrorState, LoadingState, NotificationToast, BrandIcons
│   │   ├── desktop/         # Desktop, DesktopIcon, DesktopIntro, ContextMenu
│   │   ├── dock/            # Dock, DockItem
│   │   ├── finder/          # FinderWindow, FinderToolbar, ProjectGrid, ProjectList, ProjectCard
│   │   ├── menubar/         # MenuBar, MenuDropdown, SystemStatus
│   │   ├── projects/        # ProjectViewer, ProjectForm, ProjectDeleteDialog
│   │   └── windows/         # MacWindow, TrafficLights, WindowManager
│   ├── config/              # site.ts, desktopApps.ts, seedProjects.ts
│   ├── hooks/               # useProjects.ts
│   ├── lib/
│   │   └── supabase/        # client.ts, projects.ts
│   ├── store/               # desktopStore.tsx, windowStore.tsx
│   ├── types/               # project.ts, window.ts, desktop.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   └── migrations/          # 001_projects.sql
├── docs/                    # PRD.md, TRD.md, DESIGN.md, IMPLEMENTATION_PLAN.md
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔒 Security & Privacy

- Client code **never** receives or exposes the Supabase service-role key.
- All database write operations validate title, slug, and descriptions.
- Sensitive environment variables are excluded via `.gitignore`.

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Environment Variables**, set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will run `npm run build` and publish your portfolio instantly!
