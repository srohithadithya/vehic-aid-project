import os
import django
from django.db import connection

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

with connection.cursor() as cursor:
    # List all tables
    cursor.execute("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';")
    tables = cursor.fetchall()
    print("TABLES:")
    for t in tables:
        print(f" - {t[0]}")
    
    # List triggers
    cursor.execute("SELECT tgname FROM pg_trigger;")
    triggers = cursor.fetchall()
    print("\nTRIGGERS:")
    for tr in triggers:
        if not tr[0].startswith("RI_ConstraintTrigger"): # Skip internal ones
            print(f" - {tr[0]}")
