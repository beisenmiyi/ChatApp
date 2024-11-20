const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");

let userID;
let createWindowsFunctions = new Map();
let windows = new Map();

function checkForUpdates() {
    // 配置日志输出
    autoUpdater.logger = require("electron-log");
    autoUpdater.logger.transports.file.level = "info";

    // 检查是否有更新
    autoUpdater.checkForUpdatesAndNotify();
}



//定义登录窗口
let windowForLogin;
const createWindowForLogin = () => {
    windowForLogin = new BrowserWindow({
        width: 320,
        height: 450,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    windowForLogin.loadFile("windows/windowForLogin/windowForLogin.html");
    windows.set("windowForLogin", windowForLogin);
};

//定义注册窗口
let windowForRegister;
const createWindowForRegister = () => {
    windowForRegister = new BrowserWindow({
        width: 600,
        height: 630,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    windowForRegister.loadFile("windows/windowForRegister/windowForRegister.html");
    windows.set("windowForRegister", windowForRegister);
};

//定义登录失败弹窗窗口
let windowForLoginFailed;
const createWindowForLoginFailed = (message) => {
    windowForLoginFailed = new BrowserWindow({
        width: 285,
        height: 160,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    if (message === "QQ账号或密码错误") windowForLoginFailed.loadFile("windows/windowForLoginFailed/windowForLoginFailed1.html");
    else windowForLoginFailed.loadFile("windows/windowForLoginFailed/windowForLoginFailed2.html");
    windows.set("windowForLoginFailed", windowForLoginFailed);
};

//定义注册QQ账号成功窗口
let windowForRegisterSuccess;
const createWindowForRegisterSuccess = () => {
    windowForRegisterSuccess = new BrowserWindow({
        width: 600,
        height: 630,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    windowForRegisterSuccess.loadFile("windows/windowForRegisterSuccess/windowForRegisterSuccess.html");
    windows.set("windowForRegisterSuccess", windowForRegisterSuccess);
};

//定义聊天主页面窗口
let windowForMain;
const createWindowForMain = () => {
    windowForMain = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    windowForMain.loadFile("windows/windowForMain/windowForMain.html");
    windowForMain.webContents.on("did-finish-load", () => {
        windowForMain.webContents.send("userID", userID);
    });
    windows.set("windowForMain", windowForMain);
};

createWindowsFunctions.set("createWindowForLogin", createWindowForLogin);
createWindowsFunctions.set("createWindowForRegister", createWindowForRegister);
createWindowsFunctions.set("createWindowForLoginFailed", createWindowForLoginFailed);
createWindowsFunctions.set("createWindowForRegisterSuccess", createWindowForRegisterSuccess);
createWindowsFunctions.set("createWindowForMain", createWindowForMain);

//创建登录窗口
app.whenReady().then(() => {
    createWindowForLogin();
    checkForUpdates();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

//创建窗口
ipcMain.on("createWindow", (event, message) => {
    if (createWindowsFunctions.has(message)) {
        createWindowsFunctions.get(message)();
    }
});

//关闭窗口
ipcMain.on("closeWindow", (evevt, message) => {
    if (windows.has(message)) {
        windows.get(message).close();
        windows.delete(message);
    }
});

//最小化窗口
ipcMain.on("minimizeWindow", (event, message) => {
    if (windows.has(message)) {
        windows.get(message).minimize();
    }
});

//打开url
ipcMain.on("open-url", (event, url) => {
    shell.openExternal(url);
});

//转发userID
ipcMain.on("userID", (event, QQnumber) => {
    userID = QQnumber;
});