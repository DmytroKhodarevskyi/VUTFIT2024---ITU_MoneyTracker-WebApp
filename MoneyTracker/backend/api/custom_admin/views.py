# views.py
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from api.transaction.models import Transaction
from api.category.models import Category
from api.publication.models import Publication
from api.group.models import Group
from api.publication.models import Comment
from api.group.models import UserGroup
from api.group.models import Thread
from api.group.models import ThreadComment

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
)

from django.contrib.auth.models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
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
        
        # Ensure we have a list of IDs to delete
        if not transaction_ids:
            return Response({"error": "No transaction IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete transactions that match the provided IDs
        deleted_count, _ = Transaction.objects.filter(id__in=transaction_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} transactions deleted successfully"},
            status=status.HTTP_200_OK
        )
    
class BatchDeleteCategoriesView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        categories_ids = request.data.get("categories_ids", [])
        
        # Ensure we have a list of IDs to delete
        if not categories_ids:
            return Response({"error": "No transaction IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete transactions that match the provided IDs
        deleted_count, _ = Category.objects.filter(id__in=categories_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} categories deleted successfully"},
            status=status.HTTP_200_OK
        )

class BatchDeletePublicationView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        publication_ids = request.data.get("publication_ids", [])
        
        # Ensure we have a list of IDs to delete
        if not publication_ids:
            return Response({"error": "No publication IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete transactions that match the provided IDs
        deleted_count, _ = Publication.objects.filter(id__in=publication_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} publication deleted successfully"},
            status=status.HTTP_200_OK
        )
    
class BatchDeleteGroupView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        group_ids = request.data.get("group_ids", [])
        
        # Ensure we have a list of IDs to delete
        if not group_ids:
            return Response({"error": "No group IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete transactions that match the provided IDs
        deleted_count, _ = Group.objects.filter(id__in=group_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} group deleted successfully"},
            status=status.HTTP_200_OK
        )

class UserTransactionsView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    # permission_classes = [IsAdminUser]
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Transaction.objects.filter(author_id=user_id)



class UserCategoriesView(generics.ListAPIView):
    serializer_class = CategorySerializer
    # permission_classes = [IsAdminUser]

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Category.objects.filter(author_id=user_id)


class UserPublicationsView(generics.ListAPIView):
    serializer_class = PublicationSerializer
    # permission_classes = [IsAdminUser]

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Publication.objects.filter(author_id=user_id)
    
class UserGroupsView(generics.ListAPIView):
    serializer_class = GroupSerializer
    # permission_classes = [IsAdminUser]

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
        
        # Ensure we have a list of IDs to delete
        if not comment_ids:
            return Response({"error": "No comments IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete transactions that match the provided IDs
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
# class PublicationNameByCommentView(APIView):
#     permission_classes = [IsAdminUser]

#     def get_queryset(self):
#         # comment = Commnt.o...(ID=ID)
#         # publication_id = comment.publication
#         # publiction = Publication.object.filter(id=id)
#         # pub_name = publication.title
#         # return Response(pub_name)
#         return super().get_queryset()

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
        
        # Ensure we have a list of IDs to delete
        if not thread_ids:
            return Response({"error": "No comments IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete transactions that match the provided IDs
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
    # permission_classes = [IsAdminUser]

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
        
        # Delete transactions that match the provided IDs
        deleted_count, _ = ThreadComment.objects.filter(id__in=comment_ids).delete()
        
        return Response(
            {"message": f"{deleted_count} comments deleted successfully"},
            status=status.HTTP_200_OK
        )
        

class ThreadDetailView(generics.RetrieveAPIView):
    queryset = Thread.objects.all()
    serializer_class = GroupThreadSerializer
   