from django.db import models

from .constants import PublishState, VisibilityState


class PublishableQuerySet(models.QuerySet):
    def published(self):
        return self.filter(publish_state=PublishState.PUBLISHED)

    def active(self):
        return self.exclude(publish_state=PublishState.ARCHIVED)

    def visible(self):
        if hasattr(self.model, "visibility_state"):
            return self.filter(visibility_state=VisibilityState.VISIBLE)
        return self.all()

    def public(self):
        return self.published().visible()
