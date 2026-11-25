import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomUUID,randomBytes} from 'node:crypto';
import {openDatabase,seed,root,listExpeditions,hydrate} from './db.mjs';
import {createSession,getSession,validCsrf,cookie,allowRequest,verifyPassword,hashPassword} from './security.mjs';
import {validateContact,validateRegistration,validateExpedition,ValidationError} from './validation.mjs';
import * as view from './views.mjs';
const contentTypes={'.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
async function readBody(req){
 let size=0;const chunks=[];
 for await(const chunk of req){size+=chunk.length;if(size>65536)throw Object.assign(new Error('Vorm on liiga mahukas.'),{status:413});chunks.push(chunk);}
 const text=Buffer.concat(chunks).toString('utf8'),type=(req.headers['content-type']||'').split(';')[0];
 if(type==='application/json'){try{const data=JSON.parse(text);if(!data||Array.isArray(data)||typeof data!=='object')throw Error();return data;}catch{throw Object.assign(new Error('Vigane JSON.'),{status:400});}}
 if(type==='application/x-www-form-urlencoded')return Object.fromEntries(new URLSearchParams(text));
 throw Object.assign(new Error('Vormi vorming ei ole toetatud.'),{status:415});
}
export async function createApp({db,secret,origin='http://127.0.0.1:3000',production=false}={}){
 if(!secret||secret.length<32)throw new Error('APP_SECRET peab sisaldama vähemalt 32 juhuslikku tähemärki. Käivita npm run setup.');
 const expectedOrigin=new URL(origin).origin;
 if(production&&!expectedOrigin.startsWith('https://'))throw new Error('Tootmiskeskkonnas peab APP_ORIGIN kasutama HTTPS-i.');
 db??=openDatabase();seed(db);
 const dummyHash=await hashPassword(randomBytes(32).toString('hex'));
 const server=createServer(async(req,res)=>{
  const csp="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'";
  res.setHeader('Content-Security-Policy',csp);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');res.setHeader('Cache-Control','no-store');
  if(production)res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains');
  const send=(status,body,type='text/html; charset=utf-8')=>{res.statusCode=status;res.setHeader('Content-Type',type);const bytes=Buffer.from(body);res.setHeader('Content-Length',bytes.length);res.end(req.method==='HEAD'?undefined:bytes);};
  const json=(status,value)=>send(status,JSON.stringify(value),'application/json; charset=utf-8');
  const redirect=url=>{res.statusCode=303;res.setHeader('Location',url);res.end();};
  let session=null;const opts=()=>({server:true,csrf:session?.csrf||''});
  try{
   const url=new URL(req.url,expectedOrigin),path=decodeURIComponent(url.pathname);
   if(!['GET','HEAD','POST'].includes(req.method)){res.setHeader('Allow','GET, HEAD, POST');return send(405,view.errorPage(405,'See meetod ei ole lubatud.',opts()));}
   if(path.startsWith('/assets/')&&['GET','HEAD'].includes(req.method)){
    const file=resolve(root,'public','.'+path);const base=resolve(root,'public','assets')+sep;
    if(!file.startsWith(base)||!contentTypes[extname(file)]||!(await stat(file).catch(()=>null))?.isFile())return send(404,view.errorPage(404,'Faili ei leitud.',opts()));
    const data=await readFile(file);res.setHeader('Cache-Control','public, max-age=3600');return send(200,data,contentTypes[extname(file)]);
   }
   if(path==='/robots.txt')return send(200,'User-agent: *\nDisallow: /admin\n','text/plain; charset=utf-8');
   if(path==='/health')return json(200,{ok:db.prepare('SELECT 1 AS ok').get().ok===1});
   session=getSession(db,req);
   if(!session){session=createSession(db);res.setHeader('Set-Cookie',cookie(session,production));}
   const all=()=>listExpeditions(db);
   if(req.method==='POST'){
    const ip=req.socket.remoteAddress||'unknown';
    if(!allowRequest(db,ip,'post',secret,100)){res.setHeader('Retry-After','900');return send(429,view.errorPage(429,'Liiga palju päringuid. Proovi 15 minuti pärast uuesti.',opts()));}
    const data=await readBody(req);
    if((req.headers.origin&&req.headers.origin!==expectedOrigin)||!validCsrf(session,data._csrf||req.headers['x-csrf-token']))return send(403,view.errorPage(403,'Turvakinnitus aegus või ei sobi. Ava vorm uuesti ja proovi veel kord.',opts()));
    const api=path.startsWith('/api/');
    if(path==='/kontakt.html'||path==='/api/contact'){
     if(!allowRequest(db,ip,'contact',secret,10))return send(429,view.errorPage(429,'Sõnumite piirmäär on täis. Proovi 15 minuti pärast uuesti.',opts()));
     try{const v=validateContact(data),receipt=randomUUID();db.prepare('INSERT INTO contacts(receipt,name,email,subject,message,consent) VALUES(?,?,?,?,?,?)').run(receipt,v.name,v.email,v.subject,v.message,1);return api?json(201,{ok:true,receipt}):redirect('/aitah.html?kind=contact&receipt='+receipt);}
     catch(e){if(e instanceof ValidationError)return api?json(422,{errors:e.errors}):send(422,view.contact({...opts(),values:data,errors:e.errors}));throw e;}
    }
    if(path==='/registreerimine.html'||path==='/api/registrations'){
     if(!allowRequest(db,ip,'registration',secret,10))return send(429,view.errorPage(429,'Päringute piirmäär on täis. Proovi 15 minuti pärast uuesti.',opts()));
     try{const v=validateRegistration(data,db),receipt=randomUUID();db.prepare('INSERT INTO registrations(receipt,expedition_id,expedition_name,name,email,participants,donation_cents,consent) VALUES(?,?,?,?,?,?,?,?)').run(receipt,v.expedition_id,v.expedition_name,v.name,v.email,v.participants,v.donation_cents,1);return api?json(201,{ok:true,receipt,paymentTaken:false}):redirect('/aitah.html?kind=registration&receipt='+receipt);}
     catch(e){if(e instanceof ValidationError)return api?json(422,{errors:e.errors}):send(422,view.register(all(),{...opts(),values:data,errors:e.errors}));throw e;}
    }
    if(path==='/admin/login'){
     if(!allowRequest(db,ip,'login',secret,5)){res.setHeader('Retry-After','900');return send(429,view.login({...opts(),error:'Liiga palju sisselogimiskatseid. Proovi 15 minuti pärast uuesti.'}));}
     const email=typeof data.email==='string'?data.email.trim().toLowerCase():'',password=typeof data.password==='string'?data.password:'';
     const admin=db.prepare('SELECT * FROM admins WHERE email=?').get(email.slice(0,254));
     const valid=password.length<=256&&await verifyPassword(password,admin?.password_hash||dummyHash);
     if(!admin||!valid)return send(401,view.login({...opts(),error:'E-posti aadress või parool ei sobi.'}));
     db.prepare('DELETE FROM sessions WHERE token_hash=?').run(session.token_hash);session=createSession(db,admin.id);res.setHeader('Set-Cookie',cookie(session,production));return redirect('/admin');
    }
    if(path.startsWith('/admin')){
     if(!session.admin_id)return send(403,view.errorPage(403,'See tegevus nõuab administraatori sisselogimist.',opts()));
     if(path==='/admin/logout'){db.prepare('DELETE FROM sessions WHERE token_hash=?').run(session.token_hash);res.setHeader('Set-Cookie','nautilus_sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'+(production?'; Secure':''));return redirect('/admin/login');}
     const match=path.match(/^\/admin\/expeditions\/(?:(new)|(\d+)\/(edit|delete))$/);
     if(match){
      const e=match[2]?hydrate(db.prepare('SELECT * FROM expeditions WHERE id=?').get(Number(match[2]))):{};
      if(!e)return send(404,view.errorPage(404,'Ekspeditsiooni ei leitud.',opts()));
      if(match[3]==='delete'){db.prepare('DELETE FROM expeditions WHERE id=?').run(e.id);return redirect('/admin?saved=deleted');}
      try{
       const v=validateExpedition(data);const values=[v.slug,v.name,v.category,v.description,v.location,v.region,v.depth,v.duration,v.price_cents,v.date,v.capacity,JSON.stringify(v.images)];
       if(e.id)db.prepare('UPDATE expeditions SET slug=?,name=?,category=?,description=?,location=?,region=?,depth=?,duration=?,price_cents=?,date=?,capacity=?,images=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(...values,e.id);
       else db.prepare('INSERT INTO expeditions(slug,name,category,description,location,region,depth,duration,price_cents,date,capacity,images) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(...values);
       return redirect('/admin?saved=yes');
      }catch(err){if(err instanceof ValidationError)return send(422,view.expeditionForm(e,{...opts(),values:data,errors:err.errors}));if(String(err.message).includes('UNIQUE constraint failed: expeditions.slug'))return send(422,view.expeditionForm(e,{...opts(),values:data,errors:{slug:'See URL-tunnus on juba kasutusel.'}}));throw err;}
     }
    }
    return send(404,view.errorPage(404,'Vormi aadressi ei leitud.',opts()));
   }
   if(path==='/api/csrf')return json(200,{csrf:session.csrf});
   if(path==='/api/expeditions')return json(200,{items:listExpeditions(db,Object.fromEntries(url.searchParams))});
   const apiId=path.match(/^\/api\/expeditions\/(\d+)$/);
   if(apiId){const e=hydrate(db.prepare('SELECT * FROM expeditions WHERE id=?').get(Number(apiId[1])));return json(e?200:404,e?{item:e}:{error:'Ei leitud'});}
   if(path==='/admin/login')return session.admin_id?redirect('/admin'):send(200,view.login(opts()));
   if(path.startsWith('/admin')){
    if(!session.admin_id)return redirect('/admin/login');
    if(path==='/admin'||path==='/admin/')return send(200,view.adminPage(db,{...opts(),notice:url.searchParams.has('saved')?'Muudatus salvestati.':''}));
    if(path==='/admin/expeditions/new')return send(200,view.expeditionForm({},opts()));
    const match=path.match(/^\/admin\/expeditions\/(\d+)\/edit$/);
    if(match){const e=hydrate(db.prepare('SELECT * FROM expeditions WHERE id=?').get(Number(match[1])));return send(e?200:404,e?view.expeditionForm(e,opts()):view.errorPage(404,'Ekspeditsiooni ei leitud.',opts()));}
   }
   if(path==='/'||path==='/index.html')return send(200,view.home(all(),opts()));
   if(path==='/ekspeditsioonid.html')return send(200,view.listing(listExpeditions(db,Object.fromEntries(url.searchParams)),Object.fromEntries(url.searchParams),opts()));
   if(path==='/kontakt.html')return send(200,view.contact(opts()));
   if(path==='/toeta.html')return send(200,view.register(all(),{...opts(),kind:'donation'}));
   if(path==='/registreerimine.html')return send(200,view.register(all(),{...opts(),expeditionId:url.searchParams.get('retk'),kind:url.searchParams.get('kind')}));
   if(path==='/privaatsus.html'||path==='/materjalid.html')return send(200,view.info(path==='/privaatsus.html'?'privacy':'materials',opts()));
   if(path==='/aitah.html'){
    const receipt=url.searchParams.get('receipt')||'',kind=url.searchParams.get('kind')==='contact'?'contact':'registration';
    // Receipts contain no personal data and are only shown after an existing record was created.
    const found=kind==='contact'?db.prepare('SELECT id FROM contacts WHERE receipt=?').get(receipt):db.prepare('SELECT id FROM registrations WHERE receipt=?').get(receipt);
    if(!found)return send(404,view.errorPage(404,'Päringu kinnitust ei leitud.',opts()));
    return send(200,view.thankyou(kind,receipt,opts()));
   }
   const detail=path.match(/^\/ekspeditsioon-([a-z0-9-]+)\.html$/);
   if(detail){const e=hydrate(db.prepare('SELECT * FROM expeditions WHERE slug=?').get(detail[1]));return send(e?200:404,e?view.detail(e,opts()):view.errorPage(404,'Ekspeditsiooni ei leitud.',opts()));}
   return send(404,view.errorPage(404,'Lehte ei leitud. Vali menüüst uus siht.',opts()));
  }catch(err){const status=err.status||(err instanceof URIError?400:500);if(status===500)console.error('Request failed:',err.code||err.name);if(!res.headersSent)send(status,view.errorPage(status,status===500?'Server ei saanud päringut töödelda. Proovi hiljem uuesti.':err.message,opts()));else res.end();}
 });
 const cleanup=setInterval(()=>db.prepare('DELETE FROM sessions WHERE expires_at<? OR last_seen<?').run(Date.now(),Date.now()-30*60*1000),15*60*1000);cleanup.unref();server.once('close',()=>clearInterval(cleanup));
 server.requestTimeout=15000;server.headersTimeout=10000;server.maxHeadersCount=50;
 return {server,db};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const port=Number(process.env.PORT||3000),host=process.env.HOST||'127.0.0.1';
 const {server,db}=await createApp({secret:process.env.APP_SECRET,origin:process.env.APP_ORIGIN||`http://${host}:${port}`,production:process.env.NODE_ENV==='production'});
 server.listen(port,host,()=>console.log(`Nautilus: ${process.env.APP_ORIGIN||`http://${host}:${port}`}\nAdmin: /admin`));
 const stop=()=>server.close(()=>{db.close();process.exit(0);});process.once('SIGTERM',stop);process.once('SIGINT',stop);
}
