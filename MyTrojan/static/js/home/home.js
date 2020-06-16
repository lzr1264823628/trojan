
window.onload = function () {
    ctx = document.getElementById('myChart').getContext('2d');
    Chart.defaults.global.defaultFontColor = 'white';
    window.myPie = new Chart(ctx, config);
    $("#Q_btn").click(function () {
        let Q = $("#Q");
        let width = Q.parent(".modal-body").width();
        Q.css('height', width + 'px');
        $("#Q_username").val(USER_NAME);
        $("#Q_contain").modal();
    });
    $("#Q_copy").click(function () {
        const input = document.querySelector('#Q_url');
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            message.showInfo("复制成功");
        }
    });
    var qrcode = new QRCode("Q");
    $("#Q_generate").click(function () {
        let $username = $("#Q_username");
        let $password = $("#Q_password");
        if (!($username.val() && $username.val())) {
            message.showError("空值无效");
            return
        }
        let url = "trojan://" + $username.val() + ":" + $password.val() + "@" + window.location.host + ":443";
        $("#Q_url").val(url);
        qrcode.makeCode(url)
    })
};
$(function () {
    let $reload = $(".btn_reload");
    let $password = $("#submit_change_password");
    $reload.click(function () {
        let btn = $(".btn_reload");
        btn.empty();
        btn.prepend("<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>");
        $.ajax({
            // 请求地址
            url: USER_GET_URL, // url尾部需要添加/
            // 请求方式
            type: "GET",
            // 请求内容的数据类型（前端发给后端的格式）
            contentType: "application/json; charset=utf-8",
            // 响应数据的格式（后端返回给前端的格式）
            dataType: "json",
        })
            .done(function (res) {
                btn.empty();
                btn.text("同步");
                if (res.errno === "0") {
                    if (res.data.quota !== "Infinite") {
                        $("#quota").text(parseInt(res.data.quota) / (1024 * 1024).toFixed(2) + "M");
                    }
                    $("#upload").text((parseInt(res.data.upload) / (1024 * 1024)).toFixed(2) + "M");
                    $("#download").text((parseInt(res.data.download) / (1024 * 1024)).toFixed(2) + "M");
                    if (res.data.left !== "Infinite") {
                        $("#left").text(parseInt(res.data.left) / (1024 * 1024).toFixed(2) + "M");
                    }
                    window.myPie.data.datasets[0].data[0] = parseInt(res.data.upload) / (1024 * 1024).toFixed(2);
                    window.myPie.data.datasets[0].data[1] = parseInt(res.data.download) / (1024 * 1024).toFixed(2);
                    if (res.data.quota !== "Infinite") {
                        window.myPie.data.datasets[0].data[2] = parseInt(res.data.left) / (1024 * 1024).toFixed(2)
                    }
                    $("#username").text(res.data.username);
                    $("#email").text(res.data.email);
                    message.showSuccess('同步成功');
                } else {
                    message.showError(res.msg);
                }
            })
            .fail(function () {
                btn.empty();
                btn.text("同步");
                message.showError('服务器超时，请重试!');
            });
    });
    $password.click(function () {
        let password_list = $("input[type=password]");
        if (!password_list.eq(0).val()) {
            message.showError("原密码输入不能空");
            return
        }
        if (!password_list.eq(1).val()) {
            message.showError("新密码输入不能空");
            return
        }
        if (!password_list.eq(2).val()) {
            message.showError("重复密码输入不能空");
            return
        }
        if (!(/^[a-zA-Z_\d]{6,25}$/).test(password_list.eq(1).val())) {
            message.showError("请输入6-25位的密码");
            return
        }
        if (password_list.eq(1).val() !== password_list.eq(2).val()) {
            message.showError("重复密码不一致");
            return;
        }
        // 添加spinner-border
        let btn = $("#submit_change_password");
        btn.empty();
        btn.prepend("<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>");
        $.ajax({
            // 请求地址
            url: USER_CHANGE_PASSWORD, // url尾部需要添加/
            // 请求方式
            type: "POST",
            data: JSON.stringify({
                old_password: password_list.eq(0).val(),
                new_password: password_list.eq(1).val(),
                repeat_password: password_list.eq(2).val()
            }),
            // 请求内容的数据类型（前端发给后端的格式）
            contentType: "application/json; charset=utf-8",
            // 响应数据的格式（后端返回给前端的格式）
            dataType: "json",
        })
            .done(function (res) {
                btn.empty();
                btn.text("submit");
                if (res.errno === "0") {
                    message.showSuccess('修改成功');
                    window.location.reload()
                } else {
                    message.showError(res.msg);
                }

            })
            .fail(function () {
                message.showError('服务器超时，请重试!');
                btn.empty();
                btn.text("submit");
            });
    });
});