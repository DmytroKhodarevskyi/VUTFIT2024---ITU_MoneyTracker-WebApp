from django.db import models
from django.contrib.auth.models import User
from django.conf import settings



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
    
    title = models.CharField(max_length=128, blank=False, null=False)
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
    
    def like(self, user):
        if not Star.objects.filter(user=user, publication=self).exists():
            Star.objects.create(user=user, publication=self)
            self.stars += 1
            
            self.author.profile.stars_count += 1
            self.author.profile.save()
            self.save()
            
    def unlike(self, user):
        try:
            like = Star.objects.get(user=user, publication=self)
            like.delete()
            self.stars -= 1
            self.author.profile.stars_count -= 1
            self.author.profile.save()
            self.save()
        except Star.DoesNotExist:
            pass
    
    
    
    
class Comment(models.Model):
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    stars = models.PositiveIntegerField(default=0)
    text = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author} on {self.publication}'

    def like(self, user):
        if not Star.objects.filter(user=user, comment=self).exists():
            Star.objects.create(user=user, comment=self)
            self.stars += 1
            self.save()
            
    def unlike(self, user):
        try:
            like = Star.objects.get(user=user, comment=self)
            like.delete()
            self.stars -= 1
            self.save()
        except Star.DoesNotExist:
            pass
    
    
class Star(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        unique_together = ('user', 'comment', 'publication')  