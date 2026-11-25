import {readFile} from 'node:fs/promises';
let failed=false;
for(const path of process.argv.slice(2)){
 const report=JSON.parse(await readFile(path,'utf8'));
 for(const key of ['performance','accessibility','best-practices','seo']){
  const score=Math.round((report.categories?.[key]?.score??0)*100);console.log(path,key,score);if(score<90)failed=true;
 }
}
if(failed)throw new Error('Lighthouse siht >=90 ei ole kõigis kategooriates täidetud. Vaata HTML-raportit.');
