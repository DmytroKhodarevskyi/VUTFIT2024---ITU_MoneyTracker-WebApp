from django.contrib.auth.models import User
from .serializers import UserSerializer, GenderChoicesSerializer, UserUsernameSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from .models import Profile
from rest_framework.views import APIView
import os
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import status

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class DeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    lookup_field = 'username'
    permission_classes = [IsAdminUser]

class GenderChoiceView(APIView):
    def get(self, request):
        choices = GenderChoicesSerializer.get_gender_choices()
        return Response(choices)
    
class UserProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        profile = user.profile
        
        transactions = user.transactions.all()
        total_spends = sum(t.amount for t in transactions if not t.incomeOrSpend)
        total_income = sum(t.amount for t in transactions if t.incomeOrSpend)
        
        profile_img = profile.profile_image.url if profile.profile_image else '/media/profile_images/default.png'
        
        
        data = {
            "id": user.id,
			"firstname": user.first_name,
            "lastname": user.last_name,
			"fullname": f"{user.first_name} {user.last_name}",
			"username": f"{user.username}",
    		"email": user.email,
            "phone": profile.phone,
            "country": profile.country,
            "city": profile.city,
            "gender": profile.get_gender_display(),  
            "jobTitle": profile.job,
            "starsCount": profile.stars_count,
            "profileImg": profile_img,  
            "totalSpends": total_spends,
            "totalIncome": total_income
		}
        return Response(data)
    
    def put(self, request):
        user = request.user
        profile = user.profile
        
        firstname = request.data.get('firstname')
        lastname = request.data.get('lastname')
        email = request.data.get('email')
        phone = request.data.get('phone')
        country = request.data.get('country')
        city = request.data.get('city')
        gender = request.data.get('gender')
        job_title = request.data.get('jobTitle')

        if firstname:
            user.first_name = firstname
        if lastname:
            user.last_name = lastname
        if email:
            user.email = email
        user.save()

        if phone:
            profile.phone = phone
        if country:
            profile.country = country
        if city:
            profile.city = city
        if gender:
            profile.gender = gender
        if job_title:
            profile.job = job_title
        profile.save()
        
        return Response({"detail": "Profile updated successfully."}, status=status.HTTP_200_OK)
    
    def patch(self, request):
        user = request.user
        profile = user.profile
        
        firstname = request.data.get('firstname')
        lastname = request.data.get('lastname')
        email = request.data.get('email')
        phone = request.data.get('phone')
        country = request.data.get('country')
        city = request.data.get('city')
        gender = request.data.get('gender')
        job_title = request.data.get('jobTitle')

        if firstname is not None:
            user.first_name = firstname
        if lastname is not None:
            user.last_name = lastname
        if email is not None:
            user.email = email
        if phone is not None:
            profile.phone = phone
        if country is not None:
            profile.country = country
        if city is not None:
            profile.city = city
        if gender is not None:
            print(gender)
            profile.gender = gender
        if job_title is not None:
            profile.job = job_title
        
        user.save()
        profile.save()

        return Response({"detail": "Profile updated successfully."}, status=status.HTTP_200_OK)


class UserProfilePhotoView(APIView):
     permission_classes = [IsAuthenticated]
     
     def delete(self, request):
         user = request.user
         profile = user.profile
         
         if profile.profile_image and profile.profile_image.name != 'profile_images/default.png':
             image_path = os.path.join(settings.MEDIA_ROOT, profile.profile_image.name)
             
             if default_storage.exists(image_path):
                 default_storage.delete(image_path)
                 
         profile.profile_image = 'profile_images/default.png'
         profile.save()
         
         return Response({"detail:": "Photo was deleted successfully"}, status=status.HTTP_200_OK)
     
     def post(self, request):
        user = request.user
        profile = user.profile
        
        if 'profile_image' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)


        profile_image = request.FILES['profile_image']
        
     
        profile.profile_image = profile_image
        

        profile.save()

        return Response({"detail": "Photo was uploaded successfully"}, status=status.HTTP_200_OK)
         

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile
        
        return Response({
            "id": user.id,
            "stars": profile.stars_count,
			"first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username, 
            "profileImg": request.build_absolute_uri(profile.profile_image.url),
            "createdDate": profile.created_at
        })
    
class SelectedUserProfileView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile
            return Response({
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profileImg": request.build_absolute_uri(profile.profile_image.url)
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if instance != self.request.user:
            raise PermissionDenied("You do not have permission to delete this user account.")
        
        instance.delete()

    def get_object(self):
        return self.request.user
    

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()  
    serializer_class = UserUsernameSerializer 
    permission_classes=[AllowAny]