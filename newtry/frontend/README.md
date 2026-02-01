# Changelog AI

> AI-powered changelog generator that transforms Git commits into polished release notes.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)

## 🎯 Evaluation Task Coverage

| Requirement | Implementation | File Reference |
|-------------|----------------|----------------|
| **State Management** | Zustand store + React Context API + useState/useCallback hooks | [`lib/store.ts`](./lib/store.ts), [`components/providers.tsx`](./components/providers.tsx) |
| **REST API Integration** | Typed API functions with async/await, error handling, and polling | [`lib/api.ts`](./lib/api.ts) |
| **Component Architecture** | 18+ reusable components with shadcn/ui base | [`components/`](./components/) |
| **Responsive UI** | Tailwind CSS with mobile-first design + CSS variables | [`app/globals.css`](./app/globals.css), [`components/mobile-nav.tsx`](./components/mobile-nav.tsx) |
| **Git Best Practices** | 30+ meaningful commits with descriptive messages | [Commit History](../../commits/main) |

## 🏗️ Architecture

```
frontend/
├── app/                    # Next.js App Router
│   ├── dashboard/          # Protected routes
│   └── api/                # API routes (OG images)
├── components/
│   ├── ui/                 # Reusable UI primitives
│   ├── landing/            # Landing page sections
│   ├── editor.tsx          # Changelog editor (state management)
│   └── job-progress.tsx    # Async polling component
└── lib/
    ├── store.ts            # Zustand global state
    ├── api.ts              # REST API client (typed)
    ├── auth.ts             # NextAuth configuration
    └── motion.ts           # Framer Motion variants
```

## 🔑 Key Technical Highlights

### State Management (Zustand)

```tsx
// lib/store.ts - Global state with typed actions
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      repositories: [],
      activeJobs: {},
      commandPaletteOpen: false,

      fetchRepositories: async () => {
        set({ isLoadingRepos: true });
        const repos = await getRepos();
        set({ repositories: repos, isLoadingRepos: false });
      },

      startJob: (jobId, repoName) => {
        set(state => ({
          activeJobs: {
            ...state.activeJobs,
            [jobId]: { id: jobId, repoName, status: 'pending', progress: 0 }
          }
        }));
      },
    }),
    { name: 'changelog-ai-store' }
  )
);

// Selector hooks for optimized re-renders
export const useRepositories = () => useAppStore(state => state.repositories);
export const useCommandPaletteOpen = () => useAppStore(state => state.commandPaletteOpen);
```

### API Integration

```tsx
// lib/api.ts - Typed REST API functions
export async function getChangelog(username: string, repo: string): Promise<ChangelogData> {
  const res = await fetch(`${API_URL}/api/changelog/${username}/${repo}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Async job polling with setInterval
useEffect(() => {
  const interval = setInterval(pollStatus, 2000);
  return () => clearInterval(interval);
}, [pollStatus]);
```

### Responsive Design

- Mobile hamburger navigation (`components/mobile-nav.tsx`)
- CSS variables for theming (`app/globals.css`)
- Media query breakpoints (md, lg, xl)

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local  # Add your GitHub OAuth keys
npm run dev
```

## 🌐 Live Demo

**Production**: [changelog-ai-live.vercel.app](https://changelog-ai-live.vercel.app)
