from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from .models import Group, UserGroup, Thread, ThreadComment
from .serializers import (GroupSerializer, 
                          GroupUpdateSerializer, 
                          UserGroupSerializer, 
                          ThreadSerializer, 
                          ThreadCommentSerializer)

from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class GroupCreateView(generics.CreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        user_profile = self.request.user.profile  
        
        if user_profile.stars_count < 1:
            raise PermissionDenied("You must have at least 1 star to create a group.")

        serializer.save(creator=self.request.user)

class GroupDataView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated
    serializer_class = GroupSerializer

    def get(self, request, group_id):
        try:
            # Retrieve the group by the specified group_id
            group = Group.objects.get(id=group_id)
            base_url = request.build_absolute_uri('/')[:-1]
            # Return the group data
            serializer = self.serializer_class(group)
            # return Group.objects.get(id=group_id)
            return Response({
                "group": serializer.data,
                "base_url": base_url
            }, status=status.HTTP_200_OK)
        
        except Group.DoesNotExist:
            # Return 404 if the group does not exist
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

class GroupCreatorGetView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]  # Ensure the user is authenticated

    def get(self, request, group_id):
        try:
            # Retrieve the group by the specified group_id
            group = Group.objects.get(id=group_id)
            
            # Return the creator of the group
            creator = group.creator

            profile_picture = creator.profile.profile_image.url
            name_surname = creator.first_name + " " + creator.last_name

            # Return the creator's username
            # return Group.objects.get(id=group_id).creator.username
            return Response({
                "creator": name_surname,
                "profile_picture": profile_picture
            }, status=status.HTTP_200_OK)
        
        except Group.DoesNotExist:
            # Return 404 if the group does not exist
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

class GroupCreatorCheckView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request, group_id):
        try:
            # Retrieve the group by the specified group_id
            group = Group.objects.get(id=group_id)
            
            # Check if the creator of the group matches the logged-in user
            moderators = UserGroup.objects.filter(group=group, role='moderator')
            is_moderator = request.user in [moderator.user for moderator in moderators]
            is_creator = group.creator == request.user
            
            # Return response indicating if the logged-in user is the creator
            return Response({
                "is_creator": is_creator,
                "is_moderator": is_moderator
            }
            , status=status.HTTP_200_OK)
        
        except Group.DoesNotExist:
            # Return 404 if the group does not exist
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
          
class GroupListView(generics.ListAPIView):
    # queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def get_queryset(self):
        queryset = Group.objects.all()
        search = self.request.query_params.get('search', None)
        subscribed_only = self.request.query_params.get('subscribed_only', None)
        user = self.request.user

        if search:
            queryset = queryset.filter(name__icontains=search)

        if subscribed_only:
            user_groups = UserGroup.objects.filter(user=user)
            group_ids = [user_group.group_id for user_group in user_groups]
            queryset = queryset.filter(id__in=group_ids)

        return queryset

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

# class GroupSubscribeUserView(generics.UpdateAPIView):
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_update(self, group_id, serializer):
#         group = Group.objects.get(id=group_id)
#         user_group = UserGroup.objects.filter(group=group, user=self.request.user).first()
#         user = self.request.user
#         group.subscribe()
#         serializer.save(
#             subscribers_count=group.subscribers_count,

#             )

class GroupSubscribeUserView(generics.CreateAPIView):
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        group_id = self.kwargs.get('group_id')

        user_group = UserGroup.objects.filter(group_id=group_id, user=self.request.user).first()
        if user_group:
            raise PermissionDenied("You are already subscribed to this group.")

        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            raise NotFound("Group not found.")
        
        group.subscribe()

        serializer.save(
            user=self.request.user,
            group=group,
            role='member',
        )

class GroupUnsubscribeUserView(generics.DestroyAPIView):
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        group_id = self.kwargs.get('group_id')
        try:
            return UserGroup.objects.get(group_id=group_id, user=self.request.user)
        except UserGroup.DoesNotExist:
            raise NotFound("You are not subscribed.")

    def perform_destroy(self, instance):
        group = Group.objects.get(id=instance.group_id)
        group.unsubscribe()
        instance.delete()
        
class GroupCheckSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
            is_subscribed = UserGroup.objects.filter(group=group, user=request.user).exists()
            return Response({
                "is_subscribed": is_subscribed
            }, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            raise NotFound("Group not found.")


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
        
class UnassignModeratorView(generics.UpdateAPIView):
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
            raise PermissionDenied("Only the creator can remove moderators.")
        
        serializer.save(role='member')
        
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
        
        if (group.creator == self.request.user):
            self._set_media(serializer)
            serializer.save(creator=self.request.user, group=group)
            return
        
        if (user_group.role == 'moderator'):
            self._set_media(serializer)
            serializer.save(creator=self.request.user, group=group)
            return
    
        raise PermissionDenied("Only the creator or a moderator can create threads in this group.")
    
    def _set_media(self, serializer):
        media_file = self.request.FILES.get('media')  

        if media_file:
 
            if media_file.content_type.startswith('image'):
                serializer.validated_data['media_type'] = 'image'
            elif media_file.content_type.startswith('video'):
                serializer.validated_data['media_type'] = 'video'
            elif media_file.content_type == 'image/gif':
                serializer.validated_data['media_type'] = 'gif'

            serializer.validated_data['media_file'] = media_file


        
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

class ThreadCommentCountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, thread_id):
        try:
            thread = Thread.objects.get(id=thread_id)
        except Thread.DoesNotExist:
            raise NotFound("Thread not found.")

        comments_count = thread.comments.count()

        return Response({
            "comments_count": comments_count
        }, status=status.HTTP_200_OK) 
    
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
    
class GroupMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        try:
            members = UserGroup.objects.filter(group_id=group_id).order_by('role')
            serializer = UserGroupSerializer(members, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
        
class UserRoleCheckView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        user_id = self.kwargs.get('user_id')

        try:
            user_group = UserGroup.objects.filter(group_id=group_id, user_id=user_id).first()
            
            if not user_group:
                return Response(
                    {"message": "User is not part of this group."},
                    status=200
                )

            if user_group.role in ['creator', 'moderator']:
                return Response(
                    {"message": f"The user is a {user_group.role}."},
                    status=200
                )
            else:
                return Response(
                    {"message": "This user is not a moderator or creator."},
                    status=200
                )
        except Exception as e:
            return Response(
                {"message": f"An error occurred: {str(e)}"},
                status=500
            )