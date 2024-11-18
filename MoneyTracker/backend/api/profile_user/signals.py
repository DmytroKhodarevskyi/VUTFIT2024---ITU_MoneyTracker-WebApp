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
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile.objects.create(user=instance)

        instance.first_name = "Admin Name"
        instance.last_name = "Admin Surname"
        
        instance.save()
        
        if instance.is_superuser:
            profile.country = 'Admin Country'
            profile.city = 'Admin City'
            profile.gender = 'N'  
            profile.phone = get_unique_phone() 
            profile.job = 'Administrator'
            profile.profile_image = 'profile_images/default_admin.png'
            profile.stars_count = 10

            profile.save()