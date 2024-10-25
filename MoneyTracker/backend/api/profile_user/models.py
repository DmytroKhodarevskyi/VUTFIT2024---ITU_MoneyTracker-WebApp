from django.db import models
from django.contrib.auth.models import User


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
    