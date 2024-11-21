from django.db import models
from django.contrib.auth.models import User

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reminders')
    created_at = models.DateTimeField(auto_now_add=True) 
    deadline = models.DateTimeField() 
    title = models.CharField(max_length=128)  
    amount = models.DecimalField(max_digits=10, decimal_places=2) 

    def __str__(self):
        return f'{self.title} - {self.deadline}'