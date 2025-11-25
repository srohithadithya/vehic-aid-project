from django.urls import path

from .views import RazorpayWebhookView

# from .views import PaymentInitiationView # Endpoint to start a new payment on mobile app

urlpatterns = [
    # Primary webhook for payment confirmation (No user auth needed here)
    path("webhook/razorpay/", RazorpayWebhookView.as_view(), name="razorpay-webhook"),
    # Placeholder for the API endpoint used by the mobile app to create a new order ID
    # path('create-order/', PaymentInitiationView.as_view(), name='create-order'),
]
