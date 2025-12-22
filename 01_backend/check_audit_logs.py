import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from auditlog.models import LogEntry
from apps.services.models import ServiceRequest

def check_logs():
    print("--- Verifying Audit logs ---")
    logs = LogEntry.objects.all().order_by('-timestamp')[:5]
    
    if not logs:
        print("No audit logs found.")
        return

    for entry in logs:
        print(f"[{entry.timestamp}] {entry.actor or 'System'} {entry.get_action_display()} {entry.content_type} (ID: {entry.object_id})")
        if entry.changes:
            print(f"   Changes: {entry.changes}")

if __name__ == "__main__":
    check_logs()
