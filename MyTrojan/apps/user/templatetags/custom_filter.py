from django import template

register = template.Library()


@register.filter
def to_mb(value):
    if isinstance(value, str):
        return value
    else:
        if value == -1:
            return "Infinite"
        value /= (1024 * 1024)
        return float("{:.2f}".format(value))
