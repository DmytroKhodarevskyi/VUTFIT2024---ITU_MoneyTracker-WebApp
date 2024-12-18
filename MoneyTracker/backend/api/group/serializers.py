from rest_framework import serializers
from .models import Group, UserGroup, Thread, ThreadComment
from api.profile_user.models import User
from api.profile_user.serializers import ProfileSerializer

class GroupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'creator', 'subscribers_count', 'group_image', 'created_at', 'updated_at']
        read_only_fields = ['creator', 'subscribers_count', 'created_at', 'updated_at']
        
        def validate_name(self, value):
            if not value.strip():  
                raise serializers.ValidationError("The name field cannot be blank.")
            return value
        
        def validate_creator(self, value):
            if hasattr(value, 'profile'):
                if value.profile.stars_count < 100:
                    raise serializers.ValidationError("User must have at least 100 stars to create a group.")
            else:
                raise serializers.ValidationError("User profile does not exist.")
            return value


class GroupUpdateSerializer(serializers.ModelSerializer):
    group_image = serializers.ImageField(required=False) 
    class Meta:
        model = Group
        fields = ['name', 'description', 'group_image'] 

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("The name field cannot be blank.")
        return value

    def validate_group_image(self, value):
        if value:
            if not value.name.lower().endswith(('jpg', 'jpeg', 'png', 'gif')): 
                raise serializers.ValidationError("Only image files are allowed.")
        return value

    def update(self, instance, validated_data):

        group_image = validated_data.get('group_image', None)
        if group_image:
            instance.group_image = group_image

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        
        instance.save()
        return instance
        
        
class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = '__all__'
        read_only_fields = ['user', 'group']

class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = '__all__'
        read_only_fields = ['creator', 'created_at']
        
        def validate_title(self, value):
            if not value.strip():
                raise serializers.ValidationError("The title field cannot be blank.")
            return value
        
        def validate_text_content(self, value):
            if not value.strip():
                raise serializers.ValidationError("Text content cannot be blank.")
            return value

class ThreadCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThreadComment
        fields = '__all__'
        read_only_fields = ['author', 'created_at']
        
        def validate_text_content(self, value):
            if not value.strip():
                raise serializers.ValidationError("Text content cannot be blank.")
            return value
        
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile']