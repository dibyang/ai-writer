import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {ROOT,main,initProject,savePlan,record,enableLong} from '../lib/workspace.mjs';
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function fixture(t){
 const tmp=path.join(ROOT,'.tmp');fs.mkdirSync(tmp,{recursive:true});
 const base=fs.mkdtempSync(path.join(tmp,'recovery-guidance-')),root=path.join(base,'中文 空格作品');
 t.after(()=>{assert.ok(fs.realpathSync(base).startsWith(fs.realpathSync(tmp)+path.sep));fs.rmSync(base,{recursive:true,force:true})});
 initProject(root,'novel','恢复指引',{legacy:true});enableLong(root,0);
 fs.writeFileSync(path.join(base,'volume.json'),JSON.stringify({id:'V1',title:'收据',start:1,end:4,promises:['查清'],constraints:[],reserved:[],arcs:[{id:'A1',start:1,end:4,goal:'核实',payoff:'查清',forbidden:[]}]}));
 main(['volume','--project',root,'--input',path.join(base,'volume.json')]);
 fs.writeFileSync(path.join(root,'设定/场所.md'),'收据柜在值班室。\n');
 for(let unit=1;unit<=3;unit++){
  savePlan(root,{unit,title:'收据',goal:'核实',change:'新进展',beats:['查看'],setting_refs:unit===2?['设定/场所.md']:[]});
  const draft=`正文/${String(unit).padStart(4,'0')}.md`,tx=main(['record-template','--project',root,'--unit',String(unit),'--draft',draft]);
  fs.writeFileSync(path.join(root,draft),`第${unit}张收据交给值班人。\n`);tx.summary=`核对第${unit}张收据`;record(root,tx);
 }
 return{base,root};
}
function cli(root,args){const r=spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),...args,'--project',root],{encoding:'utf8'});assert.equal(r.error,undefined);return r;}
for(const mode of ['mixed','source','body'])test(`恢复指引汇总${mode}变动，与status一致且一次回退可继续`,t=>{
 const {base,root}=fixture(t),stateFile=path.join(root,'.writer/state.json');
 if(mode!=='body')fs.appendFileSync(path.join(root,'设定/场所.md'),'查阅须先约值班人。\n');
 if(mode!=='source')fs.appendFileSync(path.join(root,'正文/0003.md'),'本章追加一处核对。\n');
 const expected=mode==='body'?3:2,before=sha(stateFile),revision=JSON.parse(fs.readFileSync(stateFile)).revision;
 const c=cli(root,['context','--unit','4']);assert.equal(c.status,2);const detail=JSON.parse(c.stderr);
 assert.equal(detail.code,'CONTEXT_CHANGED');assert.equal(detail.recovery.from,expected);assert.equal(detail.recovery.expected_revision,revision);
 assert.deepEqual(detail.recovery.stale_units,mode==='source'?[]:[3]);assert.deepEqual(detail.recovery.changed_sources.map(x=>x.unit),mode==='body'?[]:[2]);
 if(mode!=='body')assert.match(detail.error,/创作来源已变化/);if(mode!=='source')assert.match(detail.error,/正文已变化/);
 assert.equal(detail.next_command,main(['status','--project',root]).next.command);assert.match(detail.next_action,/回退/);
 const out=path.join(base,'blocked-export'),e=cli(root,['export','--out',out]);assert.equal(e.status,2);assert.deepEqual(JSON.parse(e.stderr).recovery,detail.recovery);assert.equal(fs.existsSync(out),false);assert.equal(sha(stateFile),before);
 main(['rewind','--project',root,'--from',String(detail.recovery.from),'--expected-revision',String(detail.recovery.expected_revision)]);
 const packet=main(['context','--project',root,'--unit',String(expected)]);assert.equal(packet.ok,true);assert.equal(packet.unit,expected);assert.ok(fs.existsSync(path.join(root,'正文/0003.md')));
 if(mode!=='body')assert.equal(packet.source_hashes['设定/场所.md'],sha(path.join(root,'设定/场所.md')));
});

test('正文也是后章消费的来源，恢复点不得错选到后章',t=>{
 const {root}=fixture(t);fs.appendFileSync(path.join(root,'正文/0002.md'),'第二章补充动作。\n');
 const r=cli(root,['context','--unit','4']);assert.equal(r.status,2);const detail=JSON.parse(r.stderr);
 assert.equal(detail.code,'CONTEXT_CHANGED');assert.equal(detail.recovery.from,2);assert.deepEqual(detail.recovery.stale_units,[2]);assert.deepEqual(detail.recovery.changed_sources,[{unit:3,ref:'正文/0002.md'}]);
 assert.equal(detail.next_command,main(['status','--project',root]).next.command);
 main(['rewind','--project',root,'--from','2','--expected-revision',String(detail.recovery.expected_revision)]);
 assert.equal(main(['context','--project',root,'--unit','2']).ok,true);
});
