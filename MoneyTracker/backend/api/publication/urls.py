from django.urls import path
from .views import (
    CreatePublicationView,
    CommentaryListView,
    RetrieveCommentView,
    UpdateCommentView,
    DeleteCommentView,
    PublicationListView,
    PublicationsFeedListView,
    DeletePublicationView,
    UpdatePublicationView,
    PublicationDetailView,
    CreateCommentView,
    LikePublicationView,
    UnlikePublicationView,
    LikeCommentView,
    UnlikeCommentView
)

urlpatterns = [
    path("", CreatePublicationView.as_view(), name="create_publication"),
    path("my/", PublicationListView.as_view(), name="list_user_publications"),
    path("feed/", PublicationsFeedListView.as_view(), name="list_feed_publications"),
    path("<int:pk>/delete/", DeletePublicationView.as_view(), name="delete_publication"),
    path("<int:pk>/update/", UpdatePublicationView.as_view(), name="update_publication"),
    path("<int:pk>/", PublicationDetailView.as_view(), name="detail_publication"),
    path('<int:publication>/comments/create/', CreateCommentView.as_view(), name='commentary_create'),
    path('<int:publication>/comments/', CommentaryListView.as_view(), name="commentaries_list"),
    path('<int:publication>/comments/<int:pk>/', RetrieveCommentView.as_view(), name='commentary_detail'),
    path('<int:publication>/comments/<int:pk>/update/', UpdateCommentView.as_view(), name='commentary_update'),
    path('<int:publication>/comments/<int:pk>/delete/', DeleteCommentView.as_view(), name='commentary_delete'),
    path('<int:publication_id>/like/', LikePublicationView.as_view(), name='like_publication'),
    path('<int:publication_id>/unlike/', UnlikePublicationView.as_view(), name='unlike_publication'),
    path('comments/<int:comment_id>/like/', LikeCommentView.as_view(), name='like_comment'),
    path('comments/<int:comment_id>/unlike/', UnlikeCommentView.as_view(), name='unlike_comment'),
]
