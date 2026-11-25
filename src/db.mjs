import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expeditions } from './seed.mjs';
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function openDatabase(path = process.env.DATABASE_PATH || resolve(root,'data/nautilus.sqlite')) {
  if(path!==':memory:') mkdirSync(dirname(resolve(path)),{recursive:true,mode:0o700});
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
  db.exec(readFileSync(resolve(root,'migrations/001_initial.sql'),'utf8'));
  return db;
}
export function seed(db) {
  if(db.prepare("SELECT value FROM settings WHERE key='seeded'").get())return;
  if(db.prepare('SELECT COUNT(*) AS n FROM expeditions').get().n){db.prepare("INSERT INTO settings(key,value) VALUES('seeded','1')").run();return;}
  const insert=db.prepare('INSERT INTO expeditions (id,slug,name,category,description,location,region,depth,duration,price_cents,date,capacity,images) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
  db.exec('BEGIN');
  try { for(const e of expeditions) insert.run(e.id,e.slug,e.name,e.category,e.description,e.location,e.region,e.depth,e.duration,e.price_cents,e.date,e.capacity,JSON.stringify(e.images)); db.prepare("INSERT INTO settings(key,value) VALUES('seeded','1')").run(); db.exec('COMMIT'); }
  catch(e){db.exec('ROLLBACK');throw e;}
}
export const hydrate = e => e ? {...e,images:JSON.parse(e.images)} : null;
export function listExpeditions(db, q={}) {
  const where=[],params=[];
  if(q.q){where.push('(name LIKE ? ESCAPE \'!\' OR description LIKE ? ESCAPE \'!\')');const s='%'+String(q.q).slice(0,100).replace(/[!%_]/g,'!$&')+'%';params.push(s,s);}
  if(q.region){where.push('region=?');params.push(String(q.region).slice(0,100));}
  if(q.category){where.push('category=?');params.push(String(q.category).slice(0,50));}
  if(['50','100','200'].includes(String(q.depth))){where.push('depth<=?');params.push(Number(q.depth));}
  if(['1','3','5'].includes(String(q.duration))){where.push('duration<=?');params.push(Number(q.duration));}
  const order={date:'date ASC',price:'price_cents ASC',depth:'depth ASC'}[q.sort]||'date ASC';
  return db.prepare('SELECT * FROM expeditions'+(where.length?' WHERE '+where.join(' AND '):'')+' ORDER BY '+order).all(...params).map(hydrate);
}
