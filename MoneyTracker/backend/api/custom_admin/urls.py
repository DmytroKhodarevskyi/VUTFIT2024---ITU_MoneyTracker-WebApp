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

    DeleteUserView,
    BatchDeleteTransactionsView,
    BatchDeleteCategoriesView,

    UserTransactionsView,
    UserCategoriesView,
    UserPublicationsView,
    UsernameSearchView
)

urlpatterns = [
    # path("", CustomAdmin, name="custom_admin"),
    path('check_superuser/', check_superuser_status, name='check_superuser_status'),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/username/", UsernameSearchView.as_view(), name="user-username"),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    path('users/<int:pk>/transactions/', UserTransactionsView.as_view(), name='user-transactions'),
    path('users/<int:pk>/categories/', UserCategoriesView.as_view(), name='user-categories'),
    path('users/<int:pk>/publications/', UserPublicationsView.as_view(), name='user-publications'),
    # path("", TransactionListCreate.as_view(), name="transaction-list"),
    # path("delete/<int:pk>/", TransactionDelete.as_view(), name="delete-transaction"),

    path("users/delete/<int:pk>/", DeleteUserView.as_view(), name="delete-user"),
    path("transactions/batch-delete/", BatchDeleteTransactionsView.as_view(), name="delete-transactions"),
    path("categories/batch-delete/", BatchDeleteCategoriesView.as_view(), name="delete-transactions"),
]
