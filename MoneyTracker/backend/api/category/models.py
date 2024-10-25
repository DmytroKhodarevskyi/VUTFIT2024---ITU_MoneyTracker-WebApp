from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7, default="#000000")  
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories', null=True)
    is_default = models.BooleanField(default=False)
      
    def save(self, *args, **kwargs):
        if self.is_default and self.pk:
            original = Category.objects.get(pk=self.pk)
            if original.name != self.name or original.color != self.color:
                raise ValidationError("You cannot modify the default category's name or color.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.is_default:
            raise ValidationError("You cannot delete the default category.")
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name
    