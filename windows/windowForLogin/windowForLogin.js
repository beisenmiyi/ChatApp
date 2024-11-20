const forget_password_btn = document.getElementById("forget-password-btn"); //忘记密码按钮

//登录窗口的关闭按钮事件监听
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("close-btn").addEventListener("click", (evevt) => {
        window.myapi.sendMessage("closeWindow", "windowForLogin");
    });
});


//点击协议的链接
function open_url(event) {
    event.preventDefault();
    const url = event.target.href;
    window.myapi.sendMessage("open-url", url);
}
const agreement_link1 = document.getElementById("agreement-link1");
const agreement_link2 = document.getElementById("agreement-link2");
agreement_link1.addEventListener("click", open_url);
agreement_link2.addEventListener("click", open_url);


//登录按钮的状态监听
const QQnumber = document.getElementById("QQnumber");
const QQpassword = document.getElementById("QQpassword");
const agreement_checkbox = document.getElementById("agreement-checkbox");
const login_btn = document.getElementById("login-btn"); //登录按钮

function login_btn_state() {
    login_btn.disabled = QQnumber.value.trim() === "" || QQpassword.value.trim() === "" || !agreement_checkbox.checked;
};

QQnumber.addEventListener("input", login_btn_state);
QQpassword.addEventListener("input", login_btn_state);
agreement_checkbox.addEventListener("change", login_btn_state);


//登录按钮提交数据事件
document.getElementById("login-form").onsubmit = async (event) => {
    event.preventDefault();
    login_btn.disabled = true;
    login_btn.innerText = "登录中...";

    const number = document.getElementById("QQnumber").value;
    const password = document.getElementById("QQpassword").value;

    try {
        const response = await fetch("http://10.10.111.131:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"number":number, "password":password})
        })
        if (response.ok) {
            window.myapi.sendMessage("createWindow", "createWindowForMain");
            window.myapi.sendMessage('userID', number);
        } else {
            window.myapi.sendMessage("login-failed", "QQ账号或密码错误");
        }
    } catch (error) {
        window.myapi.sendMessage("login-failed", "无法连接到服务器");
    }
    login_btn.disabled = false;
    login_btn.innerText = "登录";
};


//“更多选项”按钮的点击事件
const more_option_container = document.getElementById("more-option-container");
document.getElementById("more-option-btn").addEventListener("click", (event) => {
    event.preventDefault();
    more_option_container.style.display = window.getComputedStyle(more_option_container).display === "none"? "flex" : "none";
})


// 点击空白区域
const more_option_btn = document.getElementById("more-option-btn");
window.addEventListener("click", (event) => {
    if (event.target === more_option_btn) {
        // 如果点击的是盒子或盒子的子元素，则不隐藏
        return;
    } else more_option_container.style.display = "none"; // 否则隐藏盒子
});


//注册账号按钮
document.getElementById("register-btn").addEventListener("click", () => {
    window.myapi.sendMessage("open-register-window")
});


//忘记密码按钮
forget_password_btn.addEventListener("click", (event) => {
    event.preventDefault();
    window.myapi.sendMessage("open-forget-password-window");
})