# If Render Root Directory is 'backend', we are inside backend.
# If Render Root Directory is unset (root), we need to cd.
# Safest: Check for manage.py
if [ ! -f "manage.py" ]; then
    cd backend
fi

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
