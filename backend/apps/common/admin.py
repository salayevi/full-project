class BaseAdminMixin:
    readonly_fields = ("id", "created_at", "updated_at")


class PublishableAdminMixin:
    list_filter = ("publish_state",)


class VisibilityAdminMixin:
    list_filter = ("visibility_state",)


class SortableAdminMixin:
    ordering = ("sort_order", "created_at")
