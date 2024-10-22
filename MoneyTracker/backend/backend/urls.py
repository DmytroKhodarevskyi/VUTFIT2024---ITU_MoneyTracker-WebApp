"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views import CreateUserView, UserProfileView, UserProfileDetailView, GenderChoiceView, UserProfilePhotoView
from api.views import CreatePublicationView, CreateCommentView, PublicationListView, PublicationsFeedListView
from api.views import SelectedUserProfileView, DeletePublicationView, UpdatePublicationView, PublicationDetailView
from api.views import CreateCategoryView, ListCategoryView, UpdateCategoryView, RetrieveCategoryView, DeleteCategoryView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),

    path("api/user/profile/", UserProfileView.as_view(), name="user_profile"),
    path('api/user/profile/<int:user_id>/', SelectedUserProfileView.as_view(), name='user-profile-selected'),
    path("api/user/profile_detail/", UserProfileDetailView.as_view(), name="user_profile_detail"),
    path("api/user/profile-photo/", UserProfilePhotoView.as_view(), name="profile-photo"),
    path("api/gender-choices/", GenderChoiceView.as_view(), name="gender-choices"),

    path("api/publications/", CreatePublicationView.as_view(), name="create_publication"),
    path("api/publications/my/", PublicationListView.as_view(), name="list_user_publications"), 
    path("api/publications/feed/", PublicationsFeedListView.as_view(), name="list_feed_publications"), 
    path("api/publications/<int:pk>/delete/", DeletePublicationView.as_view(), name="delete_publication"),
    path("api/publications/<int:pk>/update/", UpdatePublicationView.as_view(), name="update_publication"),
    path("api/publications/<int:pk>/", PublicationDetailView.as_view(), name="detail_publication"),
    path("api/comments/", CreateCommentView.as_view(), name="create_comment"),
    
    path("api/categories/create/", CreateCategoryView.as_view(), name="category-create"),
    path("api/categories/", ListCategoryView.as_view(), name="category-list"),
    path("api/categories/<int:pk>/", RetrieveCategoryView.as_view(), name="category-detail"),
    path("api/categories/<int:pk>/update/", UpdateCategoryView.as_view(), name="category-udate"),
    path("api/categories/<int:pk>/delete/", DeleteCategoryView.as_view(), name="category-delete"),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
