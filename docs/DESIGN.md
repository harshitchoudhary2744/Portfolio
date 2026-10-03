# DESIGN.md — Harshit macOS Portfolio

## 1. Design Philosophy

This project is a **portfolio presented as a simulated desktop environment**.

The design should communicate:

> "You are exploring Harshit's computer, not scrolling through a portfolio."

The visual language should be strongly inspired by macOS while remaining an original design.

Use the supplied screenshot as the main visual reference for:
- desktop composition
- wallpaper treatment
- top menu bar
- left-aligned desktop icons
- centered Dock
- typography hierarchy
- translucent controls

Do not reproduce Apple's proprietary branding or assets exactly.

---

# 2. Visual System

## Color Direction

Primary background:
- deep blue
- cobalt
- violet
- indigo

Window surfaces:
- translucent white with dark text OR dark translucent glass depending on the selected theme
- subtle blur
- low-opacity borders

Text:
- near-black on light windows
- near-white on dark surfaces

Status colors:
- green = successful/ready
- amber = warning
- red = destructive/error

Use a restrained palette.

---

# 3. Desktop Layout

Desktop is full viewport:

```text
┌──────────────────────────────────────────────────────┐
│  System Icon  Harshit's Portfolio  Projects  ...     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [Projects]                    Hey, I'm Harshit!     │
│                                                      │
│  [Resume]                       PORTFOLIO            │
│                                                      │
│  [About]                          AI • ML • WEB      │
│                                                      │
│                                                      │
│                         ┌────────────────────┐       │
│                         │       DOCK         │       │
│                         └────────────────────┘       │
└──────────────────────────────────────────────────────┘
```

The actual implementation should allow icons to be positioned without overlapping important content.

---

# 4. Menu Bar

Height:
- approximately 30–34px on desktop

Behavior:
- fixed at top
- slight translucency
- backdrop blur
- high z-index

Left:
- small original system symbol
- Harshit's Portfolio
- menu labels

Right:
- time
- network
- battery
- search

Typography:
- compact
- small
- high legibility

Menus appear as translucent rounded popovers.

---

# 5. Desktop Icons

Desktop icons should mimic classic Mac spacing without being exact replicas.

Each icon consists of:
- icon image
- text label
- centered alignment

Interaction:
- single click = select
- double click = open
- right click = context menu

Selected state:
- translucent rounded highlight behind label

Default positions:
- arranged vertically on the left

Positions can later be saved to localStorage.

---

# 6. Dock

Dock:
- centered horizontally
- fixed near bottom
- rounded pill / floating glass panel
- translucent
- blurred background
- subtle shadow

Each Dock item:
- icon
- hover enlargement
- optional tooltip
- small active indicator

Example order:

```text
Finder
Projects
Resume
Safari
GitHub
Terminal
Contact
```

The Dock should be driven by configuration.

---

# 7. Window Chrome

All applications use the same window shell.

```text
┌─────────────────────────────────────────────┐
│ ● ● ●     Projects                     ⋯   │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│              Window Content                 │
│                                             │
└─────────────────────────────────────────────┘
```

Traffic lights:
- close
- minimize
- maximize

They should visually communicate their purpose without exact copying.

Window properties:
- rounded corners
- subtle shadow
- backdrop blur
- border
- focused / unfocused states

---

# 8. Window Interaction

## Open
Use a quick scale + fade animation.

## Close
Use scale + fade out.

## Minimize
Shrink toward Dock.

## Maximize
Expand to a near-full-screen window while respecting the menu bar.

## Drag
Title bar is draggable.

## Resize
Resize from window edges/corners on desktop.

## Focus
Clicking anywhere inside a window brings it to the front.

Focused window:
- stronger opacity
- clearer title
- higher z-index

Inactive window:
- slightly muted

---

# 9. Finder — Projects

This is the main visual experience.

## Finder Toolbar

```text
←  →
Projects

[Search]          [+ New Project]
```

Additional controls:
- icon/list toggle
- sort
- optional info button

---

# 10. Finder Grid View

Project items should look like files/folders.

Example:

```text
┌───────────────┐
│     📁/       │
│               │
│  AI Translator│
│               │
│  Python       │
│  PyTorch      │
└───────────────┘
```

Use actual project thumbnails when supplied.

For no image:
- generate a consistent project icon from category
- e.g. ML → model icon
- web → browser/code icon
- C/C++ → code icon

---

# 11. Finder List View

Columns:

```text
Name
Category
Tech Stack
Updated
```

Rows should support:
- hover
- selected state
- context menu

---

# 12. Project Detail Window

When a project opens:

```text
┌─────────────────────────────────────────────┐
│ ● ● ●       AI Code Translator              │
├─────────────────────────────────────────────┤
│                                             │
│ [Project image]                             │
│                                             │
│ AI Code Translator                          │
│ Automated code translation using...         │
│                                             │
│ Technologies                                │
│ [Python] [PyTorch] [Transformers]           │
│                                             │
│ About                                       │
│ ...                                         │
│                                             │
│ [GitHub ↗]   [Live Demo ↗]                 │
└─────────────────────────────────────────────┘
```

