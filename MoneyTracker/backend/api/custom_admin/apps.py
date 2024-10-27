from django.apps import AppConfig

class AdminConfig(AppConfig):
    name = 'api.custom_admin'

    # def ready(self):
    #     import api.admin.signals