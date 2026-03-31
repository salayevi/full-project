from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.common.models import BaseModel

from .managers import UserManager


class UserRole(models.TextChoices):
    SUPER_ADMIN = "super_admin", "Super Admin"
    ADMIN = "admin", "Admin"
    EDITOR = "editor", "Editor"
    VIEWER = "viewer", "Viewer"


class User(BaseModel, AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=32, choices=UserRole.choices, default=UserRole.ADMIN)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    objects = UserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ("email",)

    def __str__(self) -> str:
        full_name = self.get_full_name().strip()
        return full_name or self.email

