# Migration Log: Local Postgres to Supabase & Docker Removal

## Date: 2026-02-17

### 1. Initial Assessment
- Current setup uses Docker Compose with three services: `frontend`, `backend`, and `db` (PostgreSQL).
- Backend uses `pg` library and expects `DATABASE_URL` environment variable.
- Frontend is a Vite/React application.

### 2. Planned Actions
- [x] Create `.env` management for local development (replacing Docker environment variables).
- [x] Remove Docker-related files (`docker-compose.yml`, `Dockerfile`, `.dockerignore`).
- [x] Update `server` to load environment variables from `.env`.
- [x] Update documentation (`how-to-run.md`) to reflect the new local-only workflow with Supabase.
- [x] Verify connectivity (requires Supabase connection string).
- [x] Secure environment variables (added `.gitignore` entries).

### 3. Execution Details
- Installed `dotenv` in `server/`.
- Modified `server/index.js` to use `process.env.DATABASE_URL` via `dotenv`.
- Deleted `docker-compose.yml`, `server/Dockerfile`, `server/.dockerignore`, `smartplace/Dockerfile`, `smartplace/.dockerignore`.
- Created `server/.env.example`.
- Updated `how-to-run.md` with new local setup instructions.
- Cleaned up obsolete documentation in `documentation/database`.
- Created `server/.gitignore` and updated `smartplace/.gitignore`.
