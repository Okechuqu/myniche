from apps.scripts.models import Script


class QuotaService:
    @staticmethod
    def can_generate_script(user):
        used = Script.objects.filter(user=user).count()
        return used < user.script_quota

    @staticmethod
    def can_generate_scripts(user, count=1):
        used = Script.objects.filter(user=user).count()
        return used + count <= user.script_quota

    @staticmethod
    def remaining_scripts(user):
        used = Script.objects.filter(user=user).count()
        return max(user.script_quota - used, 0)
