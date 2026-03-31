from django.urls import path

from .admin_views import MediaAssetDetailView, MediaAssetListCreateView

urlpatterns = [
    path("", MediaAssetListCreateView.as_view(), name="media-asset-list"),
    path("<uuid:pk>/", MediaAssetDetailView.as_view(), name="media-asset-detail"),
]

