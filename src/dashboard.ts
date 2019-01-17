import { Client, Message } from "discord.js";
import * as electron from 'electron';
import { ipcRenderer } from 'electron';
import { data } from './config';
import * as mongoose from 'mongoose';
import * as Mousetrap from 'mousetrap';
import { timingSafeEqual } from "crypto";
import { callbackify } from "util";

export const db = mongoose.connection;

db.on('error', function (err: any) {
  console.log('Error connecting to mongo db: ' + err);
});

db.once('open', async function () {
  console.log('mongo online');
});

ipcRenderer.on('login-data', (event: any, id: string, token: string) => {
  console.log(`User logged in: ${id}`);
  new Dash(token).login();
})

mongoose.connect(data.dburl, { useNewUrlParser: true });

export class Dash {
  public client: Client;
  private token: string;
  constructor(token: string) {
    this.client = new Client();
    this.client.on('message', this.handleMessage.bind(this));
    this.client.on('ready', this.ready.bind(this));
    this.token = token;
    Mousetrap.bind('ctrl+shift+r', function () {
      location.reload();
    });

  }

  public async login() {
    return this.client.login(this.token);
  }

  // m.user.username;

  private ready() {
    console.log('Bot online');
    // set members
    let guilds: Array<string> = [];
    this.client.guilds.forEach(g => {
      guilds.push(g.id);
    })
    guilds.forEach(g => {
      this.client.guilds.get(g).members.forEach(m => {
        console.log(m.user.username);
      })
    })
  }

  private async handleMessage(message: Message) {
    /* handle message event */
    return console.log('Bot observed a message.');
  }


}