Project pages should be data-driven from the database.

---

# 13. New Project Window

This should resemble a native Mac form.

Title:

**New Project**

Fields:

```text
Project Name
[____________________________]

Slug
[____________________________]

Description
[____________________________]

Category
[____________________________]

Tech Stack
[ Python ] [ PyTorch ] [ + Add ]

GitHub URL
[____________________________]

Live Demo URL
[____________________________]

Image URL
[____________________________]

Featured
[ toggle ]

Sort Order
[____]
```

Footer:

```text
[Cancel]                     [Save Project]
```

Saving should feel like a native desktop operation.

---

# 14. Empty Projects State

When there are no projects:

```text
             📁

          No Projects Yet

Add your first project to populate
Harshit's Projects folder.

       [ + New Project ]
```

This is important because the portfolio should work from an empty database.

---

# 15. Loading State

Finder should show a subtle loading state.

Example:

```text
Projects

       Loading projects...
```

Use shimmer or spinning indicator sparingly.

Avoid flashy loaders.

---

# 16. Error State

Example:

```text
Something went wrong.

We couldn't load your projects.

[ Try Again ]
```

Keep technical details out of the primary UI.

Log details for developers.

---

# 17. Context Menus

Right-clicking a project opens:

```text
Open
Open GitHub
Open Live Demo
─────────────
Edit
Duplicate
─────────────
Move to Trash
```

"Duplicate" may be optional in MVP.

Context menus should close when clicking outside.

---

# 18. Menu Bar Behavior

Implement a small functional subset.

## Harshit's Portfolio
- About This Portfolio
- Settings (future)

## File
- New Project
- Close Window

## View
- Icon View
- List View
- Show Desktop

## Go
- Projects
- Resume
- About
- Contact

## Window
- Minimize
- Zoom
- Bring All to Front

## Help
- How to use
- About project

These do not need to emulate the entire real macOS.

---

# 19. About Window

Title:

**About Harshit**

Content:

```text
Harshit Choudhary

AI / ML / Software Developer

Building projects in:
Python • C++ • JavaScript • Machine Learning

[GitHub] [LinkedIn] [Resume]
```

Keep this compact.

---

# 20. Resume Window

Show:

```text
Resume.pdf
```

Use an embedded PDF viewer or browser PDF rendering.

Controls:
- open externally
- download
- close

---

# 21. Contact Window

Native-style contact card:

```text
Contact Harshit

Email
...

GitHub
...

LinkedIn
...

[Send Email]
```

Optional contact form can be added later.

---

# 22. Motion

Animations should feel like desktop interactions.

Use:
- 120–220ms transitions for normal UI
- subtle ease-out
- modest scale on open/close
- Dock hover magnification
- menu popover fade/slide

Avoid:
- scroll-jacking
- excessive parallax
- giant animated backgrounds
- long entrance animations

---

# 23. Responsive Design

## Desktop

Full macOS-inspired experience.

## Tablet

Preserve:
- menu bar
- desktop
- Finder
- Dock

Reduce draggable window freedom.

## Mobile

Use:
- menu bar
- app launcher / Dock
- full-screen windows
- stacked content

Never make a narrow, draggable desktop window unusable on mobile.

---

# 24. Design Tokens

Centralize:

```text
--desktop-radius
--window-radius
--dock-radius
--glass-background
--glass-border
--shadow-window
--shadow-dock
--menu-height
--dock-height
--transition-fast
--transition-normal
```

This allows the entire visual system to be tuned consistently.

---

# 25. Modularity Rules

The visual layer must never hard-code individual projects.

### Desktop apps
Use an app registry.

### Projects
Render from database records.

### Windows
Use one shared window shell.

### Menus
Use menu configuration.

### Dock
Use Dock configuration.

### Icons
Use a centralized icon map.

### Theme
Use CSS variables.

This ensures future additions remain simple.

---

# 26. Visual Hierarchy

The desktop is the hero.

Do not overwhelm it with content.

The visitor should first notice:

1. macOS-style environment
2. Harshit branding
3. Projects folder
4. Dock
5. Intro text

Once Projects is opened, the projects themselves become the focus.

---

# 27. Overall Experience Target

The final experience should feel like:

```text
ENTER PORTFOLIO
       ↓
MAC DESKTOP
       ↓
OPEN PROJECTS
       ↓
FINDER WINDOW
       ↓
BROWSE PROJECTS
       ↓
OPEN PROJECT
       ↓
READ / VISIT / GITHUB
```

For the owner:

```text
OPEN PROJECTS
       ↓
+ NEW PROJECT
       ↓
FILL FORM
       ↓
SAVE
       ↓
SUPABASE
       ↓
PROJECT APPEARS
       ↓
PERSISTS AFTER RELOAD
```

The portfolio should feel playful and memorable, but the interaction model should remain simple, fast, and dependable.
