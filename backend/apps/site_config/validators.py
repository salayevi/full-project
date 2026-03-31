from django.core.validators import RegexValidator

hex_color_validator = RegexValidator(
    regex=r"^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$",
    message="Use a hex color such as #0B1020.",
)

