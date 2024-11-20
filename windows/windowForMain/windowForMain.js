const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatWindow = document.getElementById("chatWindow");
const addContactForm = document.getElementById("addContactForm");
const contactList = document.getElementById("contactList");
const closeWindowButton = document.getElementById("closeWindowButton");
const contactName = document.getElementById("contactName");
let userID = undefined;
let receiverID = undefined;

//关闭窗口按钮
closeWindowButton.addEventListener("click", (event) => {
    window.myapi.sendMessage("closeWindow", "windowForMain");
})

window.myapi.receiveMessage("userID", (evevt, QQnumber) => {
    userID = QQnumber;
    let socket = new WebSocket(`ws://10.10.111.131:8888?userID=${userID}`);

    socket.onopen = function() {
    
    }
    
    socket.onmessage = function(msg) {
        const message = JSON.parse(msg.data);
        const messageElement = document.createElement("div");
        messageElement.innerText = message.message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    
    sendButton.addEventListener("click", () => {
        let message = {
            "senderID": userID,
            "receiverID": receiverID,
            "message": messageInput.value
        };
        socket.send(JSON.stringify(message));
        const messageElement = document.createElement("div");
        messageElement.innerText = "我：" + messageInput.value;
        chatWindow.appendChild(messageElement);
        messageInput.value = "";
        chatWindow.scrollTop = chatWindow.scrollHeight;
    })
});

//添加联系人，点击提交按钮
addContactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let contactId = document.getElementById("contactIdInput").value;
    try {
        const response = await fetch("http://10.10.111.131:8080/addContact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "userID": userID,
                "contactId": contactId,
            })
        });
        if (response.ok) {

        } else {

        }
    } catch (error) {
        console.log(error);
    }
});

//加载联系人
window.onload = async function() {
    async function waitForUserID() {
        while (!userID) { // 当 userID 为空时，持续等待
            await new Promise(resolve => setTimeout(resolve, 100)); // 每隔 100 毫秒检查一次
        }
        return;
    }
    await waitForUserID();
    try {
        const response = await fetch(`http://10.10.111.131:8080/loadContact?userID=${userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const data = await response.json();
            data.contact_id.forEach(element => {
                let li = document.createElement("li");
                li.innerText = element;
                contactList.appendChild(li);
            });
        } else {
            console.log("Error");
        }
    } catch (error) {
        console.log(error);
    }
}

//选择联系人
contactList.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        receiverID = event.target.innerText;
        contactName.innerText = event.target.innerText;
        messageInput.style.display = "inline-block";
        sendButton.style.display = "inline-block";
    }
})