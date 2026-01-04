# Free Tier Deployment Guide (No Credit Card Required)

To avoid Render's payment requirements for Blueprints, verify the following **Manual Setup** for each component.

## 1. Backend (Render Web Service)
1. Log in to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `vehic-aid-project`.
4. **Configuration**:
   - **Name**: `vehic-aid-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn vehic_aid_backend.wsgi:application`
   - **Plan**: Select **Free** (Scroll down to find it).
5. **Environment Variables** (Add these in the dashboard):
   - `PYTHON_VERSION`: `3.10.12`
   - `SECRET_KEY`: (Generate a random string)
   - `DEBUG`: `False`
   - `DATABASE_URL`: (See Database Section below)
   - `REDIS_URL`: (See Redis Section below)
   - `ALLOWED_HOSTS`: `*`

## 2. Database (Neon.tech - Postgres)
1. Go to [Neon.tech](https://neon.tech) and Sign Up (Free).
2. Create a Project named `vehic-aid`.
3. Copy the **Connection String** (e.g., `postgres://user:pass@ep-xyz.us-east-1.aws.neon.tech/neondb...`).
4. Paste this into Render's `DATABASE_URL` environment variable.

## 3. Redis (Upstash - Redis)
1. Go to [Upstash.com](https://upstash.com) and Sign Up (Free).
2. Create a Database named `vehic-aid-redis`.
3. Copy the **REST URL** or standard `redis://` connection string.
4. Paste this into Render's `REDIS_URL` and `CELERY_BROKER_URL` environment variables.

## 4. Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and Sign Up.
2. **Deploy Booker App**:
   - "Add New" -> Project -> Select Repo.
   - **Root Directory**: `web-booker`
   - Environment Variable: `NEXT_PUBLIC_API_URL` = `https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api/v1`
   - Click **Deploy**.
3. **Deploy Provider App**:
   - "Add New" -> Project -> Select Repo.
   - **Root Directory**: `web-provider`
   - Environment Variable: `NEXT_PUBLIC_API_URL` = `https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api/v1`
   - Click **Deploy**.

**Verification**:
Once deployed, verify the health check at `https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api/docs/`.
