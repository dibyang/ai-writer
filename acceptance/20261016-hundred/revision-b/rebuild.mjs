import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {isDeepStrictEqual as same} from 'node:util';
import {createRunner} from '../command-runner.mjs';import {changesBetween} from '../rebuild-utils.mjs';
const stage=path.resolve('acceptance/20261016-hundred/revision-b'),work=path.resolve('acceptance/20261016-hundred/works/潮汐信号'),cli=path.resolve('bin/ai-writer.mjs');
const runner=createRunner(stage),base=JSON.parse(fs.readFileSync(path.join(stage,'baseline.json'),'utf8')),summaries=JSON.parse(fs.readFileSync(path.join(stage,'summaries-v2.json'),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8')),state=()=>read(path.join(work,'.writer/state.json')),desired=n=>read(path.join(stage,'desired-v3',String(n).padStart(3,'0')+'.json'));
function command(label,args){const r=runner.run(process.execPath,[cli,...args,'--project',work],label);if(r.exit_code!==0)throw Error(label+' failed '+r.exit_code+' '+r.stderr);return JSON.parse(r.stdout);}
function semantic(v){if(Array.isArray(v))return v.map(semantic);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).filter(([k])=>!['sha256','draft','line','updated_unit'].includes(k)).map(([k,x])=>[k,semantic(x)]));return v;}
const [mode,arg]=process.argv.slice(2),n=Number(arg);fs.mkdirSync(path.join(stage,'inputs'),{recursive:true});
if(mode==='prepare'){
 const s=state();if(s.units.length!==n-1)throw Error('Sequential record required');if(!same(semantic(s.snapshot),semantic(desired(n-1))))throw Error('Previous unit differs from its own desired snapshot');
 const context=command('context-u'+n,['context','--unit',String(n),'--max-chars','1000000']);
 const template=command('template-u'+n,['record-template','--unit',String(n),'--draft',base.units.find(x=>x.unit===n).draft]);
 if(template.expected_revision!==s.revision||!same(template.source_hashes,context.source_hashes))throw Error('Template/context mismatch');
 const changes=changesBetween(s.snapshot,desired(n),n);const input={...template,summary:summaries[n],changes};delete input._instructions;
 const attempt=fs.existsSync(path.join(stage,'rebuild-index.jsonl'))?fs.readFileSync(path.join(stage,'rebuild-index.jsonl'),'utf8').trim().split(/\r?\n/).filter(Boolean).map(JSON.parse).filter(x=>x.unit===n).length+1:1;
 const file=path.join(stage,'inputs',String(n).padStart(3,'0')+'-r'+s.revision+'-a'+attempt+'.json');fs.writeFileSync(file,JSON.stringify(input,null,2)+'\n',{flag:'wx'});
 fs.appendFileSync(path.join(stage,'rebuild-index.jsonl'),JSON.stringify({unit:n,expected_revision:s.revision,input:file,source_hashes:template.source_hashes,desired_version:'desired-v3',desired_sha256:sha(fs.readFileSync(path.join(stage,'desired-v3',String(n).padStart(3,'0')+'.json'))),at:new Date().toISOString()})+'\n');
 const ledger=Object.fromEntries(Object.entries(changes.ledger).map(([id,x])=>[id,{fields:Object.keys(x),statement:x.statement,status:x.status,due_unit:x.due_unit,custody:x.custody,known:Object.fromEntries(Object.entries(x.character_known??{}).map(([k,v])=>[k,v.replace(s.snapshot.ledger[id]?.character_known?.[k]??'\u0000','[prior knowledge retained]')])),quotes:x.evidence?.map(e=>e.quote)}]));
 console.log(JSON.stringify({unit:n,expected_revision:s.revision,input:file,summary:input.summary,source_count:Object.keys(input.source_hashes).length,context_omitted_ids:context.long_form?.recall?.omitted_ids??context.continuity?.recall?.omitted_ids,characters:Object.keys(changes.characters),timeline:changes.timeline_append,ledger},null,2));
}
if(mode==='record'){
 const rows=fs.readFileSync(path.join(stage,'rebuild-index.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse),row=rows.findLast(x=>x.unit===n);if(!row)throw Error('No input');
 const result=command('record-u'+n,['record','--input',row.input]);const s=state();
 if(!same(semantic(s.snapshot),semantic(desired(n))))throw Error('Recorded unit differs semantically from desired '+n);
 fs.appendFileSync(path.join(stage,'recorded.jsonl'),JSON.stringify({unit:n,revision:s.revision,sha256:s.units.at(-1).sha256,journal:s.units.at(-1).journal,expected_revision:row.expected_revision,at:new Date().toISOString(),semantic_equal:true})+'\n');console.log(JSON.stringify({unit:n,revision:s.revision,semantic_equal:true,result},null,2));
}
