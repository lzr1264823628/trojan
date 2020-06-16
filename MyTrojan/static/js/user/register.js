$(function () {
    let $register = $('.form-register'); // 获取登录表单元素
    let $repeat_password = $("input[name=repeat_password]");
    $("input[name=email]").blur(function () {
        if (fn_check_email() !== "success") {
            $(this).css("border-color", "#bd2130");
        } else {
            $(this).css("border-color", "#ced4da");
        }
    });
    $("input[name=username]").blur(function () {
        if (fn_check_username() !== "success") {
            $(this).css("border-color", "#bd2130");
        } else {
            $(this).css("border-color", "#ced4da");
        }
    });
    $repeat_password.on('input propertychange', function () {
        if ($(this).val() !== $("input[name=password]").val())
            $(this).css("border-color", "#bd2130");
    });
    $repeat_password.blur(function () {
        if ($(this).val() !== $("input[name=password]").val()) {
            $(this).css("border-color", "#bd2130");
        } else
            $(this).css("border-color", "#ced4da");

    });

    function fn_check_email(email) {
        let sEmail = $("input[name=email]").val();
        if (sEmail === "") {
            message.showError('Email不能为空！');
            return
        }
        let returnValue = "";
        if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(sEmail)) {
            message.showError('Email格式错误！');
            return
        }
        $.ajax({
            url: USER_CHECK_EMAIL.replace("replace", sEmail),
            type: 'GET',
            dataType: 'json',
            async: false // 把async关掉
        })
            .done(function (res) {
                if (res.data.count !== 0) {
                    message.showError(res.data.email + '已注册，请重新输入！');
                    returnValue = "";
                } else {
                    message.showSuccess('Email可用');
                    returnValue = "success"
                }
            })
            .fail(function () {
                message.showError('服务器超时，请重试！');
                returnValue = ""
            });
        return returnValue
    }

    function fn_check_username(username) {
        let sUsername = $("input[name=username]").val();
        if (sUsername === "") {
            message.showError('Email不能为空！');
            return
        }
        let returnValue = "";
        if (!(/^\w{6,20}$/).test(sUsername)) {
            message.showError('请输入6-20个字符的用户名');
            return
        }
        $.ajax({
            url: USER_CHECK_ACCOUNT.replace("replace", sUsername),
            type: 'GET',
            dataType: 'json',
            async: false // 把async关掉
        })
            .done(function (res) {
                if (res.data.count !== 0) {
                    message.showError(res.data.username + '已注册，请重新输入！');
                    returnValue = "";
                } else {
                    message.showSuccess('用户名可用');
                    returnValue = "success"
                }
            })
            .fail(function () {
                message.showError('服务器超时，请重试！');
                returnValue = ""
            });
        return returnValue
    }

    $register.submit(function (e) {
        // 阻止默认提交操作
        e.preventDefault();
        // 获取用户输入的账号信息
        let sUserAccount = $("input[name=username]").val(); // 获取用户输入的用户名或者邮箱
        // 判断用户输入的账号信息是否为空
        if (sUserAccount === "") {
            message.showError('用户账号不能为空');
            return
        }
        if (!(/^\w{6,20}$/).test(sUserAccount)) {
            message.showError('请输入6-20个字符的用户名');
        }
        let sUserEmail = $("input[name=email]").val();
        // 判断输入手机号格式或者用户名格式是否正确
        if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(sUserEmail)) {
            message.showError('Email格式错误');
            return
        }
        // 获取用户输入的密码
        let sPassword = $("input[name=password]").val(); // 获取用户输入的密码
        let sRPassword = $("input[name=repeat_password]").val();
        if (!sPassword) {
            message.showError('密码不能为空');
            return
        }

        if (sPassword.length < 6 || sPassword.length > 25) {
            message.showError('密码的长度需在6～25位以内');
            return
        }
        if (sPassword !== sRPassword) {
            message.showError("两次密码不一致")
        }

        // 发起登录请求
        // 创建请求参数
        let SdataParams = {
            "email":sUserEmail,
            "username": sUserAccount,
            "password": sPassword,
            "repeat_password": sRPassword
        };
        // 添加spinner-border
        let btn = $("button[type=submit]");
        btn.empty();
        btn.prepend("<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>");
        // 创建ajax请求
        $.ajax({
            // 请求地址
            url: "/user/register/", // url尾部需要添加/
            // 请求方式
            type: "POST",
            data: JSON.stringify(SdataParams),
            // 请求内容的数据类型（前端发给后端的格式）
            contentType: "application/json; charset=utf-8",
            // 响应数据的格式（后端返回给前端的格式）
            dataType: "json",
        })
            .done(function (res) {
                btn.empty();
                if (res.errno === "0") {
                    message.showSuccess('注册成功');
                    setTimeout(function () {
                        // 登录成功之后重定向到打开登录页面之前的页面
                        window.location.href = document.referrer;
                    }, 1000);
                    btn.text("Success");
                } else {
                    // 登录失败，打印错误信息
                    message.showError(res.msg);
                }
            })
            .fail(function () {
                btn.empty();
                btn.text("Log in");
                message.showError('服务器超时，请重试!');
            });
    });
});