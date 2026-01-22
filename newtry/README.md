# Changelog AI

A SaaS platform that automates changelog generation from GitHub commits using AI.

## Architecture

- **Repo** → **Webhook** → **API Server** → **AI Processing** → **Database** → **User Dashboard**

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Next.js 14 + Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL
- **Queue**: BullMQ + Redis
- **AI**: Claude / Gemini

## Development

### Prerequisites
- Node.js
- PostgreSQL
- Redis

### Setup
1. Clone the repo.
2. Install dependencies in `backend` and `frontend`.
3. Configure `.env` files.
