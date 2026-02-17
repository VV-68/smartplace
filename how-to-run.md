# SmartPlace - Development Setup (Supabase Migration)

This project has been migrated from a local Docker-based PostgreSQL setup to **Supabase** (Online PostgreSQL). Docker is no longer required.

---

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- A **Supabase** account and project.

---

## Getting Started

### 1. Database Setup (Supabase)

1. Create a project on [Supabase](https://supabase.com/).
2. Go to **Project Settings** > **Database**.
3. Copy the **Connection String** (URI).
   - Ensure you use the "Transaction" or "Session" mode depending on your needs. For simple use, the standard URI is fine.
   - Replace `[YOUR-PASSWORD]` with your actual database password.

### 2. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and paste your Supabase connection string:
   ```env
   DATABASE_URL=your_supabase_connection_string_here
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```
   The backend will run at `http://localhost:3000`.

### 3. Frontend Setup

1. Navigate to the `smartplace` directory:
   ```bash
   cd ../smartplace
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

---

## System Architecture

| Service | Technology | Port | Access |
| --- | --- | --- | --- |
| **Frontend** | React (Vite) | `5173` | `localhost:5173` |
| **Backend** | Node.js (Express) | `3000` | `localhost:3000` |
| **Database** | Supabase (Postgres) | `5432` (Cloud) | Supabase Dashboard |

---

## 🛑 Stopping the App

- Press `Ctrl + C` in both terminal windows (server and smartplace) to stop the processes.