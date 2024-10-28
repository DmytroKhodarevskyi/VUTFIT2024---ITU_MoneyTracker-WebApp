from rest_framework import generics
from .models import Category
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import CategorySerializer
from rest_framework import status

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
    
    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(author=user)
    
 
class RetrieveCategoryView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        category = super().get_object()
        if category.author != self.request.user and category.name != "Default":
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