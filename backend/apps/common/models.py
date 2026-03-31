import uuid

from django.db import models
from django.utils import timezone

from .constants import PublishState, VisibilityState
from .querysets import PublishableQuerySet


class UUIDPrimaryKeyModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("-created_at",)


class BaseModel(UUIDPrimaryKeyModel, TimestampedModel):
    class Meta:
        abstract = True


class SortableModel(models.Model):
    sort_order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        abstract = True
        ordering = ("sort_order", "created_at")


class VisibilityControlledModel(models.Model):
    visibility_state = models.CharField(
        max_length=16,
        choices=VisibilityState.choices,
        default=VisibilityState.VISIBLE,
        db_index=True,
    )

    class Meta:
        abstract = True


class PublishableModel(models.Model):
    publish_state = models.CharField(
        max_length=16,
        choices=PublishState.choices,
        default=PublishState.DRAFT,
        db_index=True,
    )
    published_at = models.DateTimeField(blank=True, null=True)

    objects = PublishableQuerySet.as_manager()

    class Meta:
        abstract = True

    def publish(self):
        self.publish_state = PublishState.PUBLISHED
        if self.published_at is None:
            self.published_at = timezone.now()

    def unpublish(self):
        if self.publish_state == PublishState.PUBLISHED:
            self.publish_state = PublishState.DRAFT
            self.published_at = None

    def save(self, *args, **kwargs):
        if self.publish_state == PublishState.PUBLISHED and self.published_at is None:
            self.published_at = timezone.now()
        elif self.publish_state != PublishState.PUBLISHED:
            self.published_at = None
        super().save(*args, **kwargs)
