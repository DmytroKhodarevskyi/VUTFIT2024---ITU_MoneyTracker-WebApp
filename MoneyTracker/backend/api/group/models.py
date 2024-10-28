from django.db import models
from django.contrib.auth.models import User

class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)  
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')  
    subscribers_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True) 
    
    group_image = models.ImageField(upload_to='group_images/', default='group_images/default.png', blank=True, null=True)

    def __str__(self):
        return self.name

    def subscribe(self):
        self.subscribers_count += 1
        self.save()

    def unsubscribe(self):
        if self.subscribers_count > 0:
            self.subscribers_count -= 1
            self.save()
    
class UserGroup(models.Model):
    GROUP_ROLES = (
        ('creator', 'Creator'),
        ('moderator', 'Moderator'),
        ('member', 'Member'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_groups')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='user_groups')
    role = models.CharField(max_length=10, choices=GROUP_ROLES)  
    is_banned = models.BooleanField(default=False) 

    class Meta:
        unique_together = ('user', 'group')  

    def __str__(self):
        return f'{self.user.username} - {self.group.name} ({self.role})'
    
    
class Thread(models.Model):
    MEDIA_TYPE_CHOICES = (
        ('image', 'Image'),
        ('video', 'Video'),
        ('gif', 'Gif'),
    )
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='threads')  
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='threads_created') 
    title = models.CharField(max_length=255) 
    text_content = models.TextField(blank=False, null=False)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, blank=True, null=True)
    media_file = models.FileField(upload_to='threads/', blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.title
    
class ThreadComment(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='comments') 
    author = models.ForeignKey(User, on_delete=models.CASCADE) 
    text_content = models.TextField(blank=False, null=False)
    media_type = models.CharField(max_length=10, choices=Thread.MEDIA_TYPE_CHOICES, blank=True, null=True)  
    media_file = models.FileField(upload_to='threads/', blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author} on {self.thread.title}'
    
