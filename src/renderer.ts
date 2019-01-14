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
    return console.log('Connected to mongo database.');
}) 

mongoose.connect(data.dburl, { useNewUrlParser: true });



class Render {
    
   
}

new Render();
