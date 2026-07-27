# Full-Project

Azizam Market platform. Three services that run side by side in development.

## Services
- `backend/` -> Django API + Super Admin
- `Dashboard/` -> Next.js operator dashboard
- `Website/` -> public website

All three bind to `127.0.0.1`, and the dashboard and website reach the API
cross-origin, so the backend's `CORS_ALLOWED_ORIGINS` has to list both of their
origins. The defaults in `backend/.env.example` already do.

Start the backend first — the other two have nothing to read without it.

## Local run

### 1) Backend — http://127.0.0.1:8000
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements/base.txt
cp .env.example .env
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver
```

Defaults to SQLite at `backend/db.sqlite3`; point `DATABASE_URL` at Postgres to
switch. Check it came up:

```bash
curl http://127.0.0.1:8000/api/v1/health/
```

API layout: `/api/v1/public/` (unauthenticated reads), `/api/v1/admin/` (JWT,
what the dashboard calls), `/admin/` (Django super admin).

### 2) Dashboard — http://127.0.0.1:3000
```bash
cd Dashboard
cp .env.example .env.local
npm install
npm run dev
```
Sign in at http://127.0.0.1:3000/login with the superuser created above.

### 3) Website — http://127.0.0.1:3001
```bash
cd Website
cp .env.example .env.local
npm install
npm run dev
```

A fresh database has no site settings row yet, so `/api/v1/public/snapshot/`
returns 404 and the website falls back to its placeholder content. Fill in Site
settings, Hero, About and Footer from the dashboard to make the snapshot resolve.
