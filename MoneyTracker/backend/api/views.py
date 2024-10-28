from django.shortcuts import render
from django.contrib.auth.models import User
import os
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import generics
# from .serializers import UserSerializer, NoteSerializer
from .serializers import UserSerializer, TransactionSerializer, GenderChoicesSerializer, PublicationSerializer, CommentSerializer, CategorySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
# from .models import Note
from rest_framework import status
from .models import Transaction, Publication, Comment, Media, Category
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser

from rest_framework.views import APIView
from rest_framework.response import Response


from django.core.files.base import ContentFile

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
			"first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username, 
            "profileImg": request.build_absolute_uri(profile.profile_image.url)
        })
    
class SelectedUserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Optional: if you want to secure the endpoint

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile
            return Response({
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profileImg": request.build_absolute_uri(profile.profile_image.url)
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# class NoteListCreate(generics.ListAPIView):
# 	serializer_class = TransactionSerializer
# 	permission_classes = [IsAuthenticated]

# 	def get_queryset(self):
# 		user = self.request.user
# 		return Note.objects.filter(author=user)
	
# 	def perform_create(self, serializer):
# 		if serializer.is_valid():
# 			serializer.save(author=self.request.user)
# 		else:
# 			print(serializer.errors)

# class TransactionListCreate(generics.ListAPIView):
class TransactionListCreate(generics.ListCreateAPIView):
	serializer_class = TransactionSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		user = self.request.user
		return Transaction.objects.filter(author=user).order_by('-transaction_datetime')
	
	def perform_create(self, serializer):
		if serializer.is_valid():
			serializer.save(author=self.request.user)
		else:
			print(serializer.errors)


class RetrieveTransactionView(generics.RetrieveAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        transaction = super().get_object()
        if transaction.author != self.request.user:
            raise PermissionError({"detail": "You do not have permission to view this transaction."})
        return transaction  
# class NoteDelete(generics.DestroyAPIView):
# 	serializer_class = NoteSerializer
# 	permission_classes = [IsAuthenticated]

# 	def get_queryset(self):
# 		user = self.request.user
# 		return Note.objects.filter(author=user)
	
class TransactionDelete(generics.DestroyAPIView):
	serializer_class = TransactionSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		user = self.request.user
		return Transaction.objects.filter(author=user)
	
# class CreateTransactionView(generics.CreateAPIView):
# 	queryset = Transaction.objects.all()
# 	serializer_class = TransactionSerializer
# 	permission_classes = [IsAuthenticated]



class CreateUserView(generics.CreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [AllowAny]

class DeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    lookup_field = 'username'
    permission_classes = [IsAdminUser]

class GenderChoiceView(APIView):
    def get(self, request):
        choices = GenderChoicesSerializer.get_gender_choices()
        return Response(choices)

class CreatePublicationView(generics.CreateAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        publication_serializer = self.get_serializer(data=request.data)
        
        if publication_serializer.is_valid():
            publication = publication_serializer.save(author=request.user)
            
            media_files = request.FILES.getlist('media')
            media_ids = []
             
            for media_file in media_files:
                media_instance = Media.objects.create(
                    publication=publication,
                    media_type=media_file.content_type.split('/')[0], 
                    file=media_file
                )
                media_ids.append(media_instance.id) 
                
            response_data = publication_serializer.data
            response_data['media_ids'] = media_ids 
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            print(f"Validation errors: {publication_serializer.errors}")
            return Response(publication_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
class PublicationListView(generics.ListAPIView):
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Publication.objects.filter(author=user).order_by('-created_at')  

class UpdatePublicationView(generics.UpdateAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        publication = super().get_object()
        
        if publication.author != self.request.user:
            raise PermissionError({"detail": "You do not have permission to edit this publication."})
        
        return publication
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()  
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        print(f"Incoming request data for update: {request.data}")

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
         serializer.save(author=self.request.user)

class PublicationDetailView(generics.RetrieveAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        publication = super().get_object()
        if publication.author != self.request.user:
            raise PermissionError({"detail": "You do not have permission to view this publication."})
        return publication

    def get(self, request, *args, **kwargs):
        publication = self.get_object() 
        serializer = self.get_serializer(publication)
        return Response(serializer.data)


class DeletePublicationView(generics.DestroyAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        publication = self.get_object()  
        if publication.author != request.user:  
            return Response({"detail": "You do not have permission to delete this publication."},
                            status=status.HTTP_403_FORBIDDEN)
        
        
        media_files = Media.objects.filter(publication=publication)
        for media in media_files:
            media.file.delete(save=False)  
            media.delete()  
        
        
        self.perform_destroy(publication)  
        return Response(status=status.HTTP_204_NO_CONTENT)
        
class PublicationsFeedListView(generics.ListAPIView):
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # return Publication.objects.all().order_by('-created_at')  
        return Publication.objects.all().order_by('?')  
        

class CreateCommentView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  
    
class CreateCategoryView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]  

    def perform_create(self, serializer):
      
        serializer.save(author=self.request.user)
    
class ListCategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated] 
    def get_object(self):
        category = super().get_object()
        if category.author != self.request.user:
            raise PermissionError({"detail": "You do not have permission to view this category."})
        return category 
 
class RetrieveCategoryView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        category = super().get_object()
        if category.author != self.request.user:
            raise PermissionError({"detail": "You do not have permission to view this category."})
        return category    
    
class UpdateCategoryView(generics.UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        category = super().get_object()
        
        if category.author != self.request.user:
            raise PermissionError({"detail": "You do not have permission to edit this category."})
        
        return category  
    
class DeleteCategoryView(generics.DestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, *args, **kwargs):
        category = self.get_object()  
        if category.author != request.user:  
            return Response({"detail": "You do not have permission to delete this publication."},
                            status=status.HTTP_403_FORBIDDEN)  
            
        self.perform_destroy(category)  
        return Response(status=status.HTTP_204_NO_CONTENT)       
# Create your views here.
