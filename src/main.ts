import { ipcMain, app, BrowserWindow } from "electron";
import * as fs from 'fs';
import * as path from "path";
import { EventEmitter } from 'events';
import {Dash } from './dashboard';
import DUser from "./schemas/user";

class LoginEmitter extends EventEmitter {};

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
    
    this.render(dash) 
  }
  
  private render(opts: any) {

    dash = new BrowserWindow({
      height: 600,
      width: 600,
      autoHideMenuBar: true,
      resizable: true,
    });
    
    dash.loadFile(path.join(__dirname, "../dashboard.html"));

    dash.on("closed", () => {
      dash = null;
    });
  }
}

ipcMain.on('login', (event: any, id: string, token: string, url: string) => {
  DUser.findOne({userid: id}, (err, doc) => {
    if(err)console.log(err);
    if(doc) {
      console.log(`FOUND && Recieved: ID: ${id} | Token: ${token} | DB URL: ${url}`);
      event.returnValue = 'true'
    } else {
      console.log(`NOT FOUND && Recieved: ID: ${id} | Token: ${token}`);
      event.returnValue = 'false'
    }
  })
})

ipcMain.on('login-nodb', (event: any, id: string, token: string) => {
  DUser.findOne({userid: id}, (err, doc) => {
    if(err)console.log(err);
    if(doc) {
      new login(id, token);
      event.returnValue = 'true'
    } else {
      console.log(`NOT FOUND && Recieved: ID: ${id} | Token: ${token}`)
      event.returnValue = 'false'
    }
  })
})

class login {
  constructor(id: string, token: string, url?: string) {
    if(id && token) {

    } else if(id && token && url){

    }
  }

  private renderDash() {
    new RenderDashboard();
    mainWindow.close();
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