from rest_framework import generics
from .models import Reminder
from .serializers import ReminderSerializer
from rest_framework.permissions import IsAuthenticated
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