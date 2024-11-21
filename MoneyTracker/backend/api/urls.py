from django.urls import path, include

urlpatterns = [    
    path("user/", include("api.profile_user.urls")),
    path("publications/", include("api.publication.urls")),
    path("transactions/", include("api.transaction.urls")),
    path("categories/", include("api.category.urls")),
    path("custom_admin/", include("api.custom_admin.urls")),
    path("groups/", include("api.group.urls")),
    path("reminders/", include("api.reminder.urls"))
]