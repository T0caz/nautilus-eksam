import {randomBytes} from 'node:crypto';
import {access,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {root,openDatabase,seed} from '../src/db.mjs';
const target=resolve(root,'.env');
try{await access(target);console.log('.env on olemas; seda ei kirjutatud üle.');}
catch{await writeFile(target,`HOST=127.0.0.1\nPORT=3000\nAPP_ORIGIN=http://127.0.0.1:3000\nNODE_ENV=development\nDATABASE_PATH=./data/nautilus.sqlite\nAPP_SECRET=${randomBytes(48).toString('hex')}\n`,{mode:0o600});console.log('Loodi privaatne .env.');}
await mkdir(resolve(root,'data'),{recursive:true,mode:0o700});
const db=openDatabase(resolve(root,'data/nautilus.sqlite'));seed(db);db.close();
console.log('Andmebaas ja näidisretked on valmis. Järgmisena: npm run admin, seejärel npm start.');
