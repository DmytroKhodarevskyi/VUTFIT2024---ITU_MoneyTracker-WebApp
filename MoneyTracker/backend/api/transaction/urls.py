from django.urls import path
from .views import (
    TransactionListCreate,
    TransactionDelete,
)

urlpatterns = [
    path("", TransactionListCreate.as_view(), name="transaction-list"),
    path("delete/<int:pk>/", TransactionDelete.as_view(), name="delete-transaction"),
]
