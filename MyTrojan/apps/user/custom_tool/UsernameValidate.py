from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
import re


def validate_username(value):
    if not re.match(r"^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$|[a-zA-Z\d_.]{6,20}", value):
        raise ValidationError(
            "登录格式错误",  # gettext:_() 使用它来保证国际性
            code='invalid',  # 向构造函数提供描述性错误代码
            params={'value': '42'},  # 不要强迫变量进入消息;使用占位符和构造函数的params参数,params里使用字典
        )
