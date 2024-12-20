from .serializers import TransactionSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Transaction 


class TransactionListCreate(generics.ListCreateAPIView):
	serializer_class = TransactionSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		user = self.request.user
		return Transaction.objects.filter(author=user).order_by('-transaction_datetime')
	
	def perform_create(self, serializer):
		if serializer.is_valid():
			serializer.save(author=self.request.user)
		else:
			print(serializer.errors)
 
 
class RetrieveTransactionView(generics.RetrieveAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        transaction = super().get_object()
        if transaction.author != self.request.user:
            raise PermissionError({"detail": "You do not have permission to view this transaction."})
        return transaction  
  
class TransactionDelete(generics.DestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(author=user)