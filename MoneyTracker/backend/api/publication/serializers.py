from rest_framework import serializers
from .models import Media, Comment, Publication, Star
from django.conf import settings
import os
from api.profile_user.serializers import UserSerializer

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'media_type', 'file']
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'publication', 'author', 'stars', 'text', 'created_at']
        read_only_fields  = ['id', 'author', 'publication', 'created_at']
        
        def validate_stars(self, value):
            if value < 0:
                raise serializers.ValidationError("Stars cannot be negative.")
            return value

        def create(self, validated_data):
            validated_data['stars'] = validated_data.get('stars', 0)
            return Comment.objects.create(**validated_data)
    
    
class PublicationSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True) 
    comments = CommentSerializer(many=True, read_only=True)  
    media_files = MediaSerializer(many=True, read_only=True)

    media = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False),
        write_only=True,
        required=False
    )

    existing_media = serializers.ListField(
        child=serializers.IntegerField(),  
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Publication
        fields = ['id', 'title', 'tags', 'content_text', 'author', 'stars', 'comments', 'media', 'media_files', 'existing_media', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'stars', 'comments', 'media_files']  

    def create(self, validated_data):
        request = self.context.get('request')
        media_files = validated_data.pop('media', [])
        validated_data['author'] = request.user  
        
        publication = Publication.objects.create(**validated_data)
        
        if len(media_files) > 3:
            raise serializers.ValidationError("Reached max limit files of 3 files")
            
        return publication
    
    def update(self, instance, validated_data):
        media_files = validated_data.pop('media', [])
        existing_media_ids = validated_data.pop('existing_media', [])
        
        instance.title = validated_data.get('title', instance.title)
        instance.tags = validated_data.get('tags', instance.tags)
        instance.content_text = validated_data.get('content_text', instance.content_text)
        
        instance.save()
                
        media_to_delete = instance.media_files.exclude(id__in=existing_media_ids)
        
        for media in media_to_delete:
             file_path = os.path.join(settings.MEDIA_ROOT, media.file.name)
             if os.path.isfile(file_path):
                     os.remove(file_path)
             media.delete()
           
        if media_files:   
            if len(media_files) + len(existing_media_ids) > 3:
                raise serializers.ValidationError("Reached max limit of 3 files")
            
            for media_file in media_files:
                    content_type = media_file.content_type
                    
                    if content_type in ['image/jpeg', 'image/png', 'image/gif']:
                        media_type = 'image' if content_type != 'image/gif' else 'gif'
                    elif content_type == 'video/mp4':
                        media_type = 'video'
                    else:
                        raise serializers.ValidationError(f"{content_type} is not a supported media type")
                    
                    Media.objects.create(publication=instance, media_type=media_type, file=media_file)
                
        return instance
    
class StarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Star
        fields = ['id', 'user', 'comment', 'publication']