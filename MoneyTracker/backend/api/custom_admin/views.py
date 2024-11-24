# views.py
from django.shortcuts import get_object_or_404
from rest_framework import generics , serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.exceptions import ValidationError

from api.transaction.models import Transaction
from api.category.models import Category
from api.publication.models import Publication
from api.group.models import Group
from api.publication.models import Comment
from api.group.models import UserGroup
from api.group.models import Thread
from api.group.models import ThreadComment
from api.reminder.models import Reminder
 

from .serializers import (
    UserSerializer, 
    TransactionSerializer,
    CategorySerializer, 
    PublicationSerializer,
    GroupSerializer,
    PublicationCommentSerializer,
    UserGroupSerializer,
    GroupThreadSerializer,
    GroupThreadCommentsSerializer,
    ReminderSerializer,
)

from django.contrib.auth.models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def check_superuser_status(request):
    is_superuser = request.user.is_superuser
    return Response({'is_superuser': is_superuser}, status=status.HTTP_200_OK)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UsernameSearchView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'

    def get_queryset(self):
        return User.objects.all()

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        return Response({'username': user.username})

class DeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class BatchDeleteTransactionsView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        transaction_ids = request.data.get("transaction_ids", [])
        
        
        if not transaction_ids:
            return Response({"error": "No transaction IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        deleted_count, _ = Transaction.objects.filter(id__in=transaction_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} transactions deleted successfully"},
            status=status.HTTP_200_OK
        )
    
class BatchDeleteCategoriesView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        category_ids = request.data.get("category_ids", [])  
        
        
        if not category_ids:
            return Response({"error": "No category IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        deleted_count, _ = Category.objects.filter(id__in=category_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} categories deleted successfully"},
            status=status.HTTP_200_OK
        )


class BatchDeletePublicationView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        publication_ids = request.data.get("publication_ids", [])
        
        
        if not publication_ids:
            return Response({"error": "No publication IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        deleted_count, _ = Publication.objects.filter(id__in=publication_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} publication deleted successfully"},
            status=status.HTTP_200_OK
        )
    
class BatchDeleteGroupView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        group_ids = request.data.get("group_ids", [])
        
        
        if not group_ids:
            return Response({"error": "No group IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        deleted_count, _ = Group.objects.filter(id__in=group_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} group deleted successfully"},
            status=status.HTTP_200_OK
        )

class UserTransactionsView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Transaction.objects.filter(author_id=user_id)



class UserCategoriesView(generics.ListAPIView):
    serializer_class = CategorySerializer
    

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Category.objects.filter(author_id=user_id)


class UserPublicationsView(generics.ListAPIView):
    serializer_class = PublicationSerializer
    

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Publication.objects.filter(author_id=user_id)
    
class UserGroupsView(generics.ListAPIView):
    serializer_class = GroupSerializer
    

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Group.objects.filter(creator_id=user_id)
    
