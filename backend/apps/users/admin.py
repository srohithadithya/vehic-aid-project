from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser, ServiceBooker, ServiceProvider

# --- Customizing the Base User Model in Admin ---


class CustomUserAdmin(UserAdmin):
    """Customizes the standard Django UserAdmin for CustomUser."""

    list_display = (
        "username",
        "email",
        "phone_number",
        "is_service_booker",
        "is_service_provider",
        "is_staff",
    )
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Personal info",
            {"fields": ("first_name", "last_name", "email", "phone_number")},
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("User Types", {"fields": ("is_service_booker", "is_service_provider")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    search_fields = ("username", "email", "phone_number")


# --- Inline Admin for Profile Linking ---


class ServiceBookerInline(admin.StackedInline):
    """Allows managing Service Booker profile details directly from the User page."""

    model = ServiceBooker
    can_delete = False
    verbose_name_plural = "Service Booker Profile"


class ServiceProviderAdmin(admin.ModelAdmin):
    """
    Custom admin view for Service Providers, prioritizing verification and payouts.
    This is the crucial screen for the Admin team.
    """

    list_display = (
        "user_full_name",
        "user_email",
        "is_verified",
        "is_available",
        "average_rating",
        "jobs_completed",
        "display_service_types",
    )
    list_filter = ("is_verified", "is_available", "service_types")
    search_fields = ("user__username", "user__first_name", "user__email")
    ordering = ("-is_verified", "user__date_joined")

    fieldsets = (
        (
            "Verification & Status",
            {
                "fields": ("user", "is_verified", "is_available"),
                "description": "Admin must toggle 'Is Verified' after checking all documents (KYC, License, etc.).",
            },
        ),
        (
            "Payout & Banking Details",
            {
                "fields": ("bank_account_number", "bank_ifsc_code"),
                "description": "Details used for automatic daily settlements (PMLA/KYC Compliance).",
            },
        ),
        (
            "Operational Data",
            {
                "fields": (
                    "service_types",
                    "latitude",
                    "longitude",
                    "average_rating",
                    "jobs_completed",
                ),
            },
        ),
    )

    def user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    user_full_name.short_description = "Name"

    def user_email(self, obj):
        return obj.user.email

    user_email.short_description = "Email"

    def display_service_types(self, obj):
        return ", ".join(obj.service_types)

    display_service_types.short_description = "Services"


# --- Registration ---

# Register the main CustomUser model with the customized admin class
admin.site.register(CustomUser, CustomUserAdmin)
# Register the Provider profile model
admin.site.register(ServiceProvider, ServiceProviderAdmin)

# The ServiceBooker model is often managed implicitly or via Inline,
# but for simplicity and direct access, we register the profile model separately if needed.
# admin.site.register(ServiceBooker)
