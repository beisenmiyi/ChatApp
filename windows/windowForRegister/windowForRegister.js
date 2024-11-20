const nickname_input = document.getElementById("nickname-input");   //昵称输入框
const error_nickname_input = document.getElementById("error-nickname-input");     //昵称输入框错误提示框
const password_input = document.getElementById("password-input");   //密码输入框
const error_password_input = document.getElementById("error-password-input");     //密码输入框错误提示框
const password_requirements = document.getElementById("password-requirements");     //密码要求提示框
const error_password_input_text = document.getElementById("error-password-input-text");     //密码输入框错误提示文本

let error_password_input_text_options = [   //密码输入框要求提示文本选项
    "不能包括空格", 
    "长度为8-16个字符", 
    "必须包含字母、数字、符号中至少2种", 
    "请勿输入连续、重复6位以上字母或数字，如abcdefg、1111111、0123456"];
const required = document.querySelectorAll(".required");     //必填项提示框

//关闭注册窗口
document.getElementById("close-btn").addEventListener("click", (event) => {
    event.preventDefault();
    window.myapi.sendMessage("close-register-window");
});

//最小化注册窗口
document.getElementById("minimize-btn").addEventListener("click", (event) => {
    event.preventDefault();
    window.myapi.sendMessage("minimize-register-window");
});

//聚焦昵称输入框
nickname_input.addEventListener("focus", (event) => {
    if (nickname_input.value.trim() === "") error_nickname_input.style.display = "flex";
    else error_nickname_input.style.display = "none";
});
    
//判断昵称是否为空
nickname_input.addEventListener("input", (event) => {
    if (nickname_input.value.trim() === "") error_nickname_input.style.display = "flex";
    else error_nickname_input.style.display = "none";
});

//判断密码是否满足不能为连续、重复6位以上字母或数字，如abcdefg、1111111、0123456的函数
function hasConsecutiveSequence(str) {
    // 如果字符串长度小于等于 5，直接返回 false
    if (str.length <= 5) {
        return false;
    }

    // 转换为小写字母和数字，以忽略大小写
    str = str.toLowerCase();

    // 用于记录递增、递减和相同字符的连续数量
    let increasingCount = 1;
    let decreasingCount = 1;
    let sameCharCount = 1;

    // 遍历字符串，检查递增、递减或相同字符
    for (let i = 0; i < str.length - 1; i++) {
        const currentCharCode = str.charCodeAt(i);
        const nextCharCode = str.charCodeAt(i + 1);
        const currentChar = str[i];
        const nextChar = str[i + 1];

        // 检查递增：当前字符与下一个字符之间的 ASCII 值差为 1
        if (nextCharCode === currentCharCode + 1) {
            increasingCount++;
        } else {
            increasingCount = 1; // 如果不是递增，重置递增计数器
        }

        // 检查递减：当前字符与下一个字符之间的 ASCII 值差为 -1
        if (nextCharCode === currentCharCode - 1) {
            decreasingCount++;
        } else {
            decreasingCount = 1; // 如果不是递减，重置递减计数器
        }

        // 检查相同字符：如果当前字符与下一个字符相同
        if (nextChar === currentChar) {
            sameCharCount++;
        } else {
            sameCharCount = 1; // 如果不是相同字符，重置相同字符计数器
        }

        // 如果有连续 6 个递增、递减字符或相同字符，返回 true
        if (increasingCount >= 6 || decreasingCount >= 6 || sameCharCount >= 6) {
            return true;
        }
    }

    // 如果没有找到符合条件的字符序列，返回 false
    return false;
}

