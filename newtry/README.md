# Changelog AI

> 🚀 AI-powered changelog generator that transforms Git commits into polished release notes.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://changelog-ai-live.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)

## ✨ Features

- **AI Changelog Generation** - Transform messy commits into structured, readable changelogs
- **GitHub OAuth** - Seamless authentication with your GitHub account
- **Real-time Processing** - Async job queue with live progress tracking
- **Public Changelog Pages** - Shareable `/username/repo` URLs for your projects
- **Dark/Light Mode** - Beautiful UI with theme toggle
- **CMD+K Command Palette** - Quick navigation with keyboard shortcuts

## 🎯 Evaluation Task Coverage

| Requirement | Implementation | Reference |
|-------------|----------------|-----------|
| **State Management** | Zustand store + Context API + React hooks | [`lib/store.ts`](./frontend/lib/store.ts) |
| **REST API Integration** | Typed async functions with error handling | [`lib/api.ts`](./frontend/lib/api.ts) |
| **Component Architecture** | 18+ reusable components with shadcn/ui | [`components/`](./frontend/components/) |
| **Responsive UI** | Tailwind CSS + mobile navigation | [`globals.css`](./frontend/app/globals.css) |
| **Git Best Practices** | 45+ descriptive commits | [History](../../commits/main) |

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - App Router, Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Utility-first styling
- **Zustand** - Global state management
- **Framer Motion** - Animations
- **NextAuth.js** - GitHub OAuth

### Backend
- **Express.js** - REST API server
- **PostgreSQL** - Database (Neon)
- **OpenAI GPT-4o-mini** - AI changelog generation
- **GitHub API** - Commit fetching

## 📁 Project Structure

```
changelog-ai/
├── frontend/               # Next.js application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   └── lib/
│       ├── store.ts       # Zustand state
│       ├── api.ts         # API client
│       └── auth.ts        # NextAuth config
│
└── backend/               # Express API server
    ├── src/
    │   ├── routes/        # API endpoints
    │   └── services/      # Business logic
    └── scripts/           # Database scripts
```

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## 🔑 Environment Variables

### Frontend (.env.local)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
```

## 🌐 Live Demo

**Production**: [changelog-ai-live.vercel.app](https://changelog-ai-live.vercel.app)

## 📝 License

MIT
