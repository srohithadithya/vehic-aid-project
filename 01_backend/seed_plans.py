import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vehic_aid_backend.settings.development")
django.setup()

from apps.services.models import SubscriptionPlan

def seed_plans():
    plans = [
        {
            "name": "FREE",
            "price": 0.00,
            "duration_days": 3650,  # Effectively indefinite
            "is_exchange_eligible": False,
            "description": "Basic on-demand service access. Pay per use.",
            "features": ["On-demand roadside assistance", "Pay-per-use pricing"],
            "max_requests_per_month": 1, # Limited for free tier
        },
        {
            "name": "STANDARD",
            "price": 499.00,
            "duration_days": 30,
            "is_exchange_eligible": False,
            "description": "Standard monthly subscription with discounted rates.",
            "features": ["Priority dispatch", "Discounted service rates", "5 requests/month"],
            "max_requests_per_month": 5,
        },
        {
            "name": "PREMIUM",
            "price": 999.00,
            "duration_days": 30,
            "is_exchange_eligible": True,
            "description": "All-inclusive premium plan with vehicle exchange.",
            "features": ["24/7 Helpline", "Vehicle Exchange", "Unlimited requests", "Top priority"],
            "max_requests_per_month": 0, # Unlimited
        },
    ]

    for plan_data in plans:
        plan, created = SubscriptionPlan.objects.get_or_create(
            name=plan_data["name"],
            defaults=plan_data
        )
        if created:
            print(f"Created plan: {plan.name}")
        else:
            print(f"Plan already exists: {plan.name}")

if __name__ == "__main__":
    seed_plans()
