from datetime import timedelta
import os
from pathlib import Path
from typing import Optional
from urllib.parse import parse_qsl, unquote, urlparse

BASE_DIR = Path(__file__).resolve().parents[2]
REPO_ROOT = BASE_DIR.parent


def load_env_file(path: Path) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].strip()
        if "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key:
            continue
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
            value = value[1:-1]

        os.environ.setdefault(key, value)


for env_path in (
    REPO_ROOT / ".env",
    REPO_ROOT / ".env.local",
    BASE_DIR / ".env",
    BASE_DIR / ".env.local",
):
    load_env_file(env_path)


def env(key: str, default: Optional[str] = None, aliases: Optional[list[str]] = None) -> Optional[str]:
    for candidate in [key, *(aliases or [])]:
        value = os.getenv(candidate)
        if value is not None:
            return value
    return default


def env_required(key: str, aliases: Optional[list[str]] = None) -> str:
    value = env(key, aliases=aliases)
    if value is None or not value.strip():
        raise RuntimeError(f"Missing required environment variable '{key}'.")
    return value.strip()


def env_bool(key: str, default: bool = False, aliases: Optional[list[str]] = None) -> bool:
    value = env(key, aliases=aliases)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(key: str, default: Optional[list[str]] = None, aliases: Optional[list[str]] = None) -> list[str]:
    value = env(key, aliases=aliases)
    if value is None:
        return default or []
    return [item.strip() for item in value.split(",") if item.strip()]


def build_database_from_url(url: str) -> dict:
    normalized_url = url.strip()
    parsed = urlparse(normalized_url)
    scheme = parsed.scheme.lower()

    if scheme in {"postgres", "postgresql", "pgsql"}:
        options = dict(parse_qsl(parsed.query))
        config = {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": parsed.path.lstrip("/"),
            "USER": unquote(parsed.username or ""),
            "PASSWORD": unquote(parsed.password or ""),
            "HOST": parsed.hostname or "127.0.0.1",
            "PORT": str(parsed.port or 5432),
        }
        if options:
            config["OPTIONS"] = options
        return config

    if scheme in {"sqlite", "sqlite3"}:
        if normalized_url in {"sqlite://:memory:", "sqlite:///:memory:"}:
            database_name = ":memory:"
        elif normalized_url.startswith("sqlite:////"):
            database_name = unquote(parsed.path)
        else:
            relative_path = unquote(parsed.path.lstrip("/")) or "db.sqlite3"
            database_name = str((BASE_DIR / relative_path).resolve())
        return {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": database_name,
        }

    raise ValueError(f"Unsupported DATABASE_URL scheme '{parsed.scheme}'.")


def build_database_config() -> dict:
    database_url = env("DATABASE_URL")
    if database_url:
        return build_database_from_url(database_url)

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
APP_NAME = env("APP_NAME", "Azizam Market Backend", aliases=["DJANGO_APP_NAME"])
OPERATOR_DASHBOARD_URL = env_required("OPERATOR_DASHBOARD_URL")
PUBLIC_SITE_URL = env_required("PUBLIC_SITE_URL")
PUBLIC_SITE_PREVIEW_URL = env("PUBLIC_SITE_PREVIEW_URL", PUBLIC_SITE_URL) or PUBLIC_SITE_URL
SECRET_KEY = env("SECRET_KEY", "django-insecure-change-me", aliases=["DJANGO_SECRET_KEY"])
DEBUG = env_bool("DEBUG", False, aliases=["DJANGO_DEBUG"])
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", ["127.0.0.1", "localhost"], aliases=["DJANGO_ALLOWED_HOSTS"])
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", [], aliases=["DJANGO_CSRF_TRUSTED_ORIGINS"])
GOOGLE_CLIENT_ID = env("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = env("GOOGLE_CLIENT_SECRET", "")
TELEGRAM_BOT_TOKEN = env("TELEGRAM_BOT_TOKEN", "")
REDIS_URL = env("REDIS_URL", "")
MEDIA_STORAGE_BACKEND_RAW = env("MEDIA_STORAGE_BACKEND", "local", aliases=["MEDIA_BACKEND"]).strip()
MEDIA_STORAGE_BACKEND = MEDIA_STORAGE_BACKEND_RAW.lower()

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

if MEDIA_STORAGE_BACKEND == "s3":
    INSTALLED_APPS.append("storages")

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
MEDIA_URL = env("MEDIA_URL", "/media/")
MEDIA_ROOT = BASE_DIR / "media"

if MEDIA_STORAGE_BACKEND == "s3":
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3.S3Storage",
            "OPTIONS": {
                "access_key": env("AWS_ACCESS_KEY_ID", ""),
                "secret_key": env("AWS_SECRET_ACCESS_KEY", ""),
                "bucket_name": env("AWS_STORAGE_BUCKET_NAME", ""),
                "region_name": env("AWS_S3_REGION_NAME", ""),
                "default_acl": None,
                "querystring_auth": env_bool("AWS_QUERYSTRING_AUTH", False),
                "custom_domain": env("AWS_S3_CUSTOM_DOMAIN", "") or None,
                "file_overwrite": False,
                "location": env("AWS_MEDIA_LOCATION", "media"),
            },
        },
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }
else:
    default_storage_backend = "django.core.files.storage.FileSystemStorage"
    custom_storage_backend = MEDIA_STORAGE_BACKEND_RAW
    if custom_storage_backend and MEDIA_STORAGE_BACKEND not in {"local", "s3"}:
        default_storage_backend = custom_storage_backend

    STORAGES = {
        "default": {
            "BACKEND": default_storage_backend,
        },
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "accounts.User"
LOGIN_URL = "admin:login"
LOGIN_REDIRECT_URL = "/admin/"

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    [],
)
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
