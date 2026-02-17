# Chika Blog

A bilingual (English/Japanese) personal blog platform built with React and FastAPI. Features a rich text editor, media library, view tracking, and one-command deployment to DigitalOcean.

## Tech Stack

- **Frontend**: React 18 + Vite 5 + Tailwind CSS + React Router 6 + Tiptap rich text editor
- **Backend**: FastAPI + SQLAlchemy 2 + Alembic + Pydantic v2
- **Database**: PostgreSQL 15
- **Auth**: JWT-based single admin user
- **Media**: File uploads stored in a Docker volume
- **Deployment**: Docker Compose + Nginx + Let's Encrypt SSL

## Features

- **Bilingual posts** — each post supports English and Japanese titles, content, and excerpts with a language toggle
- **Rich text editor** — Tiptap WYSIWYG with headings, lists, blockquotes, code blocks, links, and inline image insertion from the media library
- **Media library** — upload, browse, and manage images; insert directly into posts or set as featured image
- **View tracking** — records page views per post with unique visitor counts in the admin dashboard
- **Categories** — organize and filter posts by category
- **Draft/Published workflow** — posts can be saved as drafts before publishing
- **HTML sanitization** — server-side (bleach) and client-side (DOMPurify)
- **Bio page** — static bilingual bio with a horizontal scrolling image carousel

## Prerequisites

- Docker and Docker Compose
- Python 3.12+
- Node.js 18+

## Quick Start (Local Development)

The fastest way to get everything running:

```bash
# Start the database
./setup-db.sh

# Start backend and frontend in parallel
./dev.sh
```

This will set up the virtual environment, install dependencies, run migrations, seed the admin user, and start both servers. Press Ctrl-C to stop.

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### Manual Setup

#### 1. Database

```bash
./setup-db.sh
```

This creates the PostgreSQL role and database, runs Alembic migrations, and seeds the admin user. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables beforehand, or edit `.env`.

#### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # edit as needed
alembic upgrade head
python create_admin.py  # interactive admin user creation
uvicorn app.main:app --reload
```

#### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Deployment

Target environment: DigitalOcean Droplet. Three scripts handle the full lifecycle:

### 1. Provision the droplet

```bash
./setup-droplet.sh
```

Installs Docker, creates the app directory, and configures the firewall (ports 22, 80, 443).

### 2. Deploy

```bash
./deploy.sh
```

Syncs files to the droplet via rsync, generates secrets on first deploy, and runs `docker compose up --build -d`. The Docker Compose setup runs four services: PostgreSQL, backend (with auto-migrations and admin seeding), Nginx (serves the frontend SPA and proxies `/api` and `/uploads`), and Certbot.

### 3. Enable SSL

```bash
./init-ssl.sh
```

Run once after DNS is configured. Obtains a Let's Encrypt certificate and switches Nginx to the SSL configuration.

## Project Structure

```
chika-blob/
├── backend/              # FastAPI backend
│   ├── app/              # Application code
│   │   ├── models/       # SQLAlchemy models (user, post, category, media, post_view)
│   │   ├── routers/      # API route handlers
│   │   └── main.py       # App entrypoint
│   ├── alembic/          # Database migrations
│   ├── uploads/          # Media storage (Docker volume in production)
│   ├── seed.py           # Auto-seeds admin user on container startup
│   └── create_admin.py   # Interactive admin creation for local dev
├── frontend/             # React frontend
│   └── src/
│       ├── components/   # Shared components (Header, Footer, PostCard, etc.)
│       ├── pages/        # Public pages (Home, PostPage, CategoryPage, Bio)
│       └── admin/        # Admin pages (Dashboard, PostsManager, MediaLibrary)
├── nginx/                # Nginx configuration (HTTP and SSL)
├── dev.sh                # One-command local dev startup
├── setup-db.sh           # Local database setup
├── deploy.sh             # Deploy to DigitalOcean
├── setup-droplet.sh      # Provision a new droplet
├── init-ssl.sh           # Set up Let's Encrypt SSL
├── start-backend.sh      # Start backend only
├── start-frontend.sh     # Start frontend only
└── docker-compose.yml    # Full-stack Docker services
```

## Environment Variables

Three `.env.example` files are provided:

- **Root** — deployment config: `DROPLET_IP`, `DOMAIN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `POSTGRES_PASSWORD`, `SECRET_KEY`
- **`backend/`** — local dev: `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`, `UPLOAD_DIR`
- **`frontend/`** — API URL: `VITE_API_URL`

## API Routes

| Endpoint | Auth | Description |
|---|---|---|
| `GET /api/posts` | Public | Paginated published posts |
| `GET /api/posts/{slug}` | Public | Single published post |
| `POST /api/posts/{slug}/view` | Public | Track a page view |
| `GET /api/categories` | Public | List categories |
| `GET /api/categories/{slug}/posts` | Public | Posts in a category |
| `POST /api/auth/login` | Public | Login, returns JWT |
| `GET /api/auth/me` | Admin | Current user info |
| `GET /api/admin/posts` | Admin | All posts with view counts |
| `POST /api/admin/posts` | Admin | Create post |
| `PUT /api/admin/posts/{id}` | Admin | Update post |
| `DELETE /api/admin/posts/{id}` | Admin | Delete post |
| `GET /api/admin/media` | Admin | List uploaded media |
| `POST /api/admin/media/upload` | Admin | Upload a file |
| `DELETE /api/admin/media/{id}` | Admin | Delete a file |
| `POST /api/admin/categories` | Admin | Create category |
| `PUT /api/admin/categories/{id}` | Admin | Update category |
| `DELETE /api/admin/categories/{id}` | Admin | Delete category |
