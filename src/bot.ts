import { Client, Message } from "discord.js";
import DUser from "./schemas/user";

/* New bot created, start listening for events & loading data */

export class Bot {
    public client: Client;
    private token: string;

    constructor(token: string) {
        this.client = new Client();
        this.client.on('message', this.handleMessage.bind(this));
        this.client.on('ready', this.ready.bind(this));
        this.token = token;
    }

    public async login() {
        return this.client.login(this.token);
    }


    private ready() {
        console.log('Bot online');
    }

    private async handleMessage(message: Message) {
        /* handle message event */
        return console.log('Bot observed a message.');
    }
}