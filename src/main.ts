import { ipcMain, app, BrowserWindow } from "electron";
import * as fs from 'fs';
import * as path from "path";
import { EventEmitter } from 'events';
import {Dash } from './dashboard';

class LoginEmitter extends EventEmitter {};

const Emitter = new LoginEmitter();
let mainWindow: Electron.BrowserWindow;
let dash: Electron.BrowserWindow;

class MainWindow {
  constructor() { this.render() }
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
  private dash: Dash;
  constructor() {
    const dash = new Dash({
      configName: 'user-preferences',
      defaults: {
        windowBounds: { width: 800, height: 600 }
      }
    });
    this.render(dash) 
  }
  
  private render(opts: any) {

    dash = new BrowserWindow({
      height: 600,
      width: 600,
      autoHideMenuBar: true,
      resizable: true,
    });

    dash.on('resize', () => {
      let { width, height } = dash.getBounds();
      this.dash.set('windowBounds', { width, height });
    });
    
    dash.loadFile(path.join(__dirname, "../dashboard.html"));

    dash.on("closed", () => {
      dash = null;
    });
  }
}

Emitter.on('logging-in', () => {
  new RenderDashboard();
  mainWindow.close();
});

ipcMain.on('login-message', () => {
  Emitter.emit('logging-in');
}) 

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