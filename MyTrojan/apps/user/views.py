from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.urls import reverse

from django.views import View
import json

from user.models import Users
from .forms import LoginForm, RegisterForm
from user.custom_tool.json_response import to_json_data
from user.custom_tool.res_code import Code, error_map


class LoginView(View):
    def get(self, request):
        # if request.session.exists("session_key"):
        #     return render(request, 'user/home.html')
        if request.user.is_authenticated:
            return redirect(reverse("user:home"))
        return render(request, 'user/login.html')

    def post(self, request):
        json_data = request.body
        if not json_data:
            return to_json_data(errno=Code.PARAMERR, msg=error_map[Code.PARAMERR])
        dict_data = json.loads(json_data.decode('utf8'))
        form = LoginForm(data=dict_data, request=request)
        if form.is_valid():
            return to_json_data(msg="登录成功")
        else:
            error_map_list = []
            for item in form.errors.get_json_data().values():
                error_map_list.append(item[0].get('message'))
            return to_json_data(errno=Code.PARAMERR, msg="&".join(error_map_list))


class Register(View):
    def get(self, request):
        if request.user.is_authenticated:
            return redirect(reverse("user:home"))
        return render(request, 'user/register.html')

    def post(self, request):
        json_data = request.body
        if not json_data:
            return to_json_data(errno=Code.PARAMERR, msg=error_map[Code.PARAMERR])
        # 将json转化为dict
        dict_data = json.loads(json_data.decode('utf8'))
        form = RegisterForm(data=dict_data)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            email = form.cleaned_data.get('email')
            user = Users.objects.create_user(username=username, password=password, email=email, quota=1024000000)
            login(request, user)
            return to_json_data(msg="注册成功")
        else:
            # 定义一个错误信息列表
            err_msg_list = []
            for item in form.errors.get_json_data().values():
                err_msg_list.append(item[0].get('message'))
            err_msg_str = '&'.join(err_msg_list)
            return to_json_data(errno=Code.PARAMERR, msg=err_msg_str)


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect(reverse("user:home"))


class HomePage(View):
    def get(self, request):
        if request.user.is_anonymous:
            return redirect(reverse("user:login"))
        left = request.user.quota - request.user.upload - request.user.download
        if left < 0:
            left = 0
        if request.user.quota == -1:
            left = 'Infinite'

        return render(request, "user/home.html",
                      context={
                          "left": left})


def verify_email(request, email):
    if request.method != 'GET':
        return to_json_data(Code.METHERR, "错误")
    return to_json_data(data={"email": email, "count": Users.objects.filter(email=email).count()})


def verify_username(request, username):
    if request.method != 'GET':
        return to_json_data(Code.METHERR, "错误")
    return to_json_data(data={"username": username, "count": Users.objects.filter(username=username).count()})


def get_user_data(request):
    if request.user.is_anonymous:
        return to_json_data(Code.ROLEERR, msg="用户未登录")
    left = request.user.quota - request.user.upload - request.user.download
    if left < 0:
        left = 0
    if request.user.quota == -1:
        left = 'Infinite'
    return to_json_data(
        data={'quota': 'Infinite' if request.user.quota == -1 else request.user.quota, 'upload': request.user.upload,
              'download': request.user.download,
              'left': left,
              'username': request.user.username, 'email': request.user.email})


def set_password(request):
    if request.user.is_anonymous:
        return to_json_data(Code.ROLEERR, msg="用户未登录")
    username = request.user.username
    json_data = request.body
    if not json_data:
        return to_json_data(errno=Code.PARAMERR, msg=error_map[Code.PARAMERR])
    dict_data = json.loads(json_data.decode('utf8'))
    try:
        if dict_data["new_password"] != dict_data["repeat_password"]:
            return to_json_data(errno=Code.PARAMERR, msg="两次输入不一致")
        user = authenticate(username=username, password=dict_data["old_password"])
        if user:
            user.set_password(dict_data["new_password"])
            user.save(origin_password=dict_data["new_password"])
            return to_json_data(msg="修改成功")
        return to_json_data(Code.PWDERR, msg="密码错误")
    except:
        return to_json_data(Code.PARAMERR, msg="参数错误")
