# Chika Blog

A custom blog hosting website with React frontend and FastAPI backend.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router
- **Backend**: FastAPI + SQLAlchemy + Alembic
- **Database**: PostgreSQL
- **Auth**: JWT-based single admin user
- **Media**: Local file storage

## Prerequisites

- Docker and Docker Compose
- Python 3.11+
- Node.js 18+

## Getting Started

### 1. Start the Database

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5433 (to avoid conflicts with local PostgreSQL).

### 2. Set Up the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and configure
cp .env.example .env

# Run database migrations
alembic upgrade head

# Create an admin user
python create_admin.py

# Start the development server
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

API documentation: http://localhost:8000/docs

### 3. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:5173

## Project Structure

```
chika-blob/
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   ├── alembic/      # Database migrations
│   └── uploads/      # Media storage
├── frontend/         # React frontend
│   └── src/          # Source code
└── docker-compose.yml
```

## Development

### Backend

- API runs on port 8000 with auto-reload
- Swagger docs at `/docs`
- ReDoc at `/redoc`

### Frontend

- Vite dev server on port 5173 with HMR
- Proxies API requests to backend

## Environment Variables

See `.env.example` files in both `backend/` and `frontend/` directories.
