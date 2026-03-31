from django.urls import path

from .public_views import PublicAchievementListView

urlpatterns = [
    path("", PublicAchievementListView.as_view(), name="public-achievement-list"),
]
