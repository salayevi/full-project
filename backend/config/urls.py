from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from apps.core.views import BackendStatusView, OperatorDashboardRedirectView

urlpatterns = [
    path("", BackendStatusView.as_view(), name="backend-home"),
    path("admin/", admin.site.urls),
    path("dashboard/", OperatorDashboardRedirectView.as_view(), name="operator-dashboard-redirect"),
    re_path(r"^dashboard/(?P<path>.*)$", OperatorDashboardRedirectView.as_view(), name="operator-dashboard-redirect-path"),
    path("api/v1/", include("config.api")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
