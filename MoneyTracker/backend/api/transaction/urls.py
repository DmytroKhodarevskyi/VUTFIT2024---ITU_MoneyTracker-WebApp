from django.urls import path
from .views import (
    TransactionListCreate,
    TransactionDelete,
    RetrieveTransactionView
)

urlpatterns = [
    path("", TransactionListCreate.as_view(), name="transaction-list"),
    path("api/transactions/<int:pk>/", RetrieveTransactionView.as_view(), name="transaction-detail"),
    path("<int:pk>/delete/", TransactionDelete.as_view(), name="delete-transaction"),
]
