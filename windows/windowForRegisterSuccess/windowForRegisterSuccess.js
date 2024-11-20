const QQnumber = document.getElementById('QQnumber')
const closebtn = document.getElementById('closebtn')

window.myapi.receiveMessage('QQnumber', (event, QQnumber_message) => {
    QQnumber.innerText = '你的QQ号码为：' + QQnumber_message;
})

closebtn.addEventListener('click', () => {
    window.myapi.sendMessage("closeWindow");
})