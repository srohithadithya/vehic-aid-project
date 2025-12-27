from django.urls import path
from . import views

app_name = 'web_admin'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('subscriptions/', views.subscriptions_view, name='subscriptions'),
    path('requests/', views.service_requests_view, name='service_requests'),
    path('wallet/', views.wallet_transactions_view, name='wallet_transactions'),
    path('rewards/', views.rewards_view, name='rewards'),
    path('providers/', views.providers_view, name='providers'),
    path('providers/', views.providers_view, name='providers'),
    path('reviews/', views.reviews_view, name='reviews'),
    path('helpline/', views.helpline_view, name='helpline'),
]
