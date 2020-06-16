"use strict";

// 消息提示框
function Message() {
    // 提示框初始化样式
    this.now_top = 0;
    this.initStyle();
}

// 初始化样式
Message.prototype.initStyle = function () {
    this.wholeStyle = {
        "wrapper": {
            'position': 'fixed',
            'z-index': 99999,
            'left': '50%',
            'transform': 'translateX(-50%)',
            'top': -34 - 10,
        },
        "close": {},
        "classList": ["alert", "shadow-sm"]
    };
    // 错误消息文字和背景样式
    this.errorStyle = {
        "classList": ["alert-dark"],
        "wrapper": {
            // "background": "#424242",
            // "color": "#fffff9"
        },
        "close": {
            // "color": "#262626"
        }
    };
    // 成功消息文字和背景样式
    this.successStyle = {
        "classList": ["alert-success"],
        "wrapper": {},
        "close": {}
    };
    // 描述信息文字和背景样式
    this.infoStyle = {
        "classList": ["alert-info"],
        "wrapper": {},
        "close": {}
    };
};

Message.prototype.addClassList = function (list) {
    for (let i = 0; i < list.length; i++) {
        this.wrapper.addClass(list[i])
    }
};


// 显示异常
Message.prototype.showError = function (message) {
    this.show(message, "error");
};

Message.prototype.showSuccess = function (message) {
    this.show(message, "success");
};

Message.prototype.showInfo = function (message) {
    this.show(message, "info");
};

// 提示框的显示
Message.prototype.show = function (message, type) {
    let _this = this;
    // 设置提示框元素
    this.wrapper = $("<div class='alert alert-dismissible' role='alert'></div>");
    this.addClassList(this.wholeStyle.classList);
    this.wrapper.css(this.wholeStyle.wrapper);
    // 生成关闭按钮
    this.closeBtn = $("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n" +
        "    <span aria-hidden=\"true\">&times;</span>\n" +
        "  </button>");
    this.closeBtn.css(this.wholeStyle.close);
    // 将提示文字的元素和关闭按钮添加到提示框中
    this.wrapper.append(this.messageSpan);
    this.wrapper.append(this.closeBtn);
    $(document.body).append(this.wrapper);

    // 将各种提示的文字添加对应不同的样式
    this.wrapper.text(message);
    this.wrapper.append(this.closeBtn);
    if (type === "error") {
        this.wrapper.css(this.errorStyle['wrapper']);
        this.closeBtn.css(this.errorStyle['close']);
        this.addClassList(this.errorStyle.classList);
    } else if (type === "info") {
        this.wrapper.css(this.infoStyle['wrapper']);
        this.closeBtn.css(this.infoStyle['close']);
        this.addClassList(this.infoStyle.classList);
    } else if (type === "success") {
        this.wrapper.css(this.successStyle['wrapper']);
        this.closeBtn.css(this.successStyle['close']);
        this.addClassList(this.successStyle.classList);
    }
    // 设置两秒后自动关闭
    let temp = this.wrapper;
    this.wrapper.animate({"top": window.innerHeight / 10 + this.now_top}, function () {
        setTimeout(function () {
            temp.animate({"top": -44}, function () {
                temp.remove();
            });
            _this.now_top -= 44;
        }, 2500);
    });
    this.now_top += 44;
};
// 将对象绑定到 window 上
window.message = new Message();
