from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

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
    
    
class Media(models.Model):
    IMAGE = "image"
    VIDEO = "video"
    GIF = "gif"
    
    MEDIA_TYPE_CHOICES = (
        (IMAGE, 'Image'),
        (VIDEO, 'Video'),
        (GIF, 'Gif')
    )
    
    publication = models.ForeignKey('Publication', on_delete=models.CASCADE, related_name='media_files')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    file = models.FileField(upload_to='publications/')
    
    def __str__(self):
        return f'{self.media_type} file for {self.publication.title}'
    
class Publication(models.Model):
    
    title = models.CharField(max_length=128, blank=False, default="")
    tags = models.CharField(max_length=255, blank=True) 
    
    content_text = models.TextField(blank=True, null=True) 
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='publications', null=True)
    
    stars = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.title} - publication name'
    
    def media_count(self):
        return self.media_files.count()
    
    def add_media(self, media_type, media_file):
        if self.media_files.count() >= 3:
             raise ValueError("Cannot upload more than 3 media files.")
        Media.objects.create(publication=self, media_type=media_type, file=media_file)
        
    def get_file_url(self):
        return f"{settings.MEDIA_URL}{self.file.name}"
    
    
class Comment(models.Model):
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    stars = models.PositiveIntegerField(default=0)
    text = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author} on {self.publication}'
    
# Create your models here.
