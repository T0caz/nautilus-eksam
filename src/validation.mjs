export class ValidationError extends Error { constructor(errors){super('Palun kontrolli vormi välju.');this.errors=errors;} }
const text=(data,key,min,max,errors)=>{const v=typeof data[key]==='string'?data[key].trim():'';if(v.length<min||v.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v))errors[key]=`Sisesta ${min}–${max} tähemärki.`;return v;};
const integer=(data,key,min,max,errors)=>{const s=String(data[key]??'');const n=Number(s);if(!/^\d+$/.test(s)||!Number.isSafeInteger(n)||n<min||n>max)errors[key]=`Vali täisarv ${min}–${max}.`;return n;};
export function moneyToCents(value){const s=String(value??'').trim().replace(',','.');if(!/^\d{1,7}(\.\d{1,2})?$/.test(s))return NaN;const [a,b='']=s.split('.');return Number(a)*100+Number(b.padEnd(2,'0'));}
export function validateContact(data){
  const errors={};const name=text(data,'name',2,100,errors),email=text(data,'email',3,254,errors).toLowerCase(),subject=text(data,'subject',3,150,errors),message=text(data,'message',10,4000,errors);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))errors.email='Sisesta korrektne e-posti aadress.';
  if(!['on','1',true].includes(data.consent))errors.consent='Andmete töötlemise nõusolek on vajalik.';
  if(Object.keys(errors).length)throw new ValidationError(errors);
  return {name,email,subject,message,consent:1};
}
export function validateRegistration(data,db){
  const errors={};const name=text(data,'name',2,100,errors),email=text(data,'email',3,254,errors).toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))errors.email='Sisesta korrektne e-posti aadress.';
  const donateOnly=data.kind==='donation';
  const expedition=donateOnly?null:db.prepare('SELECT * FROM expeditions WHERE id=?').get(/^\d+$/.test(String(data.expedition_id))?Number(data.expedition_id):-1);
  if(!donateOnly&&(!expedition||expedition.date<new Date().toISOString().slice(0,10)))errors.expedition_id='Vali tulevane ekspeditsioon.';
  const participants=donateOnly?0:integer(data,'participants',1,6,errors);
  if(expedition&&participants>expedition.capacity)errors.participants='Retke osalejate ülempiir on '+expedition.capacity+'.';
  const donation_cents=moneyToCents(data.donation||'0');
  if(!Number.isSafeInteger(donation_cents)||donation_cents<(donateOnly?100:0)||donation_cents>1000000)errors.donation='Sisesta summa '+(donateOnly?'1':'0')+'–10 000 eurot (kuni kaks komakohta).';
  if(!['on','1',true].includes(data.consent))errors.consent='Andmete töötlemise nõusolek on vajalik.';
  if(Object.keys(errors).length)throw new ValidationError(errors);
  return {name,email,expedition_id:expedition?.id??null,expedition_name:expedition?.name??null,participants,donation_cents,consent:1};
}
export function validateExpedition(data){
  const errors={};const result={};
  for(const [k,min,max]of [['name',3,100],['slug',3,100],['description',30,6000],['location',2,100],['region',2,100],['category',1,30]])result[k]=text(data,k,min,max,errors);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result.slug))errors.slug='Kasuta väiketähti a–z, numbreid ja sidekriipse.';
  if(!['Vrakiuuring','Ajalugu','Tehnoloogia'].includes(result.category))errors.category='Vali korrektne kategooria.';
  for(const[k,min,max]of [['depth',1,11000],['duration',1,365],['capacity',1,100]])result[k]=integer(data,k,min,max,errors);
  result.price_cents=moneyToCents(data.price);if(!Number.isSafeInteger(result.price_cents)||result.price_cents<0||result.price_cents>100000000)errors.price='Sisesta korrektne hind kuni 1 000 000 eurot.';
  result.date=String(data.date||'');const d=new Date(result.date+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(result.date)||!Number.isFinite(d.valueOf())||d.toISOString().slice(0,10)!==result.date)errors.date='Sisesta kehtiv kuupäev.';
  result.images=typeof data.images==='string'?data.images.split(',').map(s=>s.trim()).filter(Boolean):[];
  if(result.images.length<1||result.images.length>6||result.images.some(s=>!['hero','wreck','submarine','station','jellyfish','texture'].includes(s)))errors.images='Vali 1–6 pilditunnust: hero, wreck, submarine, station, jellyfish, texture.';
  if(Object.keys(errors).length)throw new ValidationError(errors);
  return result;
}