class UpdateGroupView(generics.UpdateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        
        partial = kwargs.pop('partial', True)  
        instance = self.get_object() 
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class UpdateTransactionView(generics.UpdateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        
        partial = kwargs.pop('partial', True)  
        instance = self.get_object() 
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdateCategoryView(generics.UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]  

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  
        instance = self.get_object()  
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdatePublicationView(generics.UpdateAPIView):
    queryset = Publication.objects.all()  
    serializer_class = PublicationSerializer
    permission_classes = [IsAdminUser]  

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()  
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class UserPublicationCommentsView(generics.ListAPIView):
    serializer_class = PublicationCommentSerializer

    def get_queryset(self):
        publication_id = self.kwargs['pk']
        return Comment.objects.filter(publication=publication_id)
    
    
class UpdatePublicationCommentView(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = PublicationCommentSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        
        partial = kwargs.pop('partial', True)  
        instance = self.get_object() 
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class BatchDeletePublicationCommentsView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        comment_ids = request.data.get("comment_ids", [])
        
        
        if not comment_ids:
            return Response({"error": "No comments IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        deleted_count, _ = Comment.objects.filter(id__in=comment_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} comments deleted successfully"},
            status=status.HTTP_200_OK
        )
        
        
class PublicationDetailView(generics.RetrieveAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        publication = super().get_object()
        return publication

    def get(self, request, *args, **kwargs):
        publication = self.get_object() 
        serializer = self.get_serializer(publication)
        return Response(serializer.data)


class GroupUsersView(generics.ListAPIView):
    serializer_class = UserGroupSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        group_id = self.kwargs['pk']  
        return UserGroup.objects.filter(group=group_id)
    
class BatchDeleteGroupUsersView(APIView):
    permission_classes = [IsAdminUser]
    serializer_class = UserGroupSerializer
    def delete(self, request, *args, **kwargs):
        user_ids = request.data.get("user_ids", [])
        
        
        if not user_ids:
            return Response({"error": "No users IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        deleted_count, _ = UserGroup.objects.filter(id__in=user_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} users deleted successfully"},
            status=status.HTTP_200_OK
        )
        
class UpdateGroupUsersView(generics.UpdateAPIView):
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        
        partial = kwargs.pop('partial', True)  
        instance = self.get_object() 
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class BatchDeleteGroupThreadsView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        thread_ids = request.data.get("thread_ids", [])
        
        
        if not thread_ids:
            return Response({"error": "No comments IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        deleted_count, _ = Thread.objects.filter(id__in=thread_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} threads deleted successfully"},
            status=status.HTTP_200_OK
        )
        
class UpdateGroupThreadsView(generics.UpdateAPIView):
    queryset = Thread.objects.all()
    serializer_class = GroupThreadSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        
        partial = kwargs.pop('partial', True)  
        instance = self.get_object() 
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GroupThreadsView(generics.ListAPIView):
    serializer_class = GroupThreadSerializer
    

    def get_queryset(self):
        group_id = self.kwargs['pk']
        return Thread.objects.filter(group_id=group_id)
    
class GroupThreadCommentsView(generics.ListAPIView):
    serializer_class = GroupThreadCommentsSerializer

    def get_queryset(self):
        thread_id = self.kwargs['pk']
        return ThreadComment.objects.filter(thread=thread_id)
    
class UpdateThreadCommentView(generics.UpdateAPIView):
    queryset = ThreadComment.objects.all()
    serializer_class = GroupThreadCommentsSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        
        partial = kwargs.pop('partial', True)  
        instance = self.get_object() 
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
class BatchDeleteThreadCommentsView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        comment_ids = request.data.get("comment_ids", [])
        
        
        if not comment_ids:
            return Response({"error": "No comments IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        deleted_count, _ = ThreadComment.objects.filter(id__in=comment_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} comments deleted successfully"},
            status=status.HTTP_200_OK
        )
        

class ThreadDetailView(generics.RetrieveAPIView):
    queryset = Thread.objects.all()
    serializer_class = GroupThreadSerializer
 
class UserRemindersView(generics.ListAPIView):
    serializer_class = ReminderSerializer
    

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Reminder.objects.filter(user=user_id)
    
class BatchDeleteReminderView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        reminder_ids = request.data.get("reminder_ids", [])
        
        
        if not reminder_ids:
            return Response({"error": "No reminder IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        deleted_count, _ = Reminder.objects.filter(id__in=reminder_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} reminder deleted successfully"},
            status=status.HTTP_200_OK
        )
        
class UpdateReminderView(generics.UpdateAPIView):
    queryset = Reminder.objects.all()  
    serializer_class = ReminderSerializer
    permission_classes = [IsAdminUser]  

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()  
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
    
class UserProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request, pk):
        
        user = get_object_or_404(User, pk=pk)
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
            "username": user.username,
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

    def patch(self, request, pk):
        
        user = get_object_or_404(User, pk=pk)
        profile = user.profile

        firstname = request.data.get('firstname')
        lastname = request.data.get('lastname')
        email = request.data.get('email')
        phone = request.data.get('phone')
        country = request.data.get('country')
        city = request.data.get('city')
        gender = request.data.get('gender')
        job_title = request.data.get('jobTitle')
        stars_count = request.data.get('starsCount')  

        if firstname is not None:
            user.first_name = firstname
        if lastname is not None:
            user.last_name = lastname
        if email is not None:
            user.email = email
        user.save()

        if phone is not None:
            profile.phone = phone
        if country is not None:
            profile.country = country
        if city is not None:
            profile.city = city
        if gender is not None:
            profile.gender = gender
        if job_title is not None:
            profile.job = job_title
        if stars_count is not None:  
            profile.stars_count = stars_count
        
        profile.save()
        return Response({"detail": "Profile updated successfully."}, status=status.HTTP_200_OK)

    
class UserProfileDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        profile = user.profile
        data = {
            "id": user.id,
            "firstname": user.first_name,
            "lastname": user.last_name,
            "email": user.email,
            "phone": profile.phone,
            "country": profile.country,
            "city": profile.city,
            "gender": profile.gender,
            "jobTitle": profile.job,
            "starsCount": profile.stars_count,
        }
        return Response(data)
    
class CategoryCreateView(generics.CreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        user_id = self.kwargs['pk']
        return Category.objects.filter(author_id=user_id)

    def perform_create(self, serializer):
        user_id = self.kwargs['pk']
        
        name = serializer.validated_data.get("name").strip().lower()
        if Category.objects.filter(name__iexact=name, author_id=user_id).exists():
            raise serializers.ValidationError({"name": "Category with this name already exists for the user."})
        
        
        serializer.save(author_id=user_id)
        
        
class AdminTransactionCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk, *args, **kwargs):
        
        user = get_object_or_404(User, pk=pk)
        serializer = TransactionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(author=user)  
            return Response({"message": "Transaction created successfully"}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreatePublicationView(generics.CreateAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, pk, *args, **kwargs):
        user = get_object_or_404(User, pk=pk)  
        publication_serializer = self.get_serializer(data=request.data)
        
        if publication_serializer.is_valid():
            
            publication = publication_serializer.save(author=user)  
            return Response(publication_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(publication_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminGroupCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk, *args, **kwargs):
        
        print("Incoming data:", request.data)

        
        user = get_object_or_404(User, pk=pk)

        
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            
            group = serializer.save(creator=user)
            return Response(
                {"message": "Group created successfully!", "group": GroupSerializer(group).data},
                status=HTTP_201_CREATED
            )

        
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
class CheckGroupNameView(APIView):
    def get(self, request, *args, **kwargs):
        group_name = request.query_params.get("name", "").strip()

        if not group_name:
            return Response({"detail": "Group name is required."}, status=status.HTTP_400_BAD_REQUEST)

        exists = Group.objects.filter(name=group_name).exists()

        if exists:
            return Response({"exists": True, "detail": "Group with this name already exists."}, status=status.HTTP_200_OK)
        
        return Response({"exists": False}, status=status.HTTP_200_OK)
    
class AddUserToGroupView(APIView):
    def post(self, request, group_id):
        username = request.data.get('username')
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, username=username)
        group = get_object_or_404(Group, id=group_id)

        
        if UserGroup.objects.filter(user=user, group=group).exists():
            return Response({"error": "User is already a member of this group"}, status=status.HTTP_400_BAD_REQUEST)

        
        UserGroup.objects.create(user=user, group=group, role='member')

        return Response({"message": f"User {username} successfully added to the group {group.name}"}, status=status.HTTP_201_CREATED)
    
class ThreadAdminCreateView(generics.CreateAPIView):
    serializer_class = GroupThreadSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        
        group_id = self.request.data.get('group')

        if not group_id:
            raise serializers.ValidationError({"group": "This field is required."})

        try:
           
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            raise serializers.ValidationError({"group": "Group does not exist."})

        
        serializer.save(creator=self.request.user, group=group)
        
class ReminderCreateAdminView(generics.CreateAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        user_id = self.kwargs.get('pk') 
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise ValidationError({"user": "User with the provided ID does not exist."})

        
        serializer.save(user=user)

