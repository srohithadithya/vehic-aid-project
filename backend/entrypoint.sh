#!/bin/sh
set -e

echo "🚀 Starting VehicAid Backend Entrypoint (Python 3.12)..."

# Define connection parameters
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
REDIS_HOST=${REDIS_HOST:-redis}
REDIS_PORT=${REDIS_PORT:-6379}

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 2
done
echo "✅ PostgreSQL is up!"

# Wait for Redis
echo "⏳ Waiting for Redis at $REDIS_HOST:$REDIS_PORT..."
while ! nc -z $REDIS_HOST $REDIS_PORT; do
  sleep 2
done
echo "✅ Redis is up!"

# Diagnostic: Check if django_redis is available
echo "🔍 Checking for django_redis module..."
if python -c "import django_redis" 2>/dev/null; then
    echo "✅ django_redis is available."
else
    echo "❌ django_redis NOT FOUND! Attempting re-install..."
    pip install django-redis==5.4.0
fi

# Run migrations
echo "🔄 Running migrations..."
python manage.py migrate --noinput --fake-initial

# Collect static files
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if it doesn't exist
echo "👤 Ensuring admin superuser exists..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
import os
User = get_user_model()
username = 'admin'
email = 'admin@vehicaid.com'
password = 'admin123'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f'✅ Superuser created: {username} / {password}')
else:
    print(f'ℹ️ Superuser "{username}" already exists')
EOF

echo "✨ Backend initialization complete!"

# Execute the main command
echo "🎬 Executing command: $@"
exec "$@"
