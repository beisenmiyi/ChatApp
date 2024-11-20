const close_btn = document.getElementById("close-btn");     //关闭窗口按钮
const ok_btn = document.getElementById("ok-btn")

//点击关闭按钮关闭窗口
close_btn.addEventListener("click", (event) => {
    event.preventDefault();
    window.myapi.sendMessage("close-LoginFailedWindow");
});

//点击重新登录按钮重新登录
ok_btn.addEventListener("click", (event) => {
    event.preventDefault();
    window.myapi.sendMessage("close-LoginFailedWindow");
});