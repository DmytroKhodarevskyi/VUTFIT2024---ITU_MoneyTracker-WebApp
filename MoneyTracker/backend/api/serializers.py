from django.contrib.auth.models import User
from rest_framework import serializers
# from .models import Note
from .models import Transaction, Profile, Category




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
        print("Validated data:", validated_data)
        profile_data = validated_data.pop('profile')
        # user = User.objects.create_user(**validated_data)
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
        
        
class CategorySerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')  # To display the username of the author

    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'created_at', 'author']  # Specify fields to be serialized
        read_only_fields = ['id', 'created_at', 'author']  # Fields that should not be writable

    def validate_name(self, value):
        """
        Ensure the category name is unique for the user.
        """
        request = self.context.get('request')
        if Category.objects.filter(name=value, author=request.user).exists():
            raise serializers.ValidationError("You already have a category with this name.")
        return value        