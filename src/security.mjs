import { randomBytes, scrypt, timingSafeEqual, createHash, createHmac } from 'node:crypto';
import { promisify } from 'node:util';
const derive=promisify(scrypt);
const options={N:131072,r:8,p:1,maxmem:256*1024*1024};
export async function hashPassword(password){
  const salt=randomBytes(16).toString('hex');
  const key=await derive(password,salt,64,options);
  return 'scrypt$131072$8$1$'+salt+'$'+key.toString('hex');
}
export async function verifyPassword(password,hash){
  const parts=String(hash).split('$');
  if(parts.length!==6||parts[0]!=='scrypt'||parts[1]!=='131072'||parts[2]!=='8'||parts[3]!=='1'||!/^[a-f0-9]{32}$/.test(parts[4])||!/^[a-f0-9]{128}$/.test(parts[5]))return false;
  const key=await derive(password,parts[4],64,options);
  return timingSafeEqual(key,Buffer.from(parts[5],'hex'));
}
export const tokenHash=token=>createHash('sha256').update(token).digest('hex');
export function createSession(db,adminId=null){
  const token=randomBytes(32).toString('hex'),csrf=randomBytes(32).toString('hex'),now=Date.now(),expires=now+8*60*60*1000;
  db.prepare('INSERT INTO sessions(token_hash,admin_id,csrf,expires_at,last_seen) VALUES(?,?,?,?,?)').run(tokenHash(token),adminId,csrf,expires,now);
  return {token,csrf,admin_id:adminId,expires_at:expires,last_seen:now,token_hash:tokenHash(token)};
}
export function getSession(db,req){
  const token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('nautilus_sid='))?.slice(13);
  if(!token||!/^[a-f0-9]{64}$/.test(token))return null;
  const s=db.prepare('SELECT * FROM sessions WHERE token_hash=?').get(tokenHash(token));
  if(!s)return null;
  if(s.expires_at<Date.now()||s.last_seen<Date.now()-30*60*1000){db.prepare('DELETE FROM sessions WHERE token_hash=?').run(s.token_hash);return null;}
  db.prepare('UPDATE sessions SET last_seen=? WHERE token_hash=?').run(Date.now(),s.token_hash);
  return s;
}
export function validCsrf(session,token){return !!session&&typeof token==='string'&&token.length===64&&/^[a-f0-9]+$/.test(token)&&timingSafeEqual(Buffer.from(token),Buffer.from(session.csrf));}
export function cookie(session,production){return 'nautilus_sid='+session.token+'; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800'+(production?'; Secure':'');}
export function allowRequest(db,ip,bucket,secret,limit=10,windowMs=15*60*1000){
  const key=createHmac('sha256',secret).update(bucket+':'+ip).digest('hex'),now=Date.now();
  db.prepare('DELETE FROM rate_limits WHERE resets_at<?').run(now);
  db.prepare('INSERT INTO rate_limits(key,count,resets_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key,now+windowMs);
  return db.prepare('SELECT count FROM rate_limits WHERE key=?').get(key).count<=limit;
}
export const escapeHtml = value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
