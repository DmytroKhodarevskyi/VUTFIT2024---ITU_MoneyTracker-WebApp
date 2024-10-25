from django.urls import path
from .views import (
    CreatePublicationView,
    PublicationListView,
    PublicationsFeedListView,
    DeletePublicationView,
    UpdatePublicationView,
    PublicationDetailView,
    CreateCommentView,
)

urlpatterns = [
    path("", CreatePublicationView.as_view(), name="create_publication"),
    path("my/", PublicationListView.as_view(), name="list_user_publications"),
    path("feed/", PublicationsFeedListView.as_view(), name="list_feed_publications"),
    path("<int:pk>/delete/", DeletePublicationView.as_view(), name="delete_publication"),
    path("<int:pk>/update/", UpdatePublicationView.as_view(), name="update_publication"),
    path("<int:pk>/", PublicationDetailView.as_view(), name="detail_publication"),
    path("comments/", CreateCommentView.as_view(), name="create_comment"),
]
