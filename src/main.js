import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      // permitimos require/import en el renderer
      nodeIntegration: true,
      contextIsolation: false,
      // preload si lo necesitas:
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.loadFile(path.join(__dirname, '..', 'public', 'index.html'));
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
