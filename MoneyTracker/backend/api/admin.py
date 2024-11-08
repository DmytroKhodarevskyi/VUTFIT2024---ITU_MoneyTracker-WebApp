from django.contrib import admin

# Register your models here.
from api.transaction.models import Transaction
from api.category.models import Category
from api.publication.models import Publication
from api.group.models import Group

admin.site.register(Group)
