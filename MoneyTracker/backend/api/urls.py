from django.urls import path
from . import views

urlpatterns = [
    path("transactions/", views.TransactionListCreate.as_view(), name="transaction-list"),
    # path("transactions/create", views.CreateTransactionView.as_view(), name="transaction-create"),
    path("transactions/delete/<int:pk>/", views.TransactionDelete.as_view(), name="delete-transaction"),
    
    path('users/<str:username>/', views.DeleteUserView.as_view(), name="delete-user")
]