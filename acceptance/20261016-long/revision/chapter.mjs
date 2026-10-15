import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {project,revision,read,write,sha,cli} from './session-tools.mjs';
const [action,number]=process.argv.slice(2), n=Number(number), id=String(n).padStart(2,'0');
const before=read(path.join(revision,'before/.writer/state.json'));
const old=before.units.find(u=>u.unit===n);
const historicalName=n<=4?`record-${id}.json`:`record-b${id}.json`;
if(action==='prepare'){
  if([2,3,6].includes(n)){
    const rel=`大纲/单元/${String(n).padStart(4,'0')}.json`;
    const plan=JSON.parse(fs.readFileSync(path.join(revision,'before',rel),'utf8').replaceAll('七号','九号'));
    write(path.join(revision,`plans/${id}.json`),plan);
    cli(['plan','--input',path.join(revision,`plans/${id}.json`)],`chapters/${id}/plan-result.json`);
  }
  const context=cli(['context','--unit',String(n),'--max-chars','60000'],`chapters/${id}/context.json`);
  const template=cli(['record-template','--unit',String(n),'--draft',old.draft],`chapters/${id}/template.json`);
  write(path.join(revision,`chapters/${id}/state-before.json`),read(path.join(project,'.writer/state.json')));
  // Sources already read in full are only collapsed when byte-identical to before.
  const display=structuredClone(context);
  display.settings=context.settings.map(s=>{
    const original=path.join(revision,'before',s.ref);
    assert.equal(sha(path.join(project,s.ref)),sha(original));
    return {ref:s.ref,sha256:sha(original),read_in_full:'references-before.tmp.md; unchanged'};
  });
  delete display.previous_ending;
  console.log(JSON.stringify({context:display,template},null,2));
}else if(action==='input'){
  const template=read(path.join(revision,`chapters/${id}/template.json`));
  const historical=read(path.join(revision,'before/.writer',historicalName));
  // Only semantic fields from the fully reread historical input are candidates.
  // The live revision and ALL source hashes come exclusively from this chapter's fresh template.
  template.summary=historical.summary.replaceAll('七号','九号');
  template.changes=JSON.parse(JSON.stringify(historical.changes).replaceAll('七号','九号'));
  if(n===6){
    template.changes.ledger.P_KEY={
      custody:{holder:'林岚',location:'林岚随身帆布包拉链内袋的小透明袋内，人在接待间',condition:'袋装未取出，原油污及缺口黑垢未清理，未试配未复制，未换手'},
      reader_known:'第6章末明确铜钥匙仍在林岚包内袋，没有交给许澄。',
      character_known:{林岚:'钥匙仍在自己包内袋，未取出未试，未交许澄。'},
      evidence:[{unit:6,quote:'许澄桌下的抽屉仍锁着，铜钥匙也仍在林岚包内袋里。'}]
    };
  }
  assert(!JSON.stringify(template).includes('七号'));
  write(path.join(revision,`chapters/${id}/record-input.json`),template);
  console.log(JSON.stringify(template,null,2));
}else if(action==='record'){
  console.log(JSON.stringify(cli(['record','--input',path.join(revision,`chapters/${id}/record-input.json`)],`chapters/${id}/record-result.json`),null,2));
  const state=read(path.join(project,'.writer/state.json'));
  assert.deepEqual(state.units[0],before.units[0]);
  assert.deepEqual(state.snapshot.ledger.O_KEY,before.snapshot.ledger.O_KEY);
  assert.equal(sha(path.join(project,before.units[0].draft)),before.units[0].sha256);
  write(path.join(revision,`chapters/${id}/state-after.json`),state);
  write(path.join(revision,`chapters/${id}/check.json`),cli(['check']));
  console.log(JSON.stringify({revision:state.revision,registered:state.units.length,O_LABEL:state.snapshot.ledger.O_LABEL?.statement,P_KEY:state.snapshot.ledger.P_KEY.custody,T_COPY:{status:state.snapshot.ledger.T_COPY.status,due_unit:state.snapshot.ledger.T_COPY.due_unit}}));
}else throw new Error('unknown action');
