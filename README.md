# Jay Panchal Portfolio

A responsive single-page portfolio built with React, TypeScript, and Vite.

## Project structure

```
src/
├── App.tsx
├── main.tsx
├── data/portfolio.ts       # Content (experience, skills, etc.)
├── hooks/
│   ├── useTheme.ts
│   └── useToast.ts
├── styles/globals.css
└── components/
    ├── Header.tsx
    ├── Intro.tsx
    ├── Experience.tsx
    ├── Impact.tsx
    ├── Capabilities.tsx
    ├── Education.tsx
    ├── Quote.tsx
    ├── Footer.tsx
    ├── CommandPalette.tsx
    └── Toast.tsx
```

## How to run manually

### Prerequisites

Install [Node.js](https://nodejs.org/) (version 18 or newer).

### First-time setup

Open a terminal in this folder and run:

```bash
cd /Users/jay/Documents/Codex/2026-06-15/files-mentioned-by-the-user-jay/jay-portfolio
npm install
```

### Start the dev server

```bash
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). Open that in your browser.

### Other commands

```bash
npm run build    # Build for production (output in dist/)
npm run preview  # Preview the production build locally
```

## Resume file

Place your resume at `public/assets/jay-panchal-resume.pdf` so the Resume links work.
