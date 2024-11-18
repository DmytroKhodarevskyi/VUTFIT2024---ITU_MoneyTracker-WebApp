import random
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

def generate_unique_phone():
    return f'{random.randint(1000000000, 9999999999)}'

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
            profile.phone = generate_unique_phone() 
            profile.job = 'Administrator'
            profile.profile_image = 'profile_images/default_admin.png'
            profile.stars_count = 10

            profile.save()