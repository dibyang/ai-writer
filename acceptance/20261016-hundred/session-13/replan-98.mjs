import fs from 'node:fs';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-13',p=stage+'/plan-98.json',project='acceptance/20261016-hundred/works/潮汐信号',r=createRunner(stage);
const j=JSON.parse(fs.readFileSync(p));fs.copyFileSync(p,stage+'/plan-98-before-cast.json');j.cast.push('素姐');fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');
fs.writeFileSync(stage+'/unregistered-98-cast-correction.md','未登记98章新增有场景利益的取餐人素姐，写前plan已计划取餐场面但漏列其称呼。保留原plan/template；state仍347，尚未消费98正文/章纲，无已登记受影响单元。重新plan/context/template后仅继续本未登记稿自检，不手改state、不以重取哈希绕过已登记漂移。\n');
for(const[label,a]of [['plan-98-cast-cli',['plan','--input',p]],['context-98-cast',['context','--unit','98','--max-chars','230000']],['template-98-cast',['record-template','--unit','98','--draft','正文/0098-到点以后椅子还在.md']]]){const x=r.run('node',['bin/ai-writer.mjs',...a,'--project',project],label);console.log({label,exit_code:x.exit_code,files:x.files});if(x.exit_code!==0)throw Error(x.stdout+x.stderr);}
fs.writeFileSync(stage+'/template-98-cast-before.json',JSON.stringify(r.json('template-98-cast'),null,2)+'\n',{flag:'wx'});console.log(r.json('template-98-cast').source_hashes);
