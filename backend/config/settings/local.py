from .base import *

DEBUG = env_bool("DEBUG", True, aliases=("DJANGO_DEBUG",))
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", ["127.0.0.1", "localhost", "testserver"], aliases=("DJANGO_ALLOWED_HOSTS",))

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [
    "rest_framework.renderers.JSONRenderer",
    "rest_framework.renderers.BrowsableAPIRenderer",
]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
