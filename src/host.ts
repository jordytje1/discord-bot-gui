import * as net from 'net';
import { ipcRenderer } from 'electron';
import { db } from './renderer';
import { data } from './config';

export class Host {
    constructor() {}

    public getPreferences(userid: string) {
        try {
            var socket = net.connect({ host: data.host, port: data.port }, function (err: Error) {
                if (err) return console.log(err);
                socket.write(`login ${userid}`);
            });
            socket.on('data', function (data) {
                const reply = data.toString();
                switch (reply) {
                    case 'true': ipcRenderer.send('login-message', userid); break;
                    case 'false': this.modalError('User not Authorized'); break;
                }
                socket.destroy();
            });
            socket.on('close', function () { console.log('close event on tcp client'); });
        } catch (e) {
            return console.log(e);
        }
    }
}