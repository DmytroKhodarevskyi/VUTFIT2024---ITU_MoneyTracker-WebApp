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

from .serializers import (
    UserSerializer, 
    TransactionSerializer,
    CategorySerializer, 
    PublicationSerializer
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