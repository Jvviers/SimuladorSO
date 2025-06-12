// src/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Carga el HTML de public/index.html
    win.loadFile(path.join(__dirname, '..', 'public', 'index.html'));

    // (opcional) Abre DevTools para que veas errores de consola / rutas:
    // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
