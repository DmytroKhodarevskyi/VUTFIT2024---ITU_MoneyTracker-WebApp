from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    amount = models.IntegerField()
    incomeOrSpend = models.BooleanField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions', null=True)

    def __str__(self):
        return self.title
# Create your models here.
