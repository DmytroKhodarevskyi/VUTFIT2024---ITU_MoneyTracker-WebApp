from .serializers import PublicationSerializer, MediaSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from .models import Publication, Comment, Media


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
        return Publication.objects.all().order_by('?')  
        

class CreateCommentView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  