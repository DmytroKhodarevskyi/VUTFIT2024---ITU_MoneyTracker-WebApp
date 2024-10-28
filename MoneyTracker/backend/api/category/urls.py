from django.urls import path
from .views import (
    CreateCategoryView,
    ListCategoryView,
    RetrieveCategoryView,
    UpdateCategoryView,
    DeleteCategoryView
)

urlpatterns = [
    path("create/", CreateCategoryView.as_view(), name="category-create"),
    path("", ListCategoryView.as_view(), name="category-list"),
    path("<int:pk>/", RetrieveCategoryView.as_view(), name="category-detail"),
    path("<int:pk>/update/", UpdateCategoryView.as_view(), name="category-udate"),
    path("<int:pk>/delete/", DeleteCategoryView.as_view(), name="category-delete"),
]
 
