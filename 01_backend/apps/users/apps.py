from django.apps import AppConfig


class UsersConfig(AppConfig):
    # Sets BigAutoField as the default primary key (solves W042 warnings)
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.users"
    label = "users"
