from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
# from .serializers import UserSerializer, NoteSerializer
from .serializers import UserSerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
# from .models import Note
from .models import Transaction

from rest_framework.permissions import IsAdminUser

from rest_framework.views import APIView
from rest_framework.response import Response


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username  # Assuming the nickname is stored in the username field
        })

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
		return Transaction.objects.filter(author=user)
	
	def perform_create(self, serializer):
		if serializer.is_valid():
			serializer.save(author=self.request.user)
		else:
			print(serializer.errors)

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

# Create your views here.
