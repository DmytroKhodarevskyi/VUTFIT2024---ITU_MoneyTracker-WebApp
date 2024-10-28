from django.db import models
from django.contrib.auth.models import User
from api.category.models import Category


class Transaction(models.Model):
    INCOME = 'INCOME'
    EXPENSE = 'EXPENSE'
    TRANSACTION_TYPE_CHOICES = [
        (INCOME, 'Income'),
        (EXPENSE, 'Expense'),
    ]

    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='categories', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    transaction_datetime = models.DateTimeField(default=None)
    currency = models.CharField(max_length=50, default="USD")
    transaction_type = models.CharField(
        max_length=7,
        choices=TRANSACTION_TYPE_CHOICES,
        default=INCOME,
    )
    amount = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    incomeOrSpend = models.BooleanField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions', null=True)

    def __str__(self):
        return f"{self.title} - {self.amount} {self.currency}"
    