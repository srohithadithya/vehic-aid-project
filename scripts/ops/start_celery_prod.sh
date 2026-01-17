# scripts/ops/start_celery_prod.sh
#!/bin/bash
# Script to start all necessary background services for the Production environment.

# Exit immediately if a command exits with a non-zero status
set -e

# --- Configuration ---
LOG_LEVEL="INFO"
CELERY_APP="vehic_aid_backend"

echo "Starting Vehic-Aid Production Background Services..."

# 1. Start Celery Worker
# -P gevent/eventlet for higher concurrency on cloud infrastructure
# -c 4 sets concurrency (adjust based on CPU cores)
echo "Starting Celery Worker..."
celery -A ${CELERY_APP} worker -l ${LOG_LEVEL} -P gevent -c 4 & 

# 2. Start Celery Beat Scheduler (Must be a single instance for scheduled tasks)
# The pidfile is necessary to ensure only one instance runs
echo "Starting Celery Beat Scheduler..."
celery -A ${CELERY_APP} beat -l ${LOG_LEVEL} --pidfile=/var/run/celerybeat.pid &

# 3. Keep the script running to monitor background processes
# 'wait' command prevents the script from exiting, allowing the background processes to run
wait