import fs from 'node:fs';import path from 'node:path';
import {runner,cli,project,stage,hash} from './workflow.mjs';
const dir=stage+'/repair-95';fs.mkdirSync(dir,{recursive:true});
const state=JSON.parse(fs.readFileSync(project+'/.writer/state.json'));
if(state.units.at(-1).unit!==95||state.revision!==343)throw Error('Unexpected state for repair');
for(const [source,name] of [[project+'/.writer/state.json','state-before.json'],[project+'/正文/0095-先写今天这一页.md','draft-95-before.md'],[stage+'/record-95.json','record-before.json'],[stage+'/record-95-before.json','template-before.json'],[stage+'/context-95.json','context-before.json'],[stage+'/changes-95.json','changes-before.json'],[stage+'/record-96-before.json','template-96-invalidated.json'],[stage+'/context-96.json','context-96-invalidated.json']])fs.copyFileSync(source,dir+'/'+name,fs.constants.COPYFILE_EXCL);
const unit=state.units.at(-1);fs.writeFileSync(dir+'/unit-before.json',JSON.stringify(unit,null,2)+'\n');
for(const [k,v] of Object.entries(unit))if(/journal/i.test(k)&&typeof v==='string'){
 const f=path.resolve(project,v);if(!f.startsWith(path.resolve(project)+path.sep))throw Error('Outside journal path');
 if(fs.existsSync(f))fs.copyFileSync(f,dir+'/journal-95-before.json',fs.constants.COPYFILE_EXCL);
}
fs.writeFileSync(dir+'/impact.md','# 登记遗漏修复\n\n最早受影响单元95。95正文已实际告何27单页，但P_QIU_SINGLE_27.reader_known仍留92的“何未听本次”，沈的该项knowledge未补95已告，容易将历史时点当当前。95其他T_PAGE_PAIR/T_VOICE_CONSENT与何条已更新，遗漏在同项同步。\n\n影响消费：仅95当前追踪与96写前context/template（96未写未登记）。93报告覆盖88—93不消费95，正文哈希未变。95正文不改；重登补齐本条reader_known与沈知识。保留全部原始输入、当前状态、权威unit及其journal指向和正文。计划96未改，旧96context/template作废。所有权威写入经CLI rewind/record，不写state/journal。\n');
console.log(JSON.stringify({unit,journal_directory:fs.readdirSync(project+'/.writer/journal').length,state_sha256:hash(project+'/.writer/state.json'),draft_sha256:hash(project+'/正文/0095-先写今天这一页.md')}));
const help=cli('rewind-help-repair95',['rewind','--help']);console.log(help.stdout);if(help.exit_code!==0)process.exit(help.exit_code??1);
const r=cli('rewind-95-cli',['rewind','--from','95','--expected-revision','343']);console.log(r.stdout);console.error(r.stderr);process.exitCode=r.exit_code??1;
