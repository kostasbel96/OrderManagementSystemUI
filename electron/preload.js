const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendToPrint: (content) => ipcRenderer.invoke('print', content)
});