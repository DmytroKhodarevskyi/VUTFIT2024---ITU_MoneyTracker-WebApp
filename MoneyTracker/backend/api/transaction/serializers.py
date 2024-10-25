from rest_framework import serializers
from .models import Transaction
from api.category.models import Category


class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Transaction
        fields = '__all__'
        extra_kwargs = {"author": {"read_only": True}}
        