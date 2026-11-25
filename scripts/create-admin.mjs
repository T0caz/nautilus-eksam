import {createInterface} from 'node:readline/promises';
import {stdin,stdout} from 'node:process';
import {openDatabase} from '../src/db.mjs';
import {hashPassword} from '../src/security.mjs';
const rl=createInterface({input:stdin,output:stdout});
const email=(await rl.question('Administraatori e-post: ')).trim().toLowerCase();rl.close();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)throw new Error('Vigane e-post.');
async function passwordPrompt(label){
 if(!stdin.isTTY)throw new Error('Parooli turvaliseks sisestamiseks käivita see käsk interaktiivses terminalis.');
 stdout.write(label);stdin.setRawMode(true);stdin.resume();stdin.setEncoding('utf8');
 return await new Promise((resolve,reject)=>{let value='';const onData=chunk=>{for(const ch of chunk){if(ch==='\u0003'){done();reject(new Error('Katkestatud.'));return;}if(ch==='\r'||ch==='\n'){done();resolve(value);return;}if(ch==='\u007f'){value=value.slice(0,-1);}else if(ch>=' '&&value.length<256)value+=ch;}};function done(){stdin.removeListener('data',onData);stdin.setRawMode(false);stdin.pause();stdout.write('\n');}stdin.on('data',onData);});
}
const password=await passwordPrompt('Parool (vähemalt 12 märki; sisestus on peidetud): ');
if(password.length<12)throw new Error('Parool peab olema vähemalt 12 märki.');
if(password!==await passwordPrompt('Korda parooli: '))throw new Error('Paroolid ei ühti.');
const db=openDatabase();if(db.prepare('SELECT id FROM admins WHERE email=?').get(email)){db.close();throw new Error('See administraator on juba olemas.');}
db.prepare('INSERT INTO admins(email,password_hash) VALUES(?,?)').run(email,await hashPassword(password));db.close();console.log('Administraator loodud. Ava /admin.');
