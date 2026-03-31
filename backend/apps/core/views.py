from django.conf import settings
from django.views.generic import RedirectView, TemplateView


class BackendStatusView(TemplateView):
    template_name = "core/status.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(
            {
                "app_name": settings.APP_NAME,
                "environment": settings.ENVIRONMENT,
                "admin_url": "/admin/",
                "dashboard_url": "/dashboard/",
                "operator_dashboard_url": settings.OPERATOR_DASHBOARD_URL,
                "api_url": "/api/v1/",
                "admin_api_url": "/api/v1/admin/",
                "public_api_url": "/api/v1/public/",
                "health_url": "/api/v1/health/",
            }
        )
        return context


class OperatorDashboardRedirectView(RedirectView):
    permanent = False
    query_string = True

    def get_redirect_url(self, *args, **kwargs):
        path = (kwargs.get("path") or "").strip("/")
        base_url = settings.OPERATOR_DASHBOARD_URL.rstrip("/")
        if path:
            return f"{base_url}/{path}/"
        return f"{base_url}/"
