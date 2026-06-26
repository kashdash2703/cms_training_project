# CMS Training Project

Training project for creating, searching, updating, and deleting CMS authors and articles.

## Prerequisites

- Node.js 20+
- pnpm
- Docker Desktop

## Getting Started

This repository is a small pnpm workspace:

```text
package.json              # root scripts that orchestrate both apps
src/backend/package.json  # backend-only dependencies and scripts
src/frontend/package.json # frontend-only dependencies and scripts
```

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment sample:

   ```bash
   cp .env.sample .env
   ```

3. Fill `.env` with local development values. For the included Docker Compose database, use:

   ```bash
   BACKEND_PORT=3000
   BACKEND_HOST=0.0.0.0
   BACKEND_URL=http://localhost:3000

   FRONTEND_PORT=5173
   FRONTEND_HOST=localhost
   FRONTEND_URL=http://localhost:5173

   NODE_ENV=development

   MONGO_HOST=localhost
   MONGO_PORT=27017
   MONGO_DB_NAME=cms_training_project
   MONGO_USER=cms_user
   MONGO_PASSWORD=cms_password
   ```

4. Start MongoDB:

   ```bash
   docker compose -f src/backend/docker-compose.yml up -d mongodb
   ```

5. Start backend and frontend together:

   ```bash
   pnpm run dev
   ```

The frontend runs at [http://localhost:5173](http://localhost:5173).  
The backend runs at [http://localhost:3000](http://localhost:3000).

## Useful Commands

Run backend typecheck:

```bash
pnpm run typecheck
```

Run frontend typecheck:

```bash
pnpm run typecheck:frontend
```

Build the frontend:

```bash
pnpm run build:frontend
```

Run tests:

```bash
pnpm test
```

Stop Docker services:

```bash
docker compose -f src/backend/docker-compose.yml down
```
