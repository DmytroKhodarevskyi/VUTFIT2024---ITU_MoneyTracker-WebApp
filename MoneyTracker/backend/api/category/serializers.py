from .models import Category
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'created_at', 'author']
        extra_kwargs = {"author": {"read_only": True}}