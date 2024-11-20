from rest_framework import serializers
from .models import Reminder

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'user', 'created_at', 'deadline', 'title', 'amount']
        read_only_fields  = ['id', 'user', 'created_at']
