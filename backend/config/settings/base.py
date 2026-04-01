from datetime import timedelta
import os
from pathlib import Path
from typing import Optional
from urllib.parse import unquote, urlparse

BASE_DIR = Path(__file__).resolve().parents[2]


def load_env_file(path: Path, *, override: bool = False) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if not key:
            continue
        if override or key not in os.environ:
            os.environ[key] = value


load_env_file(BASE_DIR / ".env")
load_env_file(BASE_DIR / ".env.local", override=True)


def env_first(*keys: str, default: Optional[str] = None) -> Optional[str]:
    for key in keys:
        value = os.getenv(key)
        if value is not None and value != "":
            return value
    return default


def env(key: str, default: Optional[str] = None) -> Optional[str]:
    return env_first(key, default=default)


def env_required(name: str, aliases: tuple[str, ...] = ()) -> str:
    value = env_first(name, *aliases)
    if value is None or not value.strip():
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value.strip()


def env_bool(key: str, default: bool = False, aliases: tuple[str, ...] = ()) -> bool:
    value = env_first(key, *aliases)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(key: str, default: Optional[list[str]] = None, aliases: tuple[str, ...] = ()) -> list[str]:
    value = env_first(key, *aliases)
    if value is None:
        return default or []
    return [item.strip() for item in value.split(",") if item.strip()]


def parse_database_url(database_url: str) -> dict:
    parsed = urlparse(database_url)
    scheme = parsed.scheme.lower()

    if scheme in {"sqlite", "sqlite3"}:
        path = unquote(parsed.path or "")
        if parsed.netloc and path:
            path = f"/{parsed.netloc}{path}"
        elif parsed.netloc and not path:
            path = parsed.netloc
        if not path or path == "/":
            path = str(BASE_DIR / "db.sqlite3")
        elif path.startswith("//"):
            path = path[1:]
        elif path.startswith("/"):
            path = str(BASE_DIR / path.lstrip("/"))
        return {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": path,
        }

    engine_map = {
        "postgres": "django.db.backends.postgresql",
        "postgresql": "django.db.backends.postgresql",
        "mysql": "django.db.backends.mysql",
    }

    engine = engine_map.get(scheme)
    if engine is None:
        raise RuntimeError(
            "Unsupported DATABASE_URL scheme. Supported values are sqlite, postgres, postgresql, and mysql."
        )

    return {
        "ENGINE": engine,
        "NAME": unquote(parsed.path.lstrip("/")),
        "USER": unquote(parsed.username or ""),
        "PASSWORD": unquote(parsed.password or ""),
        "HOST": parsed.hostname or "",
        "PORT": str(parsed.port or ""),
    }


def build_database_config() -> dict:
    database_url = env("DATABASE_URL")
    if database_url:
        return parse_database_url(database_url)

    engine = env("DB_ENGINE", "django.db.backends.sqlite3")
    if engine == "django.db.backends.sqlite3":
        return {
            "ENGINE": engine,
            "NAME": str(BASE_DIR / env("DB_NAME", "db.sqlite3")),
        }

    return {
        "ENGINE": engine,
        "NAME": env("DB_NAME", ""),
        "USER": env("DB_USER", ""),
        "PASSWORD": env("DB_PASSWORD", ""),
        "HOST": env("DB_HOST", "127.0.0.1"),
        "PORT": env("DB_PORT", "5432"),
    }


ENVIRONMENT = env("DJANGO_ENV", "local")
APP_NAME = env("DJANGO_APP_NAME", "Azizam Market Backend")
OPERATOR_DASHBOARD_URL = env_required("OPERATOR_DASHBOARD_URL")
PUBLIC_SITE_URL = env_required("PUBLIC_SITE_URL")
PUBLIC_SITE_PREVIEW_URL = env("PUBLIC_SITE_PREVIEW_URL", PUBLIC_SITE_URL)
PUBLIC_SITE_PREVIEW_QUERY_KEY = env("PUBLIC_SITE_PREVIEW_QUERY_KEY", "preview_token")
SECRET_KEY = env_required("SECRET_KEY", aliases=("DJANGO_SECRET_KEY",))
DEBUG = env_bool("DEBUG", False, aliases=("DJANGO_DEBUG",))
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", ["127.0.0.1", "localhost"], aliases=("DJANGO_ALLOWED_HOSTS",))
CSRF_TRUSTED_ORIGINS = env_list("DJANGO_CSRF_TRUSTED_ORIGINS", [])
GOOGLE_CLIENT_ID = env("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = env("GOOGLE_CLIENT_SECRET", "")
TELEGRAM_BOT_TOKEN = env("TELEGRAM_BOT_TOKEN", "")
REDIS_URL = env("REDIS_URL", "")
MEDIA_STORAGE_BACKEND = env_first("MEDIA_BACKEND", "MEDIA_STORAGE_BACKEND", default="local")
STORAGE_BUCKET_NAME = env("STORAGE_BUCKET_NAME", "")
STORAGE_REGION = env("STORAGE_REGION", "")
STORAGE_ENDPOINT_URL = env("STORAGE_ENDPOINT_URL", "")

INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "apps.common",
    "apps.core",
    "apps.accounts",
    "apps.audit",
    "apps.site_config",
    "apps.media_library",
    "apps.hero",
    "apps.about",
    "apps.products",
    "apps.achievements",
    "apps.footer",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {"default": build_database_config()}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = env("DJANGO_TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "accounts.User"
LOGIN_URL = "admin:login"
LOGIN_REDIRECT_URL = "/admin/"

CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", [])
CORS_ALLOW_CREDENTIALS = False

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(env("JWT_ACCESS_MINUTES", "30"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(env("JWT_REFRESH_DAYS", "7"))),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "UPDATE_LAST_LOGIN": True,
}

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        }
    },
    "root": {
        "handlers": ["console"],
        "level": env("DJANGO_LOG_LEVEL", "INFO"),
    },
}
