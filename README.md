# Full-Project

## Services
- Backend/ -> Django API + Super Admin
- Dashboard/ -> Next.js Premium Dashboard
- Website/ -> Public Website

## Local run

### 1) Backend
```bash
cd Backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements/base.txt
cp .env.example .env
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver
```

### 2) Dashboard
```bash
cd Dashboard
cp .env.example .env.local
npm install
npm run dev
```
Open: http://localhost:3000/login

### 3) Website
```bash
cd Website
cp .env.example .env.local
npm install
npm run dev
```
Open: http://localhost:3001
