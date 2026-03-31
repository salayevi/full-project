from django.contrib import admin

from .models import PreviewSession

admin.site.site_header = "Azizam Market Django Admin"
admin.site.site_title = "Azizam Backend Admin"
admin.site.index_title = "Internal administration"
admin.site.enable_nav_sidebar = True


@admin.register(PreviewSession)
class PreviewSessionAdmin(admin.ModelAdmin):
    list_display = ("module", "token", "actor", "expires_at", "created_at")
    search_fields = ("module", "token", "actor__email")
    readonly_fields = ("id", "token", "created_at", "updated_at", "snapshot")
