#!/bin/sh
set -e

echo "Starting deployment entrypoint..."
echo "Python Version: $(python --version)"

# Diagnostic: List installed packages
echo "Ensuring critical packages are installed..."
# Unconditionally install to fix missing dependency issues (pip will skip if already present)
pip install django-debug-toolbar whitenoise django-auditlog
# Verify installation
python -c "import auditlog; print('Auditlog successfully imported')" || { echo "Failed to import auditlog"; exit 1; }
pip list

# Wait for DB to be ready (rudimentary check or rely on docker depends_on)
# We assume depends_on is working, but a sleep is sometimes safer for race conditions
echo "Waiting 5s for DB..."
sleep 5

# If arguments are passed to the script, execute them
if [ "$#" -gt 0 ]; then
    echo "Executing command: $@"
    exec "$@"
fi

echo "Creating new migrations (if any)..."
python manage.py makemigrations --noinput || echo "Make migrations validation failed/skipped"

echo "Applying migrations..."
python manage.py showmigrations || echo "Failed to show migrations"
python manage.py migrate --noinput || { echo "Migration failed"; exit 1; }

echo "Collecting static files..."
python manage.py collectstatic --noinput || { echo "Static collection failed"; exit 1; }

echo "Checking for valid settings module..."
if [ -z "$DJANGO_SETTINGS_MODULE" ]; then
    echo "WARNING: DJANGO_SETTINGS_MODULE not set, defaulting to 'vehic_aid_backend.settings.production' via asgi.py"
else
    echo "Using settings: $DJANGO_SETTINGS_MODULE"
fi

echo "Starting Daphne server..."
exec daphne -b 0.0.0.0 -p 8000 vehic_aid_backend.asgi:application
