from .serializers import PublicationSerializer, MediaSerializer, CommentSerializer, StarSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from .models import Publication, Comment, Media, Star


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
        publication_id = self.kwargs.get('publication')
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response({"detail": "Publication not found."}, status=404)

        serializer.save(author=self.request.user, publication=publication)  
        
class CommentaryListView(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        publication_id = self.kwargs.get('publication')
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response({"detail": "Publication not found."}, status=404)
        return Comment.objects.filter(publication=publication)
    
class RetrieveCommentView(generics.RetrieveAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        publication_id = self.kwargs.get('publication')
        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return Response({"detail": "Publication not found."}, status=404)
        return Comment.objects.filter(publication=publication)
    
class UpdateCommentView(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        commentary = super().get_object()
        return commentary

    def update(self, request, *args, **kwargs):
        commentary = self.get_object()

        if commentary.author != request.user:
            return Response({"detail": "You do not have permission to update this comment."}, status=403)

        if 'text' not in request.data:
            return Response({"detail": "Only the text field can be updated."}, status=400)

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(commentary, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
        
class DeleteCommentView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return super().get_object()
    
    def destroy(self, request, *args, **kwargs):
        commentary = self.get_object()
        publication = commentary.publication
        
        if commentary.author == request.user or publication.author == request.user:
            self.perform_destroy(commentary)
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response({"detail": "You do not have permission to delete this comment."}, status=status.HTTP_403_FORBIDDEN)
    
class LikePublicationView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, publication_id):
        try:
            publication = Publication.objects.get(id=publication_id)
            if publication.author == request.user:
                return Response({"detail": "You cannot like your own publication."}, status=status.HTTP_400_BAD_REQUEST)
            
            publication.like(request.user)
            return Response({"detail": "Publication liked."}, status=status.HTTP_201_CREATED)
        except Publication.DoesNotExist:
            return Response({"detail": "Publication not found."}, status=status.HTTP_404_NOT_FOUND)

class UnlikePublicationView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, publication_id):
        try:
            publication = Publication.objects.get(id=publication_id)
            
            if publication.author == request.user:
                return Response({"detail": "You cannot unlike your own publication."}, status=status.HTTP_400_BAD_REQUEST)
            
            publication.unlike(request.user)
            return Response({"detail": "Publication unliked."}, status=status.HTTP_204_NO_CONTENT)
        except Publication.DoesNotExist:
            return Response({"detail": "Publication not found."}, status=status.HTTP_404_NOT_FOUND)
        
class LikeCommentView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            if comment.author == request.user:
                return Response({"detail": "You cannot like your own comment."}, status=status.HTTP_400_BAD_REQUEST)
            
            comment.like(request.user)
            return Response({"detail": "Comment liked."}, status=status.HTTP_201_CREATED)
        except Comment.DoesNotExist:
            return Response({"detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

class UnlikeCommentView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            if comment.author == request.user:
                return Response({"detail": "You cannot unlike your own comment."}, status=status.HTTP_400_BAD_REQUEST)
            
            comment.unlike(request.user)
            return Response({"detail": "Comment unliked."}, status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response({"detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)
        
class StarDetailByUserAndCommentView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StarSerializer

    def get(self, request, user_id, comment_id):
        try:
            star = Star.objects.get(user_id=user_id, comment_id=comment_id)
            serializer = self.serializer_class(star)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Star.DoesNotExist:
            return Response({"detail": "Star not found."}, status=status.HTTP_404_NOT_FOUND)

class StarDetailByPublicationAndUserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StarSerializer

    def get(self, request, user_id, publication_id):
        try:
            star = Star.objects.get(user_id=user_id, publication_id=publication_id)
            serializer = self.serializer_class(star)
            return Response({"detail": "Star found.", "isLiked": True}, status=status.HTTP_200_OK)
        except Star.DoesNotExist:
            return Response({"detail": "Star not found.", "isLiked": False}, status=status.HTTP_200_OK)