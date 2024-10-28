from rest_framework import serializers
from .models import Group, UserGroup, Thread, ThreadComment

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
    class Meta:
        model = Group
        fields = ['name', 'description']  
        
        def validate_name(self, value):
            if not value.strip():  
                raise serializers.ValidationError("The name field cannot be blank.")
            return value
        
        
class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = '__all__'

class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = '__all__'
        
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
        
        def validate_text_content(self, value):
            if not value.strip():
                raise serializers.ValidationError("Text content cannot be blank.")
            return value