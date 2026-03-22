# django_api/serializers.py
# ============================================================
# Milkman – DRF Serializers
# ============================================================

from rest_framework import serializers
from .models import Customer, Subscription, Product


# ──────────────────────────────────────────────
#  Customer Serializers
# ──────────────────────────────────────────────

class CustomerSerializer(serializers.ModelSerializer):
    """Used for REGISTRATION – accepts password write-only."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = Customer
        fields = ["id", "name", "email", "phone", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        customer = Customer(**validated_data)
        customer.set_password(password)
        customer.save()
        return customer


class CustomerDetailSerializer(serializers.ModelSerializer):
    """Used for profile reads and admin views – never exposes password."""

    subscriptions = serializers.SerializerMethodField()

    class Meta:
        model  = Customer
        fields = [
            "id", "name", "email", "phone",
            "is_subscribed", "is_staff",
            "payment_info", "created_at",
            "subscriptions",
        ]
        read_only_fields = ["id", "is_staff", "created_at"]

    def get_subscriptions(self, obj):
        subs = obj.subscriptions.all()[:5]           # last 5 subscriptions
        return SubscriptionSerializer(subs, many=True).data


class AdminUpdateCustomerSerializer(serializers.ModelSerializer):
    """
    Admin-only: update email, password, subscription flag.
    Password is write-only; if provided it will be hashed correctly.
    """

    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model  = Customer
        fields = ["name", "email", "phone", "password", "is_subscribed", "payment_info"]

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField()


# ──────────────────────────────────────────────
#  Subscription Serializer
# ──────────────────────────────────────────────

class SubscriptionSerializer(serializers.ModelSerializer):
    customer_name  = serializers.CharField(source="customer.name",  read_only=True)
    customer_email = serializers.CharField(source="customer.email", read_only=True)

    class Meta:
        model  = Subscription
        fields = [
            "subscription_id",
            "customer", "customer_name", "customer_email",
            "start_date", "end_date",
            "is_active", "created_at",
        ]
        read_only_fields = ["subscription_id", "end_date", "created_at"]


# ──────────────────────────────────────────────
#  Product Serializer
# ──────────────────────────────────────────────

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Product
        fields = [
            "id", "name", "price", "description",
            "image_url", "category", "is_available",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
