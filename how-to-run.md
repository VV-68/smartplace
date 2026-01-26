---

# SmartPlace - Full Stack Development Setup

This project is fully containerized with **Docker**. This ensures that the Arch, Windows, and Debian users on our team all have the exact same environment. No need to install Postgres or Node globally on your system.

---

## Prerequisites

You only need to install **Docker** and **Docker Compose**.

* **Windows:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/). (Ensure WSL2 is enabled).
* **Linux (Arch):** `sudo pacman -S docker docker-compose` (Then `sudo systemctl enable --now docker`).
* **Linux (Debian/Ubuntu):** `sudo apt install docker.io docker-compose`.

---

## Getting Started

### 1. Boot the entire stack

Run this command from the root directory:

```bash
docker compose up --build

```

This will start:

* **Frontend:** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) (Vite + React)
* **Backend:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) (Node Express)
* **Database:** PostgreSQL (Internal port 5432)

### 2. Adding New Dependencies

If you run `npm install <package>` locally in the `/server` or `/smartplace` folders, you **must** tell Docker to rebuild the images, or the app will crash with `MODULE_NOT_FOUND`:

```bash
docker compose down
docker compose up --build

```

---

## System Architecture

| Service | Technology | Port | Access |
| --- | --- | --- | --- |
| **Frontend** | React (Vite) | `5173` | `localhost:5173` |
| **Backend** | Node.js (Express) | `3000` | `localhost:3000` |
| **Database** | PostgreSQL 16 | `5432` | `localhost:5432` |

---

## Database Interaction

### Connecting via GUI (DBeaver/TablePlus)

* **Host:** `localhost`
* **Port:** `5432`
* **User:** `admin`
* **Password:** `mypassword`
* **Database:** `smartplace_db`

### Connecting via Terminal

To jump into the Postgres CLI directly:

```bash
docker exec -it college_projects-db-1 psql -U admin -d smartplace_db

```

---

## 🛑 Stopping the App

* `Ctrl + C` in the terminal stops the logs.
* `docker compose stop` stops the containers.
* `docker compose down -v` **RESETS** everything (wipes the DB and volumes—use with caution!).

---
