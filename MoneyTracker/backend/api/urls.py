from django.urls import path, include

urlpatterns = [    
    path("user/", include("api.profile_user.urls")),
    path("publications/", include("api.publication.urls")),
    path("transactions/", include("api.transaction.urls")),
    path("categories/", include("api.category.urls")),
]