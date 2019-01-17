import { ipcMain, app, BrowserWindow } from "electron";
import * as fs from 'fs';
import * as path from "path";
import { EventEmitter } from 'events';
import { Dash } from './dashboard';
import DUser from "./schemas/user";

class LoginEmitter extends EventEmitter { };

const Emitter = new LoginEmitter();
let mainWindow: Electron.BrowserWindow;
let dash: Electron.BrowserWindow;

class MainWindow {
  constructor() {
    this.render();
  }
  private render() {
    mainWindow = new BrowserWindow({
      height: 600,
      width: 600,
      autoHideMenuBar: true,
      resizable: false,
    });
    mainWindow.loadFile(path.join(__dirname, "../index.html"));
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  }
}

class RenderDashboard {
  constructor() {
    this.render()
  }
  private render() {
    dash = new BrowserWindow({
      height: 600,
      width: 600,
      autoHideMenuBar: true,
      resizable: false,
    });
    dash.loadFile(path.join(__dirname, "../dashboard.html"));
    dash.on("closed", () => {
      dash = null;
    });
  }
}

ipcMain.on('login', async (event: any, id: string, token: string) => {
  await Emitter.emit('logging-in');
  await dash.webContents.on('did-finish-load', () => {
    dash.webContents.send('login-data', id, token);
  })
  await Emitter.emit('close-main');
})

ipcMain.on('skip', () => {
  new RenderDashboard();
  mainWindow.close();
})

Emitter.on('logging-in', async () => {
  await new RenderDashboard();
});

Emitter.on('close-main', async () => {
  await mainWindow.close();
});

app.on("ready", () => new MainWindow());

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    new MainWindow();
  }
});