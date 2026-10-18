import fs from 'node:fs';
import {session} from '../session-support.mjs';
const [label,inputFile,...args]=process.argv.slice(2),s=session('draft-e');
const r=s.run(label,args,{entry:'embedded',...(inputFile!=='-'?{input:JSON.parse(fs.readFileSync(new URL(inputFile,import.meta.url)))}:{})});
const v=r.value;console.log(JSON.stringify({label:r.label,ok:v?.ok,code:v?.code,revision:v?.revision,unit:v?.unit,keys:Object.keys(v??{}),result:JSON.stringify(v).length<2200?v:undefined}));
