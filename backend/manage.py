import os
import sys


def main():
    """Run administrative tasks."""

    # ----------------------------------------------------
    # NEW FIX: Add the current directory to the Python path
    # This allows Django to find 'vehic_aid_backend'
    # ----------------------------------------------------
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))

    os.environ.setdefault(
        "DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development"
    )

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
