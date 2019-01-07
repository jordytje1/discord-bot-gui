import * as electron from 'electron';
//const electron = require('electron');
const path = require('path');
const fs = require('fs');

export class Dash {
    private data: any;
    private path: any;
  constructor(opts: any) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    
    this.data = parseDataFile(this.path, opts.defaults);
  }
  
  get(key: any) {
    return this.data[key];
  }
  
  set(key: any, val: any) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath: any, defaults: any) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}