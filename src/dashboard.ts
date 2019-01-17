import * as electron from 'electron';
import { ipcRenderer } from 'electron';
import { Bot } from './bot';
import { data } from './config';
import * as mongoose from 'mongoose';
import * as Mousetrap from 'mousetrap';

export const db = mongoose.connection;

db.on('error', function (err: any) {
  console.log('Error connecting to mongo db: ' + err);
});

db.once('open', async function () {
  console.log('mongo online');
});

ipcRenderer.on('login-data', (event: any, id: string, token: string) => {
  console.log(`User logged in: ${id}`);
  // create new bot instance
})

mongoose.connect(data.dburl, { useNewUrlParser: true });

export class Dash {
  constructor() {
    
    Mousetrap.bind('ctrl+shift+r', function () {
      location.reload();
    });

  }


}

new Dash();