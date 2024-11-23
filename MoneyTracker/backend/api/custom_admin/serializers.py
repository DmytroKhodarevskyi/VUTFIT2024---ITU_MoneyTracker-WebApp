from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone


from api.transaction.models import Transaction
from api.category.models import Category
from api.publication.models import Publication
from api.group.models import Group
from api.publication.models import Comment
from api.group.models import UserGroup
from api.group.models import Thread
from api.group.models import ThreadComment
from api.reminder.models import Reminder
from api.profile_user.models import Profile
from api.profile_user.serializers import ProfileSerializer
from api.profile_user.serializers import UserSerializer




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']  
class TransactionSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(
        format="%d-%m-%Y %H:%M:%S",  
        input_formats=["%d-%m-%Y %H:%M:%S", "%Y-%m-%dT%H:%M:%S.%fZ"] 
    )

    class Meta:
        model = Transaction
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
    def validate_name(self, value):
        request = self.context["request"]
        user_id = self.context["view"].kwargs["pk"]
        if Category.objects.filter(name__iexact=value.strip(), author_id=user_id).exists():
            raise serializers.ValidationError("You already have a category with this name.")
        return value  

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__' 
        
        
class PublicationCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__' 
  
        
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__' 
        read_only_fields = ['id', 'creator', 'subscribers_count', 'created_at', 'updated_at']
        
class UserGroupSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True) 
    class Meta:
        model = UserGroup
        fields = '__all__' 
        
class GroupThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = '__all__' 
        read_only_fields = ['creator', 'created_at', 'updated_at']
    def validate_group(self, value):
        if not Group.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Group does not exist.")
        return value
    
class GroupThreadCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThreadComment
        fields = '__all__' 
        
class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id','title', 'deadline', 'amount']

    def validate_deadline(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Deadline must be in the future.")
        return value
