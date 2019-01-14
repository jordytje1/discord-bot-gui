import { data } from './config';
import * as mongoose from 'mongoose';
import DUser, { IUser } from './schemas/user';
import * as net from 'net';
import { ipcRenderer } from 'electron';

export const db = mongoose.connection;

db.on('error', function (err: any) {
    console.log('Error connecting to mongo db: ' + err);
});
 
db.once('open', async function () {
    await closeModal();
    return console.log('Connected to mongo database.');
}) 

mongoose.connect(data.dburl, { useNewUrlParser: true });

function closeModal() {
    setTimeout(() => {
        (document.getElementsByClassName('status')[0] as HTMLElement).style.background = `green`;
        (document.getElementsByClassName('tooltip')[0] as HTMLElement).innerHTML = `Online`;
    }, 3000);
}

class Render {
    private loginbtn: HTMLElement;
    constructor() {
        this.loginbtn = document.getElementById('getuser');
        this.loginbtn.addEventListener('click', () => {
            const userid = (document.getElementById('username') as HTMLInputElement).value;
            const isnum = /^\d+$/.test(userid);
            if (isnum) return this.findUser(userid); else this.modalError('Please enter a valid userid.');
        })
    }
    
    private findUser(userid: string) { 
        DUser.countDocuments({userid: userid}, (e: any, c: number) => c >= 1 ? this.auth(userid) : this.modalError('User not found.'));
    }

    private auth(id: string) {
        try {
            var socket = net.connect({ host: 'localhost', port: data.port }, function (err: Error) {
                if (err) return console.log(err);
                socket.write(`login ${id}`);
            });
            socket.on('data', function (data) {
                const reply = data.toString();
                switch (reply) {
                    case 'true': ipcRenderer.send('login-message', id); break;
                    case 'false': this.modalError('User not Authorized'); break;
                }
                socket.destroy();
            });
            socket.on('close', function () { console.log('close event on tcp client'); });
        } catch (e) {
            return console.log(e);
        }
    }

    private modalError(message: string) {
        let warning = (document.getElementsByClassName('warning')[0] as HTMLElement)
        warning.style.visibility = `visible`;
        warning.style.opacity = `1`;
        warning.innerHTML = `${message}`;
        setTimeout(() => {
            warning.style.visibility = `hidden`;
            warning.style.opacity = `0`;
        }, 4000);
    } 

}

new Render();
