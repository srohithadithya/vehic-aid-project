from django.urls import path

from .views import RazorpayWebhookView, PaymentInitiationView, MockPaymentConfirmView

urlpatterns = [
    # Primary webhook for payment confirmation (No user auth needed here)
    path("webhook/razorpay/", RazorpayWebhookView.as_view(), name="razorpay-webhook"),
    # Endpoint used by the mobile app/web app to create a new order ID
    path('create-order/', PaymentInitiationView.as_view(), name='create-order'),
    # Mock confirmation for testing
    path('confirm/', MockPaymentConfirmView.as_view(), name='mock-payment-confirm'),
]
