from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from .models import Group, UserGroup, Thread, ThreadComment
from .serializers import (GroupSerializer, 
                          GroupUpdateSerializer, 
                          UserGroupSerializer, 
                          ThreadSerializer, 
                          ThreadCommentSerializer)

from rest_framework.exceptions import PermissionDenied, NotFound

class GroupCreateView(generics.CreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
          serializer.save(creator=self.request.user)
          
class GroupListView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 

class GroupMyListView(generics.ListAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 
    
    def get_queryset(self):
        user = self.request.user
        return Group.objects.filter(user_groups__user=user)
            
class GroupUpdateView(generics.UpdateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupUpdateSerializer
    permission_classes = [IsAuthenticated] 

    def perform_update(self, serializer):
        group = self.get_object()
        user = self.request.user
        
        if group.creator == user:
            serializer.save()
            return

        if UserGroup.objects.filter(user=user, group=group, role='moderator').exists():
            serializer.save()
            return
        
        raise PermissionDenied("You do not have permission to update this group.")
    
class GroupDeleteView(generics.DestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.creator != self.request.user:
            raise PermissionDenied("You do not have permission to delete this group.")
        
        instance.delete()
        
class AssignModeratorView(generics.UpdateAPIView):
    serializer_class = UserGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        group_id = self.kwargs.get('group_id')
        user_id = self.kwargs.get('user_id')
        try:
            return UserGroup.objects.get(group_id=group_id, user_id=user_id)
        except UserGroup.DoesNotExist:
            raise NotFound("UserGroup not found.")

    def perform_update(self, serializer):
        group = self.get_object().group

        if group.creator != self.request.user:
            raise PermissionDenied("Only the creator can assign moderators.")

        serializer.save(role='moderator')
        
class AssignMemberView(generics.UpdateAPIView):
    serializer_class = UserGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        group_id = self.kwargs.get('group_id')
        user_id = self.kwargs.get('user_id')
        try:
            return UserGroup.objects.get(group_id=group_id, user_id=user_id)
        except UserGroup.DoesNotExist:
            raise NotFound("UserGroup not found.")

    def perform_update(self, serializer):
        group = self.get_object().group

        if group.creator != self.request.user:
            raise PermissionDenied("Only the creator can assign from moderators to members.")

        serializer.save(role='member')
        
class BanUserView(generics.UpdateAPIView):
    serializer_class = UserGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        group_id = self.kwargs.get('group_id')
        user_id = self.kwargs.get('user_id')
        try:
            return UserGroup.objects.get(group_id=group_id, user_id=user_id)
        except UserGroup.DoesNotExist:
            raise NotFound("UserGroup not found.")

    def perform_update(self, serializer):
        user_group = self.get_object()
        group = user_group.group

        requesting_user_group = UserGroup.objects.get(group=group, user=self.request.user)
        
        if group.creator != self.request.user and requesting_user_group.role != 'moderator':
            raise PermissionDenied("Only the creator or a moderator can ban a user.")

        user_group.is_banned = True
        user_group.save()

        serializer.save(is_banned=user_group.is_banned)
        
class UnbanUserView(generics.UpdateAPIView):
    serializer_class = UserGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        group_id = self.kwargs.get('group_id')
        user_id = self.kwargs.get('user_id')
        try:
            return UserGroup.objects.get(group_id=group_id, user_id=user_id)
        except UserGroup.DoesNotExist:
            raise NotFound("UserGroup not found.")

    def perform_update(self, serializer):
        user_group = self.get_object()
        group = user_group.group

        requesting_user_group = UserGroup.objects.get(group=group, user=self.request.user)
        
        if group.creator != self.request.user and requesting_user_group.role != 'moderator':
            raise PermissionDenied("Only the creator or a moderator can unban a user.")

        user_group.is_banned = False
        user_group.save()

        serializer.save(is_banned=user_group.is_banned)
        
class ThreadCreateView(generics.CreateAPIView):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]
    
    
    def perform_create(self, serializer):
        group_id = self.request.data.get('group') 

        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            raise PermissionDenied("Group does not exist.")

        user_group = UserGroup.objects.filter(group=group, user=self.request.user).first()

        if not user_group or (user_group.role != 'moderator' and group.creator != self.request.user):
            raise PermissionDenied("Only the creator or a moderator can create threads in this group.")

        serializer.save(creator=self.request.user, group=group)
        
class ThreadListView(generics.ListAPIView):
    serializer_class = ThreadSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')  
        try:
            group = Group.objects.get(id=group_id)  
        except Group.DoesNotExist:
            raise NotFound("Group not found.")
        
        return Thread.objects.filter(group=group)  

class ThreadUpdateView(generics.UpdateAPIView):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        thread_id = self.kwargs.get('pk') 
        try:
            return Thread.objects.get(id=thread_id)  
        except Thread.DoesNotExist:
            raise NotFound("Thread not found.")

    def perform_update(self, serializer):
        thread = self.get_object()  
        group = thread.group  
        user_group = UserGroup.objects.filter(group=group, user=self.request.user).first()

        if group.creator != self.request.user and (not user_group or user_group.role != 'moderator'):
            raise PermissionDenied("Only the creator or a moderator can update this thread.")

        serializer.save()  
        
class ThreadDeleteView(generics.DestroyAPIView):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        thread_id = self.kwargs.get('pk') 
        try:
            return Thread.objects.get(id=thread_id) 
        except Thread.DoesNotExist:
            raise NotFound("Thread not found.")

    def perform_destroy(self, instance):
        group = instance.group  

        user_group = UserGroup.objects.filter(group=group, user=self.request.user).first()

        if group.creator != self.request.user and (not user_group or user_group.role != 'moderator'):
            raise PermissionDenied("Only the creator or a moderator can delete this thread.")

        instance.delete() 
        
class ThreadDetailView(generics.RetrieveAPIView):
    queryset = Thread.objects.all()  
    serializer_class = ThreadSerializer
    permission_classes = [AllowAny] 

    def get_object(self):
        thread_id = self.kwargs.get('pk')  
        try:
            thread = Thread.objects.get(id=thread_id)  
            return thread  
        except Thread.DoesNotExist:
            raise NotFound("Thread not found.")  
        
class ThreadCommentCreateView(generics.CreateAPIView):
    queryset = ThreadComment.objects.all()
    serializer_class = ThreadCommentSerializer
    permission_classes = [IsAuthenticated]  

    def perform_create(self, serializer):
        thread_id = self.kwargs.get('thread_id')  

        try:
            thread = Thread.objects.get(id=thread_id) 
        except Thread.DoesNotExist:
            raise NotFound("Thread not found")

        serializer.save(author=self.request.user, thread=thread)

class ThreadCommentListView(generics.ListAPIView):
    serializer_class = ThreadCommentSerializer

    def get_queryset(self):
        thread_id = self.kwargs.get('thread_id')  
        return ThreadComment.objects.filter(thread_id=thread_id) 
    
class ThreadCommentDeleteView(generics.DestroyAPIView):
    serializer_class = ThreadCommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = ThreadComment.objects.all()  

    def perform_destroy(self, instance):
        if instance.author == self.request.user:
            instance.delete()
            return

        group = instance.thread.group

        if group.creator == self.request.user:
            instance.delete()
            return

        user_group = UserGroup.objects.filter(group=group, user=self.request.user, role='moderator').first()
        if user_group:
            instance.delete()
            return

        raise PermissionDenied("You do not have permission to delete this comment.")
    
class ThreadCommentDetailView(generics.RetrieveAPIView):
    queryset = ThreadComment.objects.all()
    serializer_class = ThreadCommentSerializer
    permission_classes = [IsAuthenticated] 