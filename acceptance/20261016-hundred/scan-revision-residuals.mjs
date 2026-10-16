import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {replaySnapshots} from './rebuild-utils.mjs';
const [label,fromText,rulesFile,outputLabel=label+'-residual-scan']=process.argv.slice(2),base='acceptance/20261016-hundred',from=Number(fromText);
assert(/^[a-z][a-z0-9-]*$/.test(label??'')&&Number.isInteger(from)&&from>0&&rulesFile);
assert(/^[a-z][a-z0-9-]*$/.test(outputLabel));
const work=`${base}/checkpoints/${label}/files`,bytes=fs.readFileSync(`${work}/.writer/state.json`),state=JSON.parse(bytes);
const rules=JSON.parse(fs.readFileSync(rulesFile,'utf8')).map(r=>({...r,regex:new RegExp(r.pattern,'gu')}));
const snapshots=replaySnapshots(work,state),matches=new Map();
function walk(value,field,unit){
 if(typeof value==='string'){
  for(const rule of rules){
   rule.regex.lastIndex=0;
   for(const hit of value.matchAll(rule.regex)){
    const context=value.slice(Math.max(0,hit.index-80),hit.index+hit[0].length+100);
    const key=JSON.stringify([rule.id,field,hit[0],context]);
    if(!matches.has(key))matches.set(key,{rule:rule.id,field,match:hit[0],context,units:[]});
    const row=matches.get(key);if(!row.units.includes(unit))row.units.push(unit);
   }
  }
 }else if(Array.isArray(value)){value.forEach((item,i)=>walk(item,`${field}.${i}`,unit));}
 else if(value&&typeof value==='object'){for(const [key,item]of Object.entries(value))walk(item,field?`${field}.${key}`:key,unit);}
}
for(let unit=from;unit<snapshots.length;unit++)walk(snapshots[unit],'',unit);
const rows=[...matches.values()],output=`${base}/revision-comparisons/${outputLabel}.json`;
const result={at:new Date().toISOString(),scope:'Locators in every replayed snapshot string, including unchanged fields; matches require reading and are not automatic defects or approval',label,from,through:state.units.length,state_sha256:crypto.createHash('sha256').update(bytes).digest('hex'),rules_file:rulesFile,rows};
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output,unique_locations:rows.length,counts:Object.fromEntries(rules.map(r=>[r.id,rows.filter(x=>x.rule===r.id).length]))}));
