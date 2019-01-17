import { data } from './config';
import * as Mousetrap from 'mousetrap';
import * as mongoose from 'mongoose';
import DUser, { IUser } from './schemas/user';
import * as net from 'net';
import { ipcRenderer } from 'electron';

export const db = mongoose.connection;

db.on('error', function (err: any) {
    console.log('Error connecting to mongo db: ' + err);
});
 
db.once('open', async function () {
    var status = await (document.getElementsByClassName('status')[0] as HTMLElement);
    return setTimeout(() => {
        status.style.border = '2px solid green'; 
        status.style.color = 'green'; 
        status.innerHTML = 'ONLINE';
    }, 2000);
}) 

mongoose.connect(data.dburl, { useNewUrlParser: true });

class Render {
    private btn: HTMLElement;
    constructor(){
        this.btn = (document.getElementsByClassName('login-submit')[0] as HTMLElement);
        this.btn.addEventListener('click', () => this.login());
        Mousetrap.bind('ctrl+shift+r', function() {
            location.reload();
        });
    }

    private login() {
        var username = (document.getElementsByClassName('login-username')[0] as HTMLInputElement).value;
        var token = (document.getElementsByClassName('login-password')[0] as HTMLInputElement).value;
        var mongourl = (document.getElementsByClassName('login-mongourl')[0] as HTMLInputElement).value;

        if(!username || !token) {
            console.log('No content');
        } else {
            if(!mongourl) {
                this.openDash(username, token);
            } else {
                this.openDash(username, token, mongourl);
            }
        }
    }

    private openDash(id: string, token: string, mongo?: string) {
        if(!mongo) {
            return ipcRenderer.send('login', id, token, mongo);
        } else {
            return ipcRenderer.send('login-nodb', id, token);
        }
        //return mongo ? ipcRenderer.send('login', id, token, mongo) : ipcRenderer.send('login-nodb', id, token);
    }
   
}

new Render();