# scripts/ci_cd/run_tests_ci.sh
#!/bin/bash
# Executes the full Django test suite within the CI environment.

set -e

echo "Running full test suite against test database..."
# Use the testing settings module to ensure the tests use a separate, clean database instance
python manage.py test --settings=vehic_aid_backend.settings.testing

# The pipeline checks the exit code ($?) to determine pass/fail.