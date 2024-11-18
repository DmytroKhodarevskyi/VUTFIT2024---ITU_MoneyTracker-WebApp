from django.apps import AppConfig

class ProfileUserConfig(AppConfig):
    name = 'api.profile_user'
    
    def ready(self):
        import api.profile_user.signals 