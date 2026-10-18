import fs from 'node:fs';
import {base,project,put,input,rev,cli,hash} from './native-one-helper.mjs';
put(base+'/native-one-authored-inputs/rules-v2.md',fs.readFileSync(project+'/设定/权威规则.md'));
cli('freeze-rules-future',['source','freeze','--input',input('freeze-rules-future',{expected_revision:rev(),operation_id:'native-one-rules-v2-freeze',ref:'设定/权威规则.md',version_id:'RULES_V2_FROM7',previous:'RULES_V1'})]);
const r=cli('impact-rules-future',['source','impact','--input',input('impact-rules-future',{version_id:'RULES_V2_FROM7',from:7,mode:'future'})]);
let text='';for(const [ref,h]of Object.entries(r.impact.required_readings)){if(hash(project+'/'+ref)!==h)throw Error('Required version mismatch '+ref);text+=`\n\n<!-- ${ref}; SHA256=${h} -->\n`+fs.readFileSync(project+'/'+ref,'utf8');}
put(base+'/native-one-readings/future-required-readings.md',text);
