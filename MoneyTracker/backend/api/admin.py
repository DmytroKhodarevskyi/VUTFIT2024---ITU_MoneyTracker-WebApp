from django.contrib import admin

# Register your models here.
from api.transaction.models import Transaction
from api.category.models import Category
from api.publication.models import Publication
from api.group.models import Group
from api.profile_user.models import Profile

admin.site.register(Group)
admin.site.register(Category)
admin.site.register(Transaction)
admin.site.register(Publication)
admin.site.register(Profile)
