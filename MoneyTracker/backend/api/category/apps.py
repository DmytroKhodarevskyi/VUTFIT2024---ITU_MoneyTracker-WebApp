from django.apps import AppConfig

class CatgoryConfig(AppConfig):
    name = 'api.category'
    
    def ready(self):
        import api.category.signals