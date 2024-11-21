from django.urls import path
from .views import BatchDeleteRemindersView, ReminderCreateView, ReminderDeleteView, ReminderListView
from .views import GetOldRemindersView, GetUpcomingRemindersView
urlpatterns = [
    path('reminders/create/', ReminderCreateView.as_view(), name='reminder-create'),
    path('reminders/<int:pk>/delete/', ReminderDeleteView.as_view(), name='reminder-delete'),
    path('batchdelete/', BatchDeleteRemindersView.as_view(), name='reminder-delete-batch'),
    path('reminders/', ReminderListView.as_view(), name='reminder-list'),

    path('reminders/old/', GetOldRemindersView.as_view(), name='reminder-old'),
    path('reminders/upcoming/', GetUpcomingRemindersView.as_view(), name='reminder-upcoming'),
]