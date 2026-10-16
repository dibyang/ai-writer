import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual as same} from 'node:util';
import {replaySnapshots} from './rebuild-utils.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)),[left,right,fromText='1']=process.argv.slice(2),from=Number(fromText);
if(![left,right].every(x=>/^[a-z0-9-]+$/.test(x??''))||!Number.isInteger(from)||from<1)throw Error('Use two checkpoints and first unit');
function load(label){const work=path.join(base,'checkpoints',label,'files'),state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));return{state,snapshots:replaySnapshots(work,state)}}
const a=load(left),b=load(right),rows=[],values=[],intern=new Map();
function flat(value,key='',out=new Map()){
 if(value&&typeof value==='object'){for(const[k,v]of Object.entries(value)){if(['evidence','introduced_unit','updated_unit'].includes(k))continue;flat(v,key?key+'.'+k:k,out)}}else out.set(key,value);
 return out;
}
function textId(value,unit,field,side){
 const key=JSON.stringify([value!==undefined,value??null]);let index=intern.get(key);
 if(index===undefined){index=values.length;intern.set(key,index);values.push({id:index,defined:value!==undefined,value:value??null,first_unit:unit,last_unit:unit,fields:[],sides:[]})}
 const item=values[index];item.last_unit=unit;if(!item.fields.includes(field))item.fields.push(field);if(!item.sides.includes(side))item.sides.push(side);return index;
}
for(let unit=from;unit<=Math.min(a.state.units.length,b.state.units.length);unit++){
 const old=flat(a.snapshots[unit]),current=flat(b.snapshots[unit]);
 for(const field of new Set([...old.keys(),...current.keys()]))if(!same(old.get(field),current.get(field)))rows.push({unit,field,before:textId(old.get(field),unit,field,'before'),after:textId(current.get(field),unit,field,'after')});
}
const output=path.join(base,'revision-comparisons',left+'--'+right+'-snapshot-timeline.json');fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify({scope:'Per-unit actual journal replay; deduplicated changed values require semantic reading, not automatic approval',before_revision:a.state.revision,after_revision:b.state.revision,from,to:Math.min(a.state.units.length,b.state.units.length),rows,values},null,2)+'\n',{flag:'wx'});
const afterValues=values.filter(x=>x.sides.includes('after'));fs.writeFileSync(output.replace('.json','-after-values.json'),JSON.stringify(afterValues,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output,changed_cells:rows.length,unique_values:values.length,unique_after_values:afterValues.length}));
