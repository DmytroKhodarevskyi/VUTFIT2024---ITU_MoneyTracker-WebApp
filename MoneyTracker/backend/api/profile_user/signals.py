import random
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile
from django.db import IntegrityError

def generate_unique_phone():
    return f'{random.randint(1000000000, 9999999999)}'

def get_unique_phone():
    while True:
        phone_number = generate_unique_phone()
        if not Profile.objects.filter(phone=phone_number).exists():
            return phone_number
        
        
@receiver(post_save, sender=User)
def create_superuser_profile(sender, instance, created, **kwargs):
 
    if created and instance.is_superuser:
      
        instance.first_name = "Admin"
        instance.last_name = "AdminSurname"
        instance.save()

        Profile.objects.create(
            user=instance,
            country="Admin",
            city="Admin",
            gender="N",
            phone=get_unique_phone(),
            job="Administrator",
            profile_image="profile_images/default_admin.png",
            stars_count=10,
        )