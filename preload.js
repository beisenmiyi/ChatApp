const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myapi', {
    sendMessage: (channel, ...args) => ipcRenderer.send(channel, ...args),
    receiveMessage: (channel, ...args) => ipcRenderer.on(channel, ...args)
});