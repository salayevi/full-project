from django.urls import path

from .admin_views import AchievementDetailView, AchievementListCreateView

urlpatterns = [
    path("", AchievementListCreateView.as_view(), name="achievement-list"),
    path("<uuid:pk>/", AchievementDetailView.as_view(), name="achievement-detail"),
]
