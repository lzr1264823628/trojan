from django.contrib.auth import login
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db.models import Q
from django.forms import forms

from django import forms

from .custom_tool.UsernameValidate import validate_username
from user.models import Users

USER_SESSION_EXPIRES = 60 * 60 * 12


class LoginForm(forms.Form):
    username = forms.CharField(label="用户名/邮箱", max_length=20, min_length=6, validators=[validate_username])
    password = forms.CharField(label="密码", min_length=6, max_length=25,
                               error_messages={"min_length": "密码长度最短7", "max_length": "密码长度最高8"})

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(LoginForm, self).__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")
        password = cleaned_data.get("password")
        remember = cleaned_data.get("remember_me")
        user_queryset = Users.objects.filter(Q(username=username) | Q(email=username))
        if user_queryset:
            user = user_queryset.first()
            if user.check_password(password):
                if remember:
                    self.request.session.set_expiry(None)
                else:
                    self.request.session.set_expiry(USER_SESSION_EXPIRES)
                login(self.request, user)
            else:
                raise forms.ValidationError("密码错误")
        else:
            raise forms.ValidationError("账户不存在")


class RegisterForm(forms.Form):
    username = forms.CharField(min_length=6, max_length=20, validators=[UnicodeUsernameValidator])
    email = forms.EmailField(max_length=150)
    password = forms.CharField(label="密码", min_length=6, max_length=25)
    repeat_password = forms.CharField(label="确认密码")

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")
        password = cleaned_data.get("password")
        repeat_password = cleaned_data.get("repeat_password")
        email = cleaned_data.get("email")
        if not password:
            raise forms.ValidationError("密码为空")
        if password != repeat_password:
            raise forms.ValidationError("两次密码输入不一致")
        users = Users.objects.filter(Q(username=username) | Q(email=email)).first()
        if users:
            if username == users.username:
                raise forms.ValidationError("用户名已存在")
            if email == users.email:
                raise forms.ValidationError("邮箱已被注册")