//判断密码是否符合条件
function check_password() {
    required[0].style.opacity = !password_input.value.includes(" ") ? 1 : 0;
    required[1].style.opacity = password_input.value.length >=8 && password_input.value.length <=16 ? 1 : 0;
    //判断密码所包含的字符类型是否大于2种
    let types = 0;
    if (/[a-zA-Z]/.test(password_input.value)) types++;
    if (/\d/.test(password_input.value)) types++;
    if (/[!@#$%^&*(),.?":{}|<>_+=-]/.test(password_input.value)) types++;
    required[2].style.opacity = (types >= 2) ? 1 : 0;
    required[3].style.opacity = !hasConsecutiveSequence(password_input.value) ? 1 : 0;
}

//聚焦密码输入框
password_input.addEventListener("focus", (event) => {
    error_password_input.style.display = "none";
    check_password();
    password_requirements.style.display = "flex";
});

//密码输入框内容变化
password_input.addEventListener("input", (event) => {
    check_password();
})

//焦点移除密码框
password_input.addEventListener("blur", (event) => {
    password_requirements.style.display = "none";
    if (password_input.value.trim() === "") {
        error_password_input_text.innerText = "密码不能为空";
        error_password_input.style.display = "flex";
        return;
    }
    for (let i = 0; i < required.length; i++) {
        if (required[i].style.opacity === "0") {
            error_password_input_text.innerText = error_password_input_text_options[i];
            error_password_input.style.display = "flex";
            return;
        }
    }
});

//点击号码下拉列表
const phone_select_text = document.getElementById("phone-select-text");
const available_phones = document.querySelectorAll(".available-phone-text");
const phone_select_btn = document.getElementById("phone-select-btn");
phone_select_btn.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("available-phone").style.display = window.getComputedStyle(document.getElementById("available-phone")).display === "none" ? "flex" : "none";
    available_phones.forEach(element => {
        if (element.children[1].innerText === phone_select_text.innerText) {
            element.children[0].style.backgroundColor = "#eeeeee";
            return;
        };
    });
});

//点击空白区域
window.addEventListener("click", (event) => {
    if (event.target !== phone_select_btn) {
        document.getElementById("available-phone").style.display = "none";
    };
});

//选择地区
function change_select_value(event) {
    phone_select_text.innerText = event.currentTarget.getElementsByTagName("p")[1].innerText;
    available_phones.forEach(element => {
        if (element.children[0].style.backgroundColor = "#eeeeee") {
            element.children[0].style.backgroundColor = "#ffffff";
            return;
        };
    });
};
available_phones.forEach(element => {
    element.addEventListener("click", change_select_value);
});

//点击协议复选框
const error_agreement_checkbox = document.getElementById("error-agreement-checkbox");
const agreement_checkbox = document.getElementById("agreement-checkbox");
agreement_checkbox.addEventListener("change", (event) => {
    error_agreement_checkbox.style.display = "none";
});

//点击协议超链接
const agreement_link = document.querySelectorAll(".agreement-link");
agreement_link.forEach (element => {
    element.addEventListener("click", (event) => {
        event.preventDefault();
        window.myapi.sendMessage("open-url", event.target.href);
        return;
    });
});

//点击立即注册按钮
document.getElementById("register-form").onsubmit = async (event) => {
    event.preventDefault();
    if (!agreement_checkbox.checked) {
        error_agreement_checkbox.style.display = "flex";
        return;
    }
    if (password_input.value.trim() === "") {
        error_password_input_text.innerText = "密码不能为空";
        error_password_input.style.display = "flex";
        return;
    }
    for (let i = 0; i < required.length; i++) {
        if (window.getComputedStyle(required[i]).opacity === "0") {
            error_password_input_text.innerText = error_password_input_text_options[i];
            error_password_input.style.display = "flex";
            return;
        }
    }
    if (nickname_input.value.trim() === "") {
        error_nickname_input.style.display = "flex";
        return;
    }

    const nickname = nickname_input.value;
    const password = password_input.value;
    try {
        const response = await fetch("http://localhost:8080/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"nickname": nickname, "password": password})
        })
        if (response.ok) {
            const data = await response.json();
            const number = data.number;
            window.myapi.sendMessage("register-success", number);
        }
        else {
            alert("注册失败");
        }
    } catch (error) {
        alert("注册失败");
    }
};