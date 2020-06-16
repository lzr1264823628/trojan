from django.utils import timezone

import hashlib
from django.contrib.auth.models import AbstractUser, UserManager as _UserManager
from django.db import models
import logging

log = logging.getLogger("trojan")


class MyUserManage(_UserManager):
    def _create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError('The given username must be set')
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        password_bak = password
        user.set_password(password)
        user.save(using=self._db, origin_password=password_bak)
        return user


class Users(AbstractUser):
    password = models.CharField(max_length=128, db_column="user_password")
    sha224 = models.CharField(max_length=56, db_index=True, db_column="password", editable=False, blank=True)  # hash密码
    quota = models.BigIntegerField(default=0)
    download = models.BigIntegerField(default=0)
    upload = models.BigIntegerField(default=0)
    objects = MyUserManage()
    first_name = None
    last_name = None

    class Meta:
        db_table = 'users'
        verbose_name = "user"
        verbose_name_plural = 'users'

    def __str__(self):
        return self.username + "," + self.email + "," + "1" if self.is_staff else "0"

    # 最好放到前台去加密
    def save(self, *args, **kwargs):
        if kwargs.get("origin_password"):
            origin_password = kwargs.pop("origin_password")
            a = hashlib.sha224()
            a.update((self.username + ":" + origin_password).encode("utf-8"))
            self.sha224 = a.hexdigest()
            logging.info('hash' + ':' + self.sha224)
        super().save(*args, **kwargs)
