# jlabs — server

Lightweight Node server for the jlabs project. This document covers project layout, how to run the server locally, environment variables, seeding the database, and notes for running in different environments (Windows, macOS, Linux, CI, Docker).

## Quick overview

-   Minimal Express-style server (entry: `src/server.js`)
-   Simple DB helpers under `src/db/` (`db.js`, `seed.js`)
-   Auth routes in `src/routes/auth.routes.js`
-   Environment configuration via `.env` / `.env.example`

## Repository structure

-   src/
    -   server.js — application entrypoint
    -   db/
        -   db.js — DB helper/connection
        -   seed.js — script to seed the local DB
    -   routes/
        -   auth.routes.js — authentication-related endpoints
-   .env.example — example environment variables
-   package.json — scripts & dependencies

## Requirements

-   Node.js 18.x or 20.x (LTS recommended)
-   npm 9+ (or pnpm / yarn)
-   Git (for cloning)
-   Optional: Docker for containerized deployment

## Install

Open a terminal at the server folder (PowerShell on Windows, Terminal on macOS/Linux):

Using npm:

```powershell
npm ci
```

Or:

```bash
npm install
```

## Environment

Copy `.env.example` to `.env` and update values as needed:

```bash
cp .env.example .env
# or on PowerShell
Copy-Item .env.example .env
```

Typical env variables (see `.env.example` for exact names):

-   PORT — port to run the server (e.g. 3000)
-   DATABASE_URL / DB_PATH — DB connection or file path
-   JWT_SECRET — secret for signing tokens (if auth uses JWT)
-   NODE_ENV — development|production

Always check `.env.example` for the precise variable names used by this project.

## Run (development)

Start the server directly with node:

```bash
node src/server.js
```

If package.json defines scripts, you can usually run:

```bash
npm run dev     # if a dev script exists
npm start       # production start
```

Check `package.json` for available scripts.

Windows PowerShell example (set PORT for session):

```powershell
$env:PORT=3000; node src/server.js
```

## Seed the database

To populate the local DB with test data (if provided):

```bash
node src/db/seed.js
```

If a package script exists for seeding:

```bash
npm run seed
```

## API & testing

-   Auth routes live in `src/routes/auth.routes.js`. Inspect that file for the exact endpoints (for example `/auth/login`, `/auth/register`).
-   Test endpoints with curl or HTTP client:

```bash
curl -X POST http://localhost:3000/auth/login -d '{"email":"a@b.com","password":"pass"}' -H "Content-Type: application/json"
```

Adjust port and paths to match server configuration.

## Production & Docker

A minimal Docker flow:

-   Use `node:18-alpine` for building and running.
-   Copy source, install deps, and run `node src/server.js` (or the start script).

Example Dockerfile (high-level):

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/server.js"]
```

## CI (GitHub Actions) notes

-   Use `actions/setup-node` to pin Node version.
-   Install deps and run tests/build/linters as needed.

## Troubleshooting

-   Port in use: change `PORT` env var or kill the process using the port.
-   Missing env var: ensure `.env` exists and contains the variables referenced in `src/*`.
-   DB errors on startup: ensure the DB path/connection string in `.env` is valid and the `seed.js` has run (if required).

## Where to look next

-   `src/server.js` — main startup logic and middleware
-   `src/db/db.js` — DB init / connection
-   `src/routes/auth.routes.js` — auth endpoints

For repo-specific questions, inspect the source files above or contact the project owner/maintainer.
