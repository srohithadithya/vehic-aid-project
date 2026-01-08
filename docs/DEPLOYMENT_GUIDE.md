# Production Deployment Guide

## Overview

This guide covers deploying the Vehic-Aid backend and frontend to production environments.

---

## ⚡ Recommended Method: Docker Deployment

For the most reliable and consistent deployment, please refer to the `infrastructure/` directory and the `README.md` file (Docker Verification). This ensures all services (Django, Postgres, Redis, Celery) are orchestrated correctly.

**Quick Start with Docker:**
```bash
cd infrastructure
docker-compose -f docker-compose.verify.yml up --build -d
```

---

## Part 1: Backend Deployment (Legacy / Manual)

### 1.1 Production Environment Setup

**Create `.env.production`:**

```bash
# === DJANGO SETTINGS ===
DJANGO_SETTINGS_MODULE=vehic_aid_backend.settings.production
DEBUG=False
SECRET_KEY=<generate-strong-random-key>
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com,www.yourdomain.com

# === DATABASE ===
DATABASE_URL=postgres://user:password@db-host:5432/vehic_aid_db

# === SECURITY ===
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True

# === CORS ===
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# === CACHE & BROKER ===
CELERY_BROKER_URL=redis://redis-host:6379/0
CELERY_RESULT_BACKEND=redis://redis-host:6379/0
CHANNEL_REDIS_URL=redis://redis-host:6379/1

# === EXTERNAL APIs ===
GOOGLE_MAPS_API_KEY=<your-api-key>
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>

# === EMAIL ===
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your-email>
EMAIL_HOST_PASSWORD=<your-app-password>
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# === AWS S3 (Optional) ===
AWS_STORAGE_BUCKET_NAME=vehic-aid-prod
AWS_S3_REGION_NAME=ap-south-1
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
```

### 1.2 Production Settings

**Update `vehic_aid_backend/settings/production.py`:**

```python
from .base import *
import os

DEBUG = False

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# === SECURITY ===
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# === CORS ===
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')

# === STATIC FILES ===
STATIC_URL = 'https://<cdn-domain>/static/'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# === MEDIA FILES ===
MEDIA_URL = 'https://<cdn-domain>/media/'
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'

# === LOGGING ===
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

### 1.3 Docker Deployment

**Production Dockerfile:**

```dockerfile
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "vehic_aid_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

**Production Docker Compose:**

```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: vehic_aid_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build: .
    command: >
      sh -c "python manage.py migrate &&
             gunicorn vehic_aid_backend.wsgi:application --bind 0.0.0.0:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=vehic_aid_backend.settings.production
      - DEBUG=False
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis

  celery:
    build: .
    command: celery -A vehic_aid_backend worker -l info
    environment:
      - DJANGO_SETTINGS_MODULE=vehic_aid_backend.settings.production
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

### 1.4 Nginx Configuration

**`nginx.conf`:**

```nginx
upstream django {
    server web:8000;
}

server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com api.yourdomain.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 100M;

    location /static/ {
        alias /app/staticfiles/;
    }

    location /media/ {
        alias /app/media/;
    }

    location /api/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## Part 2: Frontend Deployment

### 2.1 Build for Production

**Create `.env.production`:**

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Build Next.js:**

```bash
cd 03_web-admin-panel/admin
npm run build
npm start
```

### 2.2 Docker for Frontend

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g next

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### 2.3 Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd 03_web-admin-panel/admin
vercel --prod

# Configure environment
vercel env add NEXT_PUBLIC_API_URL
```

---

## Part 3: CI/CD Pipeline

### 3.1 GitHub Actions

**`.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: pip install -r 01_backend/requirements.txt
      - name: Run tests
        run: cd 01_backend && pytest -v

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t vehic-aid:latest .
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker tag vehic-aid:latest ${{ secrets.DOCKER_USERNAME }}/vehic-aid:latest
          docker push ${{ secrets.DOCKER_USERNAME }}/vehic-aid:latest

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        run: |
          ssh -i ${{ secrets.DEPLOY_KEY }} ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }} \
          'cd /home/deploy/vehic-aid && docker-compose pull && docker-compose up -d'
```

---

## Part 4: Monitoring & Maintenance

### 4.1 Health Checks

```bash
# Check backend
curl https://api.yourdomain.com/admin/

# Check frontend
curl https://yourdomain.com

# Database status
pg_isready -h db-host -U db-user

# Redis status
redis-cli ping
```

### 4.2 Database Backups

**Automated backup script:**

```bash
#!/bin/bash
# backup-db.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/vehic-aid"

mkdir -p $BACKUP_DIR

pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 30 backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

**Schedule with cron:**

```bash
# Daily backup at 2 AM
0 2 * * * /home/deploy/backup-db.sh
```

### 4.3 Logging & Monitoring

**Use services like:**
- **Sentry:** Error tracking
- **NewRelic:** Performance monitoring
- **DataDog:** Infrastructure monitoring
- **ELK Stack:** Log aggregation

**Setup Sentry:**

```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="https://your-sentry-dsn@sentry.io/project-id",
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
    send_default_pii=False,
)
```

---

## Part 5: Deployment Checklist

- [ ] Generate strong `SECRET_KEY`
- [ ] Set `DEBUG = False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure email settings
- [ ] Set up error tracking (Sentry)
- [ ] Configure CDN for static files
- [ ] Set up monitoring and alerts
- [ ] Test authentication flow
- [ ] Test payment gateway integration
- [ ] Load testing with production data
- [ ] Configure logging
- [ ] Set up CI/CD pipeline
- [ ] Document deployment process
- [ ] Plan rollback strategy
- [ ] Configure uptime monitoring

---

## Part 6: Rollback Plan

### Quick Rollback

```bash
# Stop new containers
docker-compose down

# Switch to previous version
git checkout previous-tag

# Restart services
docker-compose up -d
```

### Database Rollback

```bash
# Restore from backup
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < backup_file.sql

# Migrate to specific version
python manage.py migrate services 0005
```

---

## Summary

**Production Stack:**
- Backend: Gunicorn + Nginx (not Daphne)
- Frontend: Vercel or Docker
- Database: PostgreSQL (managed service recommended)
- Cache: Redis (managed service recommended)
- SSL: Let's Encrypt (via Certbot)
- Monitoring: Sentry + DataDog

**Security:**
- ✅ SSL/TLS everywhere
- ✅ CSRF protection
- ✅ CORS restricted
- ✅ Secure cookies
- ✅ HSTS enabled
- ✅ Environment variables for secrets

**Performance:**
- ✅ CDN for static files
- ✅ Database connection pooling
- ✅ Redis caching
- ✅ Celery for async tasks
- ✅ Compression enabled

---

**Last updated:** January 6, 2026
