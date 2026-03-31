from __future__ import annotations

from django.db import models

from .models import AuditLog


def record_audit_event(
    *,
    action: str,
    message: str,
    actor=None,
    request=None,
    target: models.Model | None = None,
    metadata: dict | None = None,
) -> AuditLog:
    ip_address = None
    user_agent = ""

    if request is not None:
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
        ip_address = forwarded_for.split(",")[0].strip() if forwarded_for else request.META.get("REMOTE_ADDR")
        user_agent = request.META.get("HTTP_USER_AGENT", "")[:255]

    return AuditLog.objects.create(
        actor=actor,
        action=action,
        message=message,
        target_app=target._meta.app_label if target is not None else "",
        target_model=target._meta.model_name if target is not None else "",
        target_object_id=str(target.pk) if target is not None else "",
        metadata=metadata or {},
        ip_address=ip_address,
        user_agent=user_agent,
    )
