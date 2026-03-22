# django_api/models.py
# ============================================================
# Milkman – Django ORM Models
# Database: SQLite (default Django backend)
# ============================================================

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid


# ─────────────────────────────────────────────
#  Custom User / Customer Manager
# ─────────────────────────────────────────────
class CustomerManager(BaseUserManager):
    """Manager that lets us create customers using email instead of username."""

    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("An email address is required.")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)          # bcrypt-hashed via Django
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, name, password, **extra_fields)


# ─────────────────────────────────────────────
#  Customer (replaces default User)
# ─────────────────────────────────────────────
class Customer(AbstractBaseUser, PermissionsMixin):
    """
    Core customer model.

    Fields
    ------
    name          : Full display name.
    email         : Unique login identifier.
    phone         : Optional contact number.
    is_subscribed : True when the customer has an active monthly subscription.
    payment_info  : Stores masked / tokenised payment data as JSON text.
                    ⚠️  Never store raw card numbers in production –
                        use a payment gateway token (Stripe, Razorpay, etc.).
    is_staff      : Grants Django admin / admin-API access.
    created_at    : Auto-set on first save.
    """

    name           = models.CharField(max_length=150)
    email          = models.EmailField(unique=True)
    phone          = models.CharField(max_length=20, blank=True, null=True)
    is_subscribed  = models.BooleanField(default=False)
    payment_info   = models.JSONField(blank=True, null=True,
                                      help_text="Tokenised payment reference – no raw card data.")
    is_staff       = models.BooleanField(default=False)
    is_active      = models.BooleanField(default=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    objects = CustomerManager()

    # Use email as the login field
    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        db_table    = "milkman_customer"
        ordering    = ["-created_at"]
        verbose_name        = "Customer"
        verbose_name_plural = "Customers"

    def __str__(self):
        return f"{self.name} <{self.email}>"

    @property
    def has_active_subscription(self):
        """Convenience: checks whether a non-expired subscription exists."""
        from django.utils import timezone
        return self.subscriptions.filter(end_date__gte=timezone.now().date()).exists()


# ─────────────────────────────────────────────
#  Subscription
# ─────────────────────────────────────────────
class Subscription(models.Model):
    """
    Represents one month of daily dairy delivery for a customer.

    Business rules
    --------------
    • Duration is always exactly 30 days (one calendar month).
    • end_date is auto-calculated from start_date if omitted.
    • subscription_id is a UUID so it can double as an order reference.
    """

    subscription_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Public-facing order / subscription reference (UUID4)."
    )
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="subscriptions",
    )
    start_date = models.DateField()
    end_date   = models.DateField(
        blank=True,
        help_text="Auto-set to start_date + 30 days if left blank."
    )
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "milkman_subscription"
        ordering = ["-start_date"]
        verbose_name        = "Subscription"
        verbose_name_plural = "Subscriptions"

    def save(self, *args, **kwargs):
        """Auto-calculate end_date = start_date + 30 days."""
        if not self.end_date:
            from datetime import timedelta
            self.end_date = self.start_date + timedelta(days=30)
        super().save(*args, **kwargs)
        # Keep the customer flag in sync
        self.customer.is_subscribed = self.customer.has_active_subscription
        self.customer.save(update_fields=["is_subscribed"])

    def __str__(self):
        return (
            f"Sub {str(self.subscription_id)[:8]}… | "
            f"{self.customer.name} | "
            f"{self.start_date} → {self.end_date}"
        )


# ─────────────────────────────────────────────
#  Product
# ─────────────────────────────────────────────
class Product(models.Model):
    """
    A dairy product available for single purchase or included in a subscription.

    Fields
    ------
    name        : Display name (e.g. "Full-Cream Milk").
    price       : Retail price in INR (decimal, 2 dp).
    description : Marketing copy shown on the storefront.
    image_url   : CDN / public URL for the product photo.
    is_available: Toggle to hide out-of-stock items without deleting them.
    """

    CATEGORY_CHOICES = [
        ("milk",    "Milk"),
        ("cheese",  "Cheese"),
        ("butter",  "Butter"),
        ("yogurt",  "Yogurt"),
        ("cream",   "Cream"),
        ("ghee",    "Ghee"),
        ("other",   "Other"),
    ]

    name         = models.CharField(max_length=200)
    price        = models.DecimalField(max_digits=8, decimal_places=2)
    description  = models.TextField()
    image_url    = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Public CDN URL for the product image."
    )
    category     = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="milk"
    )
    is_available = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "milkman_product"
        ordering = ["category", "name"]
        verbose_name        = "Product"
        verbose_name_plural = "Products"

    def __str__(self):
        return f"{self.name} — ₹{self.price}"
