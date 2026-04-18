# 🚀 VehicAid Production Deployment Guide (Free Tier)

This guide outlines the **preferred and best** way to deploy the entire VehicAid stack for free using a modern hybrid-cloud architecture.

---

## 🏗️ 1. Infrastructure Setup (External Services)

Before deploying the code, you need to set up the "backbone" services.

### A. Database (PostgreSQL)
*   **Service**: [Neon.tech](https://neon.tech)
*   **Action**: Create a free project. Copy the **Connection String** (it starts with `postgres://...`).
*   **Key**: Use this for `DATABASE_URL`.

### B. Redis (Broker & Cache)
*   **Service**: [Upstash](https://upstash.com)
*   **Action**: Create a free Redis database. Copy the **Redis URL** (it starts with `redis://...`).
*   **Key**: Use this for `REDIS_URL` and `CELERY_BROKER_URL`.

---

## 💻 2. Frontend Deployment (The Fast Way)

Deploy each of the 3 web portals to **Vercel**.

1.  Push your code to **GitHub**.
2.  Go to [Vercel](https://vercel.com) and "Add New Project".
3.  For **Booker**:
    *   Root Directory: `web/booker`
    *   Framework: `Next.js`
    *   Environment Variable: `NEXT_PUBLIC_API_URL` = (Your Render Backend URL)/api/v1
4.  Repeat for **Provider** (`web/provider`) and **Admin** (`web/admin`).

---

## ⚙️ 3. Backend Deployment (Render Free Tier)

Since Render's free tier only allows one web service, we are currently deploying only the API layer. Background processing for email or heavy tasks requires a paid worker.

1.  Connect your repo to [Render](https://render.com).
2.  Create a **Web Service**.
3.  Root Directory: `backend`
4.  Environment Variables:
    *   `DJANGO_SETTINGS_MODULE`: `vehic_aid_backend.settings.production`
    *   `DATABASE_URL`: (Your Neon URL)
    *   `REDIS_URL`: (Your Upstash URL)
    *   `SECRET_KEY`: (A random long string)
    *   `ALLOWED_HOSTS`: `*.onrender.com`

---

## 🛠️ 4. Local File Preparation (I am doing this for you now)

To make the above possible, I am creating/modifying these files:

1.  **`backend/Dockerfile`**: A production-ready Dockerfile.
2.  **`backend/build.sh`**: A script to run migrations and collect static files automatically on deploy.

---

### ✅ Deployment Checklist
- [ ] Neon DB created?
- [ ] Upstash Redis created?
- [ ] GitHub Repository pushed?
- [ ] Vercel projects linked?
- [ ] Render project linked?

**Your project is now being prepped for this workflow!**
