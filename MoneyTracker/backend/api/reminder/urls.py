from django.urls import path
from .views import ReminderCreateView, ReminderDeleteView, ReminderListView

urlpatterns = [
    path('reminders/create/', ReminderCreateView.as_view(), name='reminder-create'),
    path('reminders/<int:pk>/delete/', ReminderDeleteView.as_view(), name='reminder-delete'),
    path('reminders/', ReminderListView.as_view(), name='reminder-list'),
]