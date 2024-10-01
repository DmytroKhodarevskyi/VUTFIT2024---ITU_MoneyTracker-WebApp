from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    INCOME = 'INCOME'
    EXPENSE = 'EXPENSE'
    TRANSACTION_TYPE_CHOICES = [
        (INCOME, 'Income'),
        (EXPENSE, 'Expense'),
    ]

    title = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    transaction_datetime = models.DateTimeField(default=None)
    currency = models.CharField(max_length=50, default="USD")
    transaction_type = models.CharField(
        max_length=7,
        choices=TRANSACTION_TYPE_CHOICES,
        default=INCOME,
    )
    amount = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    incomeOrSpend = models.BooleanField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions', null=True)

    # def __str__(self):
        # return self.title
    
    def __str__(self):
        return f"{self.title} - {self.amount} {self.currency}"
    
    
class Profile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('C', 'Croissant'),
        ('N', 'Prefer not to say'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    country = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='N')
    phone = models.CharField(max_length=15, unique=True)
    job = models.CharField(max_length=100, default="Unemployed")
    profile_image = models.ImageField(upload_to='profile_images/', default='profile_images/default.png', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} Profile'
    
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7, default="#FFFFFF")  # Default color is white, using hex color codes
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories', null=True)

    def __str__(self):
        return self.name
    
# Create your models here.
