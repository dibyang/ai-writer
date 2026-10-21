import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证');
for(let i=1;i<=5;i++){const n=`w-br-18-part-${String(i).padStart(2,'0')}.md`;fs.copyFileSync(path.join(P,'.writer/drafts',n),path.join(W,'originals','br-first-'+n),fs.constants.COPYFILE_EXCL);}console.log('five first part drafts preserved');
