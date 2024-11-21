from rest_framework import generics
from .models import Reminder
from .serializers import ReminderSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.utils import timezone


from django.core.exceptions import PermissionDenied

class ReminderCreateView(generics.CreateAPIView):
    queryset = Reminder.objects.all()  
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        

class ReminderDeleteView(generics.DestroyAPIView):
    queryset = Reminder.objects.all()  
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]  

    def get_object(self):
        reminder = super().get_object()

        if reminder.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this reminder.")
        return reminder
    
class ReminderListView(generics.ListAPIView):
    queryset = Reminder.objects.all()  
    serializer_class = ReminderSerializer  
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        user = self.request.user
        return Reminder.objects.filter(user=user)
    
class BatchDeleteRemindersView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        reminders_ids = request.data.get("reminders_ids", [])
        
        # Ensure we have a list of IDs to delete
        if not reminders_ids:
            return Response({"error": "No transaction IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete transactions that match the provided IDs
        deleted_count, _ = Reminder.objects.filter(id__in=reminders_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} reminders deleted successfully"},
            status=status.HTTP_200_OK
        )
    
class GetOldRemindersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        reminders = Reminder.objects.filter(user=request.user, deadline__lt=timezone.now())
        reminder_ids = reminders.values_list('id', flat=True)
        return Response(list(reminder_ids), status=status.HTTP_200_OK)
    
class GetUpcomingRemindersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        now = timezone.now()
        next_week = now + timezone.timedelta(days=7)
        reminders = Reminder.objects.filter(user=request.user, deadline__gte=now, deadline__lte=next_week)
        serializer = ReminderSerializer(reminders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)