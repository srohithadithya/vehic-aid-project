# scripts/ops/reset_local_db.sh
#!/bin/bash
# Utility to completely wipe the local database and re-apply migrations.
# Requires Docker and the .env.dev file to be set up.

DB_CONTAINER="vehicaid_postgres"
DB_NAME="vehicaid_db"
DB_USER="dev_user"

echo "--- WARNING: STARTING LOCAL DATABASE RESET ---"
echo "This will DROP the database and DELETE all data."
read -p "Press Enter to continue or Ctrl+C to cancel..."

# 1. Drop the corrupted database instance
echo "1. Forcing DROP of existing database: ${DB_NAME}"
docker exec -it ${DB_CONTAINER} psql -U ${DB_USER} -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME} WITH (FORCE);"

# 2. Create the clean database instance
echo "2. Creating fresh database: ${DB_NAME}"
docker exec -it ${DB_CONTAINER} psql -U ${DB_USER} -d postgres -c "CREATE DATABASE ${DB_NAME};"

# 3. Apply Python commands from the host machine
echo "3. Applying Django migrations (Creating all tables)..."

# Ensure custom apps are migrated first to handle AUTH_USER_MODEL dependency
python manage.py migrate users

# Apply all remaining migrations
python manage.py migrate

# 4. Create initial admin account
echo "4. Creating initial superuser (admin account)..."
python manage.py createsuperuser --no-input --username admin --email admin@vehicaid.com || true

echo "--- DATABASE RESET COMPLETE ---"
echo "You can now run 'python manage.py runserver' or 'daphne' to start."