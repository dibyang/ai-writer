import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual as same } from 'node:util';
import { replaySnapshots } from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',[phase,fromText,toText]=process.argv.slice(2),from=Number(fromText),to=Number(toText);
if(!/^[a-z0-9-]+$/.test(phase??'')||!Number.isInteger(from)||!Number.isInteger(to)||from<1||to<from)throw Error('inspect-new-transitions phase from to');
const root=path.join(base,'checkpoints',phase,'files'),state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'))),audit=JSON.parse(fs.readFileSync(path.join(base,'audits',phase+'.json')));
if(!audit.ok||to>state.units.length)throw Error('Requires frozen successful audit');
const snapshots=replaySnapshots(root,state),rows=[],values=[],intern=new Map();
function flat(value,key='',out=new Map()){
 if(value&&typeof value==='object'){for(const[k,v]of Object.entries(value)){if(['evidence','introduced_unit','updated_unit'].includes(k))continue;flat(v,key?key+'.'+k:k,out);}}
 else out.set(key,value);return out;
}
function valueId(value,unit,field,side){
 const key=JSON.stringify([value!==undefined,value??null]);let id=intern.get(key);
 if(id===undefined){id=values.length;intern.set(key,id);values.push({id,defined:value!==undefined,value:value??null,first_unit:unit,last_unit:unit,fields:[],sides:[]});}
 const row=values[id];row.last_unit=unit;if(!row.fields.includes(field))row.fields.push(field);if(!row.sides.includes(side))row.sides.push(side);return id;
}
for(let unit=from;unit<=to;unit++){
 const a=flat(snapshots[unit-1]),b=flat(snapshots[unit]);
 for(const field of new Set([...a.keys(),...b.keys()]))if(!same(a.get(field),b.get(field)))rows.push({unit,field,before:valueId(a.get(field),unit,field,'before'),after:valueId(b.get(field),unit,field,'after')});
}
const out=path.join(base,'transition-readings',phase);fs.mkdirSync(path.dirname(out),{recursive:true});fs.mkdirSync(out);
const file=path.join(out,'transitions.json');fs.writeFileSync(file,JSON.stringify({scope:'Actual sequential non-evidence snapshot changes for semantic reading; rows are not an automatic quality pass',phase,revision:state.revision,from,to,rows,values},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output:file,changed_cells:rows.length,unique_values:values.length,from,to}));
