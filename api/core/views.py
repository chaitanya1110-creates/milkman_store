# django_api/views.py
# ============================================================
# Milkman – DRF ViewSets & API Views
# ============================================================
#
# Three API surfaces:
#   1. /api/customers/  – registration, login, profile
#   2. /api/subscriptions/ – create & track subscriptions
#   3. /api/admin/      – admin-only management endpoints
# ============================================================

from datetime import timedelta

from django.contrib.auth import authenticate
from django.utils import timezone

from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Customer, Subscription, Product
from .serializers import (
    CustomerSerializer,
    CustomerDetailSerializer,
    SubscriptionSerializer,
    ProductSerializer,
    LoginSerializer,
    AdminUpdateCustomerSerializer,
)


# ══════════════════════════════════════════════════════════════
#  HELPER PERMISSIONS
# ══════════════════════════════════════════════════════════════

class IsAdminStaff(permissions.BasePermission):
    """Only allow requests from customers with is_staff=True."""

    message = "Admin access required."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )


# ══════════════════════════════════════════════════════════════
#  1. CUSTOMERS API
# ══════════════════════════════════════════════════════════════

class RegisterView(generics.CreateAPIView):
    """
    POST /api/customers/register/
    --------------------------------
    Public endpoint. Creates a new Customer account.

    Request body:
        { "name": "...", "email": "...", "password": "...", "phone": "..." }

    Response 201:
        { "customer": {...}, "token": "abc123..." }
    """

    serializer_class   = CustomerSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = serializer.save()
        token, _ = Token.objects.get_or_create(user=customer)
        return Response(
            {
                "message" : "Account created successfully.",
                "customer": CustomerDetailSerializer(customer).data,
                "token"   : token.key,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(generics.GenericAPIView):
    """
    POST /api/customers/login/
    ---------------------------
    Authenticates a customer and returns an auth token.

    Request body:
        { "email": "...", "password": "..." }

    Response 200:
        { "customer": {...}, "token": "abc123..." }
    """

    serializer_class   = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email    = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        customer = authenticate(request, username=email, password=password)
        if customer is None:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(user=customer)
        return Response(
            {
                "message" : "Login successful.",
                "customer": CustomerDetailSerializer(customer).data,
                "token"   : token.key,
            }
        )


class CustomerDetailView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/customers/me/   – fetch own profile
    PATCH /api/customers/me/  – update own profile (name, phone, payment_info)
    """

    serializer_class   = CustomerDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ══════════════════════════════════════════════════════════════
#  2. SUBSCRIPTIONS API
# ══════════════════════════════════════════════════════════════

class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    /api/subscriptions/
    --------------------
    list   → GET  /api/subscriptions/        (own subscriptions)
    create → POST /api/subscriptions/        (subscribe for 1 month)
    detail → GET  /api/subscriptions/{id}/   (subscription details)

    Business rule: end_date is always start_date + 30 days.
    """

    serializer_class   = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Customers only see their own subscriptions; admins see all."""
        user = self.request.user
        if user.is_staff:
            return Subscription.objects.select_related("customer").all()
        return Subscription.objects.filter(customer=user)

    def perform_create(self, serializer):
        start = serializer.validated_data.get("start_date", timezone.now().date())
        serializer.save(
            customer   = self.request.user,
            start_date = start,
            end_date   = start + timedelta(days=30),
        )

    @action(detail=False, methods=["get"], url_path="active")
    def active(self, request):
        """GET /api/subscriptions/active/ – returns the customer's active subscription if any."""
        today = timezone.now().date()
        sub   = (
            self.get_queryset()
            .filter(customer=request.user, end_date__gte=today)
            .first()
        )
        if sub is None:
            return Response({"active": False, "subscription": None})
        return Response({"active": True, "subscription": SubscriptionSerializer(sub).data})


# ══════════════════════════════════════════════════════════════
#  3. ADMIN API
# ══════════════════════════════════════════════════════════════

class AdminCustomerListView(generics.ListAPIView):
    """
    GET /api/admin/customers/
    --------------------------
    Returns all customers. Admin only.
    Supports ?search=<email_or_name> query param.
    """

    serializer_class   = CustomerDetailSerializer
    permission_classes = [IsAdminStaff]

    def get_queryset(self):
        qs     = Customer.objects.prefetch_related("subscriptions").all()
        search = self.request.query_params.get("search", "").strip()
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(email__icontains=search)
        return qs


class AdminCustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/customers/{id}/   – fetch customer
    PATCH  /api/admin/customers/{id}/   – update email / password / subscription flag
    DELETE /api/admin/customers/{id}/   – remove customer
    """

    serializer_class   = AdminUpdateCustomerSerializer
    permission_classes = [IsAdminStaff]
    queryset           = Customer.objects.all()


class AdminGrantStaffView(generics.GenericAPIView):
    """
    POST /api/admin/customers/{id}/grant-admin/
    --------------------------------------------
    Grants is_staff=True to the specified customer (promotes to admin).
    """

    permission_classes = [IsAdminStaff]

    def post(self, request, pk, *args, **kwargs):
        try:
            target = Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

        target.is_staff = True
        target.save(update_fields=["is_staff"])
        return Response(
            {"message": f"{target.email} has been granted admin privileges."}
        )


class AdminSubscriptionListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/admin/subscriptions/  – all subscriptions
    POST /api/admin/subscriptions/  – manually add a subscription for any customer
    """

    serializer_class   = SubscriptionSerializer
    permission_classes = [IsAdminStaff]
    queryset           = Subscription.objects.select_related("customer").all()

    def perform_create(self, serializer):
        start = serializer.validated_data.get("start_date", timezone.now().date())
        serializer.save(
            start_date = start,
            end_date   = start + timedelta(days=30),
        )


class AdminProductViewSet(viewsets.ModelViewSet):
    """
    /api/admin/products/   – full CRUD on products (admin only).
    /api/products/         – read-only product list for the storefront.
    """

    serializer_class   = ProductSerializer
    permission_classes = [IsAdminStaff]
    queryset           = Product.objects.all()


# ─────────────────────────────────────────────
#  Public (unauthenticated) product list
# ─────────────────────────────────────────────

class PublicProductListView(generics.ListAPIView):
    """
    GET /api/products/
    -------------------
    Returns all available products. No authentication required.
    The storefront uses this to render the product catalogue.
    """

    serializer_class   = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Product.objects.filter(is_available=True)
