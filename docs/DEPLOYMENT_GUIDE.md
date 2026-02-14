# 🚀 VehicAid Deployment Guide

This guide covers the deployment of the complete VehicAid platform using Docker and Kubernetes.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Ports & Endpoints](#ports--endpoints)
3. [Docker Compose (Development)](#docker-compose-development)
4. [Kubernetes (Production)](#kubernetes-production)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## ⚡ Prerequisites

- **Docker Desktop**: 4.0+
- **Kubernetes (Minikube/EKS/GKE)**: 1.25+
- **Helm**: 3.0+
- **Git**: 2.30+
- **RAM**: 8GB+ (Recommended)

---

## 🔌 Ports & Endpoints

| Service | Internal Port | Host Port | URL |
|---------|---------------|-----------|-----|
| **Backend API** | 8000 | **8001** | http://localhost:8001/api/v1 |
| **Admin Panel** | 3000 | **3000** | http://localhost:3000 |
| **Provider App** | 3000 | **3001** | http://localhost:3001 |
| **Booker App** | 3000 | **3003** | http://localhost:3003 |
| **PostgreSQL** | 5432 | 5432 | localhost:5432 |
| **Redis** | 6379 | 6379 | localhost:6379 |
| **Prometheus** | 9090 | 9090 | http://localhost:9090 |
| **Grafana** | 3000 | 3002 | http://localhost:3002 |

---

## 🐳 Docker Compose (Development)

The easiest way to run VehicAid locally.

### 1. Launch All Services
```bash
cd vehic-aid-project
./launch.ps1
```
*Or manually:*
```bash
cd infrastructure
docker-compose up -d --build
```

### 2. Verify Services
```bash
docker-compose ps
```
You should see 8 healthy containers:
- `vehicaid_db`
- `vehicaid_redis`
- `vehicaid_backend`
- `vehicaid_celery`
- `vehicaid_celery_beat`
- `vehicaid_web_admin`
- `vehicaid_web_provider`
- `vehicaid_web_booker`

### 3. Apply Migrations & Seed Data
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python seed_data.py
```

### 4. Shut Down
```bash
docker-compose down
# For clean wipe:
docker-compose down -v
```

---

## ☸️ Kubernetes (Production)

Deploy to a scalable cluster.

### 1. Build & Push Images
```bash
# Backend
docker build -t your-registry/vehicaid-backend:latest ./backend
docker push your-registry/vehicaid-backend:latest

# Web Apps
docker build -t your-registry/vehicaid-web-admin:latest ./web/admin
docker push your-registry/vehicaid-web-admin:latest
# ... repeat for provider/booker
```

### 2. Apply Configs & Secrets
```bash
cd infrastructure/k8s
kubectl apply -f secrets.yaml
```

### 3. Deploy Database & Redis
```bash
kubectl apply -f database-deployment.yaml
```

### 4. Deploy Backend
```bash
kubectl apply -f backend-deployment.yaml
```

### 5. Deploy Web Apps
```bash
kubectl apply -f web-deployments.yaml
```

### 6. Verify Deployment
```bash
kubectl get pods
kubectl get services
```

---

## 🔐 Environment Variables

### Core Variables (`.env`)
```ini
# Backend
DEBUG=False
SECRET_KEY=production_secret_key
ALLOWED_HOSTS=api.vehicaid.com
CORS_ALLOWED_ORIGINS=https://admin.vehicaid.com,https://app.vehicaid.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis
REDIS_URL=redis://host:6379/1
CELERY_BROKER_URL=redis://host:6379/0

# External Keys
GOOGLE_MAPS_API_KEY=AIza...
RAZORPAY_KEY_ID=rzp_...
SMS_PROVIDER=textlocal
EMAIL_HOST_USER=support@vehicaid.com
fireBASE_CREDENTIALS_PATH=/secrets/firebase.json
```

### Web App Variables (`.env.local`)
```ini
NEXT_PUBLIC_API_URL=https://api.vehicaid.com/api/v1
NEXT_PUBLIC_WS_URL=wss://api.vehicaid.com/ws
```

---

## 🛠️ Troubleshooting

### 1. Backend not reachable on 8001
- Check if port 8001 is already in use.
- Ensure `docker-compose` mapped paths correctly: `8001:8000`.
- Logs: `docker-compose logs -f backend`

### 2. "Module not found" errors
- Rebuild containers: `docker-compose up -d --build`
- Check `requirements.txt` consistency.

### 3. Database connection failure
- Ensure Postgres container is healthy.
- Check `DATABASE_URL` in `.env`.
- Wait for DB to initialize (up to 30s on first run).

### 4. WebSocket connection failed
- Ensure `daphne` or `uvicorn` is running (default in Dockerfile).
- Check Redis connection for Channel layers.

---

**Last Updated**: February 14, 2026  
**Version**: 2.6.0
