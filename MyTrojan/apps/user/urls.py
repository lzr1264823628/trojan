from django.urls import path, re_path
from . import views

app_name = 'user'
urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.Register.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('home/', views.HomePage.as_view(), name="home"),
    path('verify_email/<email>/', views.verify_email, name='verify_email'),
    path('verify_username/<username>/', views.verify_username, name='verify_username'),
    path('get_user_data/', views.get_user_data, name="get_user_data"),
    path('set_password/', views.set_password, name="change_password")
]
