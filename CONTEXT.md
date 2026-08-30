# Serve Board — Project Context

> Quick-reference for AI assistants and developers. Read this instead of the full codebase.

## Purpose
A church volunteer sign-up board where members can browse serving opportunities, create events, and enroll.

## Tech Stack
- **Frontend:** Vanilla HTML/CSS/JS (no framework)
- **Backend:** Node.js + Express 5 REST API
- **Database:** MySQL 8 (local)
- **Session:** Browser `sessionStorage` (stores username after login)

## Directory Structure
```
GPW/
├── Pages/              # HTML pages
│   ├── Login.html      # Sign-in / sign-up page
│   └── board.html      # Main board + My Events view
├── Pray Js/            # Client-side JavaScript
│   ├── login.js        # Tab switching on Login page
│   ├── auth.js         # Sign-up & login → POST /api/auth/*
│   └── serve.js        # Board logic, cards, enroll/delete → /api/events/*
├── Pray.css/
│   └── SS.css          # All styles (login + board + cards)
├── Data/
│   └── default-events.json  # Seed data for initial DB population
├── backend/
│   ├── .env            # PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
│   ├── package.json
│   ├── server.js       # Express entry point — cors, json, routers
│   ├── db.js           # mysql2 connection pool
│   ├── scripts/
│   │   └── init-db.js  # Creates DB, tables, seeds default events
│   └── routers/
│       ├── auth.js     # POST /api/auth/signup, POST /api/auth/login
│       └── events.js   # GET/POST /api/events, DELETE /api/events/:id,
│                       # POST /api/events/:id/enroll, POST /api/events/:id/unenroll
├── CONTEXT.md          # ← This file
└── README.md
```

## Database Schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | PK |
| username | VARCHAR(100) UNIQUE | |
| password | VARCHAR(255) | Plain text (for now) |
| created_at | TIMESTAMP | |

### `events`
| Column | Type | Notes |
|--------|------|-------|
| id | VARCHAR(50) | PK (timestamp-based) |
| title | VARCHAR(255) | |
| date | DATE | |
| category | VARCHAR(50) | setup, worship, kids, kitchen, outreach |
| capacity | INT | |
| description | TEXT | |
| created_by | VARCHAR(100) | FK-like to users.username |
| created_at | TIMESTAMP | |

### `enrollments`
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | PK |
| event_id | VARCHAR(50) | FK → events.id (CASCADE delete) |
| username | VARCHAR(100) | |
| | | UNIQUE(event_id, username) |

## API Endpoints
| Method | Path | Body | Purpose |
|--------|------|------|---------|
| POST | /api/auth/signup | { username, password } | Create account |
| POST | /api/auth/login | { username, password } | Log in, returns { username } |
| GET | /api/events | — | List all events with enrolledUsers[] |
| POST | /api/events | { title, date, category, capacity, description, createdBy } | Create event |
| DELETE | /api/events/:id | { username } | Delete event (owner only) |
| POST | /api/events/:id/enroll | { username } | Enroll in event |
| POST | /api/events/:id/unenroll | { username } | Un-enroll from event |

## How to Run
```bash
# 1. Initialize the database (first time only)
cd backend && npm run db:init

# 2. Start the API server
cd backend && npm run dev     # nodemon on port 1324

# 3. Open the app
# Open Pages/Login.html in a browser
```

## Branch Conventions
- `main` — stable, production-ready code
- `fix/*` — bug fix branches
- `feat/*` — feature branches
