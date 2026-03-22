# django_api/urls.py
# ============================================================
# Milkman – URL Configuration
# ============================================================
#
# Endpoint map
# ────────────────────────────────────────────────────────────
#  PUBLIC
#    GET  /api/products/                    → product catalogue
#
#  CUSTOMER AUTH
#    POST /api/customers/register/          → create account
#    POST /api/customers/login/             → obtain token
#    GET  /api/customers/me/                → own profile
#    PATCH /api/customers/me/               → update own profile
#
#  SUBSCRIPTIONS  (authenticated)
#    GET  /api/subscriptions/               → list own subs
#    POST /api/subscriptions/               → subscribe (1 month)
#    GET  /api/subscriptions/{id}/          → sub detail
#    GET  /api/subscriptions/active/        → current active sub
#
#  ADMIN  (is_staff only)
#    GET    /api/admin/customers/           → all customers
#    GET    /api/admin/customers/{id}/      → customer detail
#    PATCH  /api/admin/customers/{id}/      → update customer
#    DELETE /api/admin/customers/{id}/      → delete customer
#    POST   /api/admin/customers/{id}/grant-admin/  → promote to admin
#    GET    /api/admin/subscriptions/       → all subscriptions
#    POST   /api/admin/subscriptions/       → manually add subscription
#    GET    /api/admin/products/            → all products (admin)
#    POST   /api/admin/products/            → add product
#    PUT    /api/admin/products/{id}/       → update product
#    DELETE /api/admin/products/{id}/       → remove product
# ────────────────────────────────────────────────────────────

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import (
    # Customer
    RegisterView,
    LoginView,
    CustomerDetailView,
    # Subscriptions
    SubscriptionViewSet,
    # Admin
    AdminCustomerListView,
    AdminCustomerDetailView,
    AdminGrantStaffView,
    AdminSubscriptionListCreateView,
    AdminProductViewSet,
    # Public
    PublicProductListView,
)

# ── Routers (handle list / detail / custom actions automatically) ──

subscription_router = DefaultRouter()
subscription_router.register(r"subscriptions", SubscriptionViewSet, basename="subscription")

admin_product_router = DefaultRouter()
admin_product_router.register(r"products", AdminProductViewSet, basename="admin-product")

# ── URL patterns ──────────────────────────────────────────────────

urlpatterns = [
    # ── Public ────────────────────────────────────────────────────
    path("api/products/", PublicProductListView.as_view(), name="public-products"),

    # ── Customer auth & profile ───────────────────────────────────
    path("api/customers/register/", RegisterView.as_view(),       name="customer-register"),
    path("api/customers/login/",    LoginView.as_view(),          name="customer-login"),
    path("api/customers/me/",       CustomerDetailView.as_view(), name="customer-me"),

    # ── Subscriptions (router handles /api/subscriptions/ + /api/subscriptions/{id}/) ─
    path("api/", include(subscription_router.urls)),

    # ── Admin ──────────────────────────────────────────────────────
    path("api/admin/customers/",
         AdminCustomerListView.as_view(),          name="admin-customers"),
    path("api/admin/customers/<int:pk>/",
         AdminCustomerDetailView.as_view(),        name="admin-customer-detail"),
    path("api/admin/customers/<int:pk>/grant-admin/",
         AdminGrantStaffView.as_view(),            name="admin-grant-staff"),
    path("api/admin/subscriptions/",
         AdminSubscriptionListCreateView.as_view(), name="admin-subscriptions"),

    # Admin product CRUD (router)
    path("api/admin/", include(admin_product_router.urls)),
]
