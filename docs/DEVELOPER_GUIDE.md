# 👨‍💻 Vehic-Aid Developer Guide

## Overview

This guide is for developers contributing to the Vehic-Aid codebases.

---

## 🛠️ Development Environment

We recommend using **Docker** for running core infrastructure (Database, Redis) while running the application code locally for faster hot-reloading if needed, or fully Dockerized for consistency.

### Option A: Full Docker Dev (Easiest)

Use the verification compose file as a baseline for development.

```powershell
cd infrastructure
docker-compose -f docker-compose.verify.yml up --build
```

### Option B: Hybrid (Local Code, Docker Infra)

1. **Start Infrastructure only:**
   ```powershell
   cd infrastructure
   docker-compose -f docker-compose.verify.yml up -d db redis
   ```

2. **Backend (Django) Setup:**
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver 8000
   ```

3. **Frontend (Next.js) Setup:**
   ```powershell
   cd web-admin-panel/admin
   npm install
   npm run dev
   ```

   *Ensure `.env.local` points to `http://localhost:8000/api/v1`*

---

## 📂 Project Structure

- `backend/`: Django REST Framework API
- `web-admin-panel/`: Next.js Admin Dashboard
- `infrastructure/`: Docker configurations
- `docs/`: Project documentation

---

## 🧪 Testing

**Run Backend Tests:**
```powershell
docker exec vehicaid_web_verify pytest
```

**Run Frontend Tests:**
```powershell
cd web-admin-panel/admin
npm test
```

---

## 🤝 Contribution Guidelines

1. Create a feature branch (`git checkout -b feature/new-feature`)
2. Commit changes (`git commit -m 'feat: add awesome feature'`)
3. Push to branch (`git push origin feature/new-feature`)
4. Open a Pull Request

---

**Last Updated:** January 6, 2026
