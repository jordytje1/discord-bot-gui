import { Client, Message } from "discord.js";
import * as electron from 'electron';
import { ipcRenderer } from 'electron';
import { data } from './config';
import * as mongoose from 'mongoose';
import * as Mousetrap from 'mousetrap';
import { timingSafeEqual } from "crypto";
import { callbackify } from "util";
import { stat } from "fs";

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
    this.online();
    this.loadMembers();
    this.loadImage();
  }

  private async handleMessage(message: Message) {
    /* handle message event */
    return console.log('Bot observed a message.');
  }

  private online() {
    var status = (document.getElementsByClassName('status')[0] as HTMLElement);
    status.innerHTML = 'ONLINE';
    status.style.border = '2px solid #02d6a8';
    status.style.color = '#02d6a8';
  }

  private loadImage() {
    var logo = (document.getElementsByClassName('bot-img')[0] as HTMLImageElement);
    logo.src = this.client.user.avatarURL;
  }

  public async loadMembers() {
    let members: HTMLElement = (document.getElementById('members'));
    let guilds: Array<string> = [];
    this.client.guilds.forEach(g => {
      guilds.push(g.id);
    })
    guilds.forEach(g => {
      this.client.guilds.get(g).members.forEach(m => {
        var mem = `${m.user.tag}`;
        var li = document.createElement("li");
        li.classList.add('member');
        var memberItem = mem.padEnd(Math.round(25-mem.length), ' ');
        li.appendChild(document.createTextNode(`${memberItem}`));
        members.appendChild(li);
      })
    })
  }
  

}