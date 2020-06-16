$(function () {
    let $login = $('.form-login'); // 获取登录表单元素
    $login.submit(function (e) {
        // 阻止默认提交操作
        e.preventDefault();
        // 获取用户输入的账号信息
        let sUserAccount = $("input[name=username]").val(); // 获取用户输入的用户名或者邮箱
        // 判断用户输入的账号信息是否为空
        if (sUserAccount === "") {
            message.showError('用户账号不能为空');
            return
        }
        // 判断输入手机号格式或者用户名格式是否正确
        if (!(/^\w{6,20}$/).test(sUserAccount) && !(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(sUserAccount)) {
            message.showError('请输入6-20个字符的用户名或者email');
            return
        }
        // 获取用户输入的密码
        let sPassword = $("input[name=password]").val(); // 获取用户输入的密码
        // 判断用户输入的密码是否为空
        if (!sPassword) {
            message.showError('密码不能为空');
            return
        }
        // 判断用户输入的密码是否为6-20位
        if (sPassword.length < 6 || sPassword.length > 25) {
            message.showError('密码的长度需在6～25位以内');
            return
        }
        // 获取用户是否勾许"记住我"，勾许为true，不勾许为false
        let bStatus = $("input[type='checkbox']").is(":checked"); // 获取用户是否选择记住我，勾上代表true，没勾上代码false
        // 发起登录请求
        // 创建请求参数
        let SdataParams = {
            "username": sUserAccount,
            "password": sPassword,
            "remember_me": bStatus
        };
        let btn = $("button[type=submit]");
        btn.empty();
        btn.append("<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>");
        // 创建ajax请求
        $.ajax({
            // 请求地址
            url: "/user/login/", // url尾部需要添加/
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
                    message.showSuccess('登录成功');
                    setTimeout(function () {
                        // 登录成功之后重定向到打开登录页面之前的页面
                        window.location.href = document.referrer;
                    }, 1000);
                    btn.text("Success")
                } else {
                    // 登录失败，打印错误信息
                    message.showError(res.msg);
                    btn.text("Sign in")
                }
            })
            .fail(function () {
                $("button[type=submit]").remove("span");
                message.showError('服务器超时，请重试!');
            });
    });
});