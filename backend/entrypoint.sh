#!/bin/sh
set -e

echo "🚀 Starting VehicAid Backend Entrypoint (Python 3.12)..."

# Define connection parameters
# Cloud deployment: Skip netcat checks as they require complex URL parsing for DATABASE_URL
# and managed services are high-availability.
echo "🚀 Starting VehicAid Backend..."

# Diagnostic: Check if django_redis is available
echo "🔍 Checking for django_redis module..."
if python -c "import django_redis" 2>/dev/null; then
    echo "✅ django_redis is available."
else
    echo "⚠️ django_redis NOT FOUND! (It should have been installed during build)"
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
