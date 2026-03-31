from django.urls import path

from .public_views import PublicProductListView

urlpatterns = [
    path("", PublicProductListView.as_view(), name="public-product-list"),
]

