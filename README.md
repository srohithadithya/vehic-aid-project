# Vehic-Aid Platform

Complete vehicle assistance platform with backend, mobile apps, and web applications.

## Project Structure

```
vehic-aid-project/
├── 01_backend/              # Django backend API
├── 02_mobile-apps/          # React Native mobile apps
│   ├── ServiceBookerApp/    # Customer app
│   └── ServiceProviderApp/  # Provider app
├── 04(a)_infrastructure/    # AWS deployment configs
├── 04(b)_scripts/           # CI/CD and ops scripts
├── 04(c)_tests/             # Test suites
├── web-admin-panel/         # Web applications (Next.js)
│   ├── admin/               # Admin dashboard
│   └── customer/            # Customer web app
└── docs/                    # Documentation
```

## Quick Start

### Backend
```bash
cd 01_backend
docker-compose up -d
```
- API: http://localhost:8000
- Admin: http://localhost:8000/admin/ (admin/admin123)

### Mobile Apps
```bash
cd 02_mobile-apps/ServiceBookerApp
npm install && npm start
npm run android  # or npm run ios
```

### Web Admin Panel
```bash
cd web-admin-panel/admin
npm install && npm run dev
```

## Tech Stack

- **Backend:** Django 4.2 + Channels (WebSockets)
- **Mobile:** React Native 0.82.1
- **Web:** Next.js 14 + Tailwind CSS
- **Database:** PostgreSQL
- **Cache:** Redis

## Documentation

See `/docs` folder for detailed documentation.
