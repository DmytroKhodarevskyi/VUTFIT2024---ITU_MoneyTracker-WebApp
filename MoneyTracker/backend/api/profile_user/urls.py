from django.urls import path
from .views import (
    CreateUserView,
    UserProfileView,
    SelectedUserProfileView,
    UserProfileDetailView,
    UserProfilePhotoView,
    GenderChoiceView,
    UserDeleteView,
    UserListView
)

urlpatterns = [
    path("register/", CreateUserView.as_view(), name="register"),
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    path("profile/<int:user_id>/", SelectedUserProfileView.as_view(), name="user_profile_selected"),
    path("profile_detail/", UserProfileDetailView.as_view(), name="user_profile_detail"),
    path("profile-photo/", UserProfilePhotoView.as_view(), name="user_profile_photo"),
    path("gender-choices/", GenderChoiceView.as_view(), name="gender_choices"),
    path('delete/', UserDeleteView.as_view(), name='delete_user'),
    path('usernames-and-phones/', UserListView.as_view(), name='usernames_and_phones'),
]