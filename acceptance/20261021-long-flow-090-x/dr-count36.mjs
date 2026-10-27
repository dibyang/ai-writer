import fs from 'node:fs';
const P=new URL('./scenario/东岸末班船-再扩展验证/',import.meta.url);
let sum=0;for(let i=1;i<=6;i++){const path=`分段/0036/${String(i).padStart(2,'0')}-dr-v1.md`,t=fs.readFileSync(new URL(path,P),'utf8'),han=(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length;sum+=han;console.log(JSON.stringify({path,han}));}console.log(JSON.stringify({sum}));
