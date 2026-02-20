# Quran Tracker - Project Documentation

## Project Overview

**Quran Tracker** is a web application designed to help users track their Quran reading progress during Ramadhan 1447H. The app calculates real-time reading targets based on the user's goal (number of complete Quran readings/"hatam") and displays the current target page and line that should be read at any given moment.

### Key Features

- **Real-time Progress Tracking**: Live updates every second showing the current target position
- **Multiple Hatam Support**: Users can set goals for 1-5 complete Quran readings during Ramadhan
- **Page & Line Precision**: Tracks progress down to the specific line (1-15) of each page
- **Progress Visualization**: Visual progress bars showing percentage completion
- **Local Storage**: All configuration is stored in browser localStorage (no backend required)
- **Responsive Design**: Mobile-first UI with Tailwind CSS

### Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Astro 5.x |
| UI Components | React 19.x |
| Styling | Tailwind CSS 4.x |
| Icons | Tabler Icons |
| Deployment | GitHub Pages |
| Language | TypeScript |

### Architecture

```
src/
├── components/       # React components
│   ├── QuranTracker.tsx    # Main tracker dashboard
│   ├── SetupForm.tsx       # Initial setup form
│   └── ResetModal.tsx      # Reset confirmation modal
├── data/             # Static data files
│   ├── surahData.ts  # All 114 surah information
│   └── pageData.ts   # Page/line constants (604 pages, 15 lines/page)
├── hooks/            # Custom React hooks
│   └── useQuranTracker.ts  # Main state management hook
├── layouts/          # Astro layouts
│   └── Layout.astro  # Base HTML layout
├── pages/            # Astro pages
│   ├── index.astro   # Main tracker page
│   └── setup.astro   # Initial setup page
├── styles/           # Global styles
│   └── app.css       # Tailwind imports
└── utils/            # Utility functions
    ├── calculations.ts     # Time/progress calculations
    ├── calculations.test.ts # Unit tests
    └── storage.ts          # localStorage management
```

## Building and Running

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the Astro dev server. The app will be available at `http://localhost:4321/quran-tracker/`

### Production Build

```bash
npm run build
```

Builds the static site to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Testing

```bash
npm test
```

Runs the calculation unit tests using tsx.

### Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions:
- Push to `main` branch triggers automatic build and deploy
- Site URL: `https://rizkywahyuprasetiyo.github.io/quran-tracker`

## Development Conventions

### Code Style

- **TypeScript**: Strict mode enabled via `astro/tsconfigs/strict`
- **React**: JSX with `react-jsx` transform
- **Component Pattern**: React components for interactive UI, Astro for static pages
- **Path Aliases**: Use `~/*` alias for `./src/*` imports

### Testing Practices

- Unit tests located in `src/utils/` with `.test.ts` suffix
- Tests use simple assertion helpers (no external testing framework)
- Run tests before committing calculation-related changes

### Key Domain Concepts

| Term | Definition |
|------|------------|
| **Hatam** | Complete reading of the entire Quran (604 pages) |
| **Target Count** | Number of hatam goals set by user (1-5) |
| **Target Position** | Current page and line that should be read |
| **Decimal Page** | Internal representation (e.g., 45.5 = page 45, line 8) |

### Important Constants

```typescript
TOTAL_PAGES = 604        // Pages in standard Mushaf
LINES_PER_PAGE = 15      // Lines per page
RAMADHAN_DAYS = 29       // Default Ramadhan duration
```

### Storage Schema

```typescript
interface TrackerConfig {
  startDate: string;     // ISO date string
  targetCount: number;   // 1-5 hatam goal
}
// Stored in localStorage as: 'quran-tracker-config'
```

## API Reference

### Core Utilities (`src/utils/calculations.ts`)

| Function | Description |
|----------|-------------|
| `getEndDate(startDate)` | Returns date 29 days after start |
| `getHoursElapsed(start, now)` | Hours between two dates |
| `getTargetDecimalPage(start, target, now)` | Current target as decimal page |
| `decimalToPageLine(decimal)` | Converts 45.5 → {page: 45, line: 8} |
| `calculateTargetStats(start, target, now)` | Full stats object for UI |

### Storage (`src/utils/storage.ts`)

| Function | Description |
|----------|-------------|
| `saveConfig(config)` | Persist tracker configuration |
| `getConfig()` | Retrieve stored configuration |
| `hasSetup()` | Check if user has completed setup |
| `clearAll()` | Reset all stored data |

## GitHub Actions Workflow

The deploy workflow (`.github/workflows/deploy.yml`):
1. Checks out code
2. Sets up Node.js 20 with npm caching
3. Installs dependencies (`npm ci`)
4. Builds with Astro (`npm run build`)
5. Uploads `dist/` as artifact
6. Deploys to GitHub Pages

## Notes

- **No Backend**: All data is stored client-side in localStorage
- **Static Site**: Built output is fully static HTML/CSS/JS
- **Base Path**: Configured for `/quran-tracker/` subdirectory deployment
- **Language**: UI text is in Indonesian (Bahasa Indonesia)
