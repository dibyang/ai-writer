import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {isDeepStrictEqual as same} from 'node:util';
import {createRunner} from '../command-runner.mjs';
const stage=path.resolve('acceptance/20261016-hundred/revision-b'),work=path.resolve('acceptance/20261016-hundred/works/潮汐信号');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'),'utf8')),base=JSON.parse(fs.readFileSync(path.join(stage,'baseline.json'),'utf8'));
const old=JSON.parse(fs.readFileSync(path.join(stage,'before-r165/work/.writer/state.json'),'utf8'));
const final=JSON.parse(fs.readFileSync(path.join(stage,'desired/066.json'),'utf8'));
const missing=[],anchors=[];for(const[id,e]of Object.entries(final.ledger))for(const[a,x]of (e.evidence??[]).entries()){
 const text=fs.readFileSync(path.join(work,x.draft),'utf8'),line=text.slice(0,text.indexOf(x.quote)).split(/\r?\n/).length;
 const row={id,original_index:a,unit:x.unit,quote:x.quote,old_sha256:x.sha256,new_sha256:sha(Buffer.from(text)),line};
 if(!text.includes(x.quote))missing.push(row);else anchors.push(row);
}
const obs=[];for(const[id,x]of Object.entries(old.snapshot.ledger))if(x.type==='observation'){const y=final.ledger[id];for(const k of ['statement','author_truth','status','cast','tags','due_unit'])if(!same(x[k],y[k]))obs.push({id,field:k,before:x[k],after:y[k]});}
const lengths=base.units.map(u=>{const t=fs.readFileSync(path.join(work,u.draft),'utf8'),body=t.split(/\r?\n/).slice(1).join('\n');return {unit:u.unit,han:(body.match(/\p{Script=Han}/gu)??[]).length,sha256:sha(Buffer.from(t))};});
const changed=base.manifest.filter(x=>!x.path.startsWith('.writer/')&&!x.path.startsWith('审查/')).filter(x=>sha(fs.readFileSync(path.join(work,x.path)))!==x.sha256).map(x=>x.path);
const from=Math.min(...changed.flatMap(p=>{const units=old.units.filter(u=>u.draft===p||Object.hasOwn(u.source_hashes,p)).map(u=>u.unit);return units;}));
const runner=createRunner(stage),blocked=runner.last('changed-export-blocked'),context=runner.last('changed-context67');
const result={state_unchanged:same(state,old),state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))),blocked_export_absent:!fs.existsSync(path.join(stage,'blocked-export')),context_exit:context.exit_code,export_exit:blocked.exit_code,recovery_from:JSON.parse(context.stdout||context.stderr).recovery.from,actual_earliest:from,changed,missing,anchor_count:anchors.length,observations:obs,lengths_invalid:lengths.filter(x=>x.unit>=25&&(x.han<2400||x.han>3200)),first_part_units_unchanged:same(old.units.slice(0,24),state.units.slice(0,24))};
fs.writeFileSync(path.join(stage,'preflight.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(stage,'desired-anchor-inventory.json'),JSON.stringify(anchors,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(stage,'han-before-rebuild.json'),JSON.stringify(lengths,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result,null,2));
console.log('FIELD T_NEW_ROOM_COST@57 '+JSON.stringify(JSON.parse(fs.readFileSync(path.join(stage,'desired/057.json'),'utf8')).ledger.T_NEW_ROOM_COST));
if(!result.state_unchanged||!result.blocked_export_absent||context.exit_code!==2||blocked.exit_code!==2||from!==36||missing.length||result.lengths_invalid.length)process.exitCode=3;
