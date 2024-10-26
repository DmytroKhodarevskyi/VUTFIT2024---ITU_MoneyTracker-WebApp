from django.urls import path
# from .views import (
#     TransactionListCreate,
#     TransactionDelete,
# )
from .views import (
    # CustomAdmin,
    check_superuser_status,
    UserDetailView,
    UserListView,
    DeleteUserView
)

urlpatterns = [
    # path("", CustomAdmin, name="custom_admin"),
    path('check_superuser/', check_superuser_status, name='check_superuser_status'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    # path("", TransactionListCreate.as_view(), name="transaction-list"),
    # path("delete/<int:pk>/", TransactionDelete.as_view(), name="delete-transaction"),
    path("users/", UserListView.as_view(), name="user-list"),

    path("users/delete/<int:pk>/", DeleteUserView.as_view(), name="delete-user"),
]
