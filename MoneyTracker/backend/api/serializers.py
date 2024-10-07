from django.contrib.auth.models import User
from rest_framework import serializers
# from .models import Note
from django.core.files.uploadedfile import InMemoryUploadedFile
import os
from django.conf import settings
from .models import Transaction, Profile, Comment, Publication, Media


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['country', 'city', 'gender', 'phone', 'job', 'profile_image']
        extra_kwargs = {
            'phone': {'required': True},
        }

    def validate_phone(self, value):
        """
        Check that the phone number is unique.
        """
        if Profile.objects.filter(phone=value).exists():
            raise serializers.ValidationError("This phone number is already in use.")
        return value


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    
    class Meta:
        model = User
        fields = ["id", "username", "password", "first_name", "last_name", "email", "profile"]
        extra_kwargs = {
            "password": {"write_only": True, "required": True},
            "email": {"required": True}
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        Profile.objects.create(
            user=user,
            phone=profile_data['phone'],
            country=profile_data.get('country', ''),
            city=profile_data.get('city', ''),
            gender=profile_data.get('gender', 'N'),
            job=profile_data.get('job', 'Unemployed'),
            profile_image=profile_data.get('profile_image', 'profile_images/default.png')
        )
        return user
    
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()

        profile.phone = profile_data.get('phone', profile.phone)
        profile.country = profile_data.get('country', profile.country)
        profile.city = profile_data.get('city', profile.city)
        profile.gender = profile_data.get('gender', profile.gender)
        profile.job = profile_data.get('job', profile.job)
        profile.profile_image = profile_data.get('profile_image', profile.profile_image)
        profile.save()

        return instance
    
# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content", "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        # fields = ["id", "title", "category", "created_at", "transaction_datetime", "currency", "transaction_type", "amount", "incomeOrSpend", "author"]
        extra_kwargs = {"author": {"read_only": True}}
        

class GenderChoicesSerializer(serializers.ModelSerializer):
    value = serializers.CharField()
    label = serializers.CharField()

    @staticmethod
    def get_gender_choices():
        return [{'value': choice[0], 'label': choice[1]} for choice in Profile.GENDER_CHOICES]


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'media_type', 'file']
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'text', 'stars', 'created_at']
    
    
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