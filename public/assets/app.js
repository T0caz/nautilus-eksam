'use strict';
const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#main-nav');
function closeMenu(){menu?.classList.remove('is-open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Ava menüü');}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Sulge menüü':'Ava menüü');menu.classList.toggle('is-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
document.addEventListener('click',e=>{if(menu?.classList.contains('is-open')&&!menu.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
window.matchMedia('(min-width: 600px)').addEventListener('change',closeMenu);
function carousel(slideSelector,buttonSelector,statusSelector,status){
 const slides=[...document.querySelectorAll(slideSelector)];if(!slides.length)return;let current=0;
 for(const b of document.querySelectorAll(buttonSelector))b.addEventListener('click',()=>{slides[current].hidden=true;current=(current+Number(b.dataset.slide||b.dataset.gallery)+slides.length)%slides.length;slides[current].hidden=false;const el=document.querySelector(statusSelector);if(el)el.textContent=status(current,slides.length);});
}
carousel('.popular-slide','[data-slide]','.slider-status',(i,n)=>`Ekspeditsioon ${i+1} / ${n}`);
carousel('.gallery-slide','[data-gallery]','.gallery-status',(i,n)=>`Pilt ${i+1} / ${n}`);
const filters=document.querySelector('#filters');
if(filters){
 const cards=[...document.querySelectorAll('#expedition-results .expedition-card')];
 const apply=()=>{
  const f=Object.fromEntries(new FormData(filters)),needle=(f.q||'').trim().toLocaleLowerCase('et');let shown=0;
  const order={date:(a,b)=>a.dataset.date.localeCompare(b.dataset.date),price:(a,b)=>Number(a.dataset.price)-Number(b.dataset.price),depth:(a,b)=>Number(a.dataset.depth)-Number(b.dataset.depth)}[f.sort]||(()=>0);
  for(const c of [...cards].sort(order)){const d=c.dataset;const visible=(!needle||d.name.includes(needle))&&(!f.region||d.region===f.region)&&(!f.category||d.category===f.category)&&(!f.depth||Number(d.depth)<=Number(f.depth))&&(!f.duration||Number(d.duration)<=Number(f.duration));c.hidden=!visible;if(visible)shown++;c.parentNode.append(c);}
  document.querySelector('#result-count').textContent=`${shown} ${shown===1?'ekspeditsioon':'ekspeditsiooni'}`;
  document.querySelector('#empty-results').hidden=shown!==0;
 };
 filters.addEventListener('submit',e=>{if(document.body.dataset.backend==='true')return;e.preventDefault();apply();const q=new URLSearchParams(new FormData(filters));for(const [k,v]of [...q])if(!v)q.delete(k);history.replaceState(null,'',location.pathname+(q.size?'?'+q.toString():''));});
 if(document.body.dataset.backend!=='true')filters.addEventListener('change',apply);
 let searchTimer;filters.querySelector('[type=search]').addEventListener('input',()=>{if(document.body.dataset.backend==='true')return;clearTimeout(searchTimer);searchTimer=setTimeout(apply,120);});
 if(document.body.dataset.backend!=='true'){const q=new URLSearchParams(location.search);for(const [name,value]of q){const el=filters.elements.namedItem(name);if(el)el.value=value;}apply();}
}
if(document.body.dataset.backend!=='true'){
 const url=new URL(location.href);const select=document.querySelector('#expedition_id');if(select&&url.searchParams.has('retk'))select.value=url.searchParams.get('retk');
 for(const form of document.querySelectorAll('.public-form'))form.addEventListener('submit',e=>{e.preventDefault();const output=form.querySelector('.form-status');output.textContent='Saatmine ei ole staatilises eelvaates saadaval. Käivita moodul4 backend ja ava sama vorm aadressil http://127.0.0.1:3000.';output.setAttribute('tabindex','-1');output.focus();});
}
for(const b of document.querySelectorAll('[data-confirm]'))b.addEventListener('click',e=>{if(!window.confirm(b.dataset.confirm))e.preventDefault();});
document.querySelector('.form-summary')?.focus();
