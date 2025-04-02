from django.utils.deprecation import MiddlewareMixin

class DisableCSRFOnAPI(MiddlewareMixin):
    def process_request(self, request):
        # Отключаем CSRF только для API-запросов
        if request.path.startswith('/password_reset/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
