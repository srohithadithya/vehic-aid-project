#!/bin/sh
set -e

echo "========================================="
echo "VehicAid Backend Startup"
echo "========================================="
echo "Python Version: $(python --version)"

# Ensure critical packages are installed
echo "Verifying critical dependencies..."
pip install --quiet django-debug-toolbar whitenoise django-auditlog django-redis || {
    echo "ERROR: Failed to install critical packages"
    exit 1
}

# Verify key imports
python -c "import auditlog; print('✓ Auditlog imported')" || { echo "✗ Auditlog import failed"; exit 1; }
python -c "import django_redis; print('✓ Django-redis imported')" || { echo "✗ Django-redis import failed"; exit 1; }

# Wait for database
echo "Waiting for database..."
until python -c "import psycopg2; psycopg2.connect('$DATABASE_URL')" 2>/dev/null; do
    echo "Database unavailable - sleeping"
    sleep 2
done
echo "✓ Database is ready"

# Wait for Redis
echo "Waiting for Redis..."
until python -c "import redis; r=redis.from_url('$REDIS_URL'); r.ping()" 2>/dev/null; do
    echo "Redis unavailable - sleeping"
    sleep 2
done
echo "✓ Redis is ready"

# If arguments are passed, execute them instead
if [ "$#" -gt 0 ]; then
    echo "Executing command: $@"
    exec "$@"
fi

# Run migrations
echo "Applying database migrations..."
python manage.py migrate --noinput || { echo "✗ Migration failed"; exit 1; }
echo "✓ Migrations applied"

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput || { echo "✗ Static collection failed"; exit 1; }
echo "✓ Static files collected"

# Create superuser if needed (non-interactive)
echo "Checking for superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@vehicaid.com', 'admin123');
    print('✓ Superuser created: admin/admin123')
else:
    print('✓ Superuser already exists')
" || echo "Superuser check skipped"

echo "========================================="
echo "Starting Daphne ASGI Server on port 8000"
echo "========================================="
exec daphne -b 0.0.0.0 -p 8000 vehic_aid_backend.asgi:application
