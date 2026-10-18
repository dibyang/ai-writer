import fs from 'node:fs';
import {base,project,readJson,json,state,cli,sha} from './helpers.mjs';
const x=readJson(`${project}/.writer/drafts/record-6-before-writing.json`),e=quote=>[{unit:6,quote}];
x.summary='第三天十点周梅签清单，林禾把箱钥匙实际交给她，两人把箱搬到改衣摊；纸样和余料随箱。林禾承认旧日丢伞曾误怪周梅，周梅说自己没全忘但给伞柄重缠，两人吃面。留镇、费用和纸样复制都未定。';
x.changes={characters:{林禾:'两家门口吃面后准备回便民处；箱、钥匙、纸样已交周梅，保留签字清单；承认旧伞误怪；未定回县日期或留镇',周梅:'改衣摊；持有箱钥匙和纸样，接受本次交接；承认未全忘旧伞争执，为伞重缠柄，提出明日若在可帮看十分钟摊'},timeline_append:['第三天十点至午间：周梅签单、接钥匙并锁箱，与林禾搬箱到改衣摊；林禾承认旧伞误怪，伞柄重缠后拿回，两人吃面。'],ledger:{
 O_BOX:{previous_holder:'林禾',custody:{holder:'周梅',location:'改衣摊腾出的矮架',condition:'箱底不挨地，盖合铜锁扣上；纸样、围裙带、蓝布在箱内'},reader_known:'正式完成交接，进入周梅改衣摊',character_known:{林禾:'实际帮搬，已交周梅',周梅:'签单并收箱，安排自己的空位'},evidence:e('木箱落在改衣摊腾出的矮架上，箱底没有挨地，也没挡住脚踏板的位置。')},
 O_KEY:{previous_holder:'林禾',custody:{holder:'周梅',location:'本人钥匙圈，挂围裙口袋内小钩',condition:'一把；已试锁，并拉钩确认不易掉'},reader_known:'由林禾真实递给周梅，周梅串入自己的钥匙圈',character_known:{林禾:'自己从布袋取出交给周梅，空布袋收回',周梅:'亲自接钥匙、试锁并串圈保管'},evidence:[...e('林禾从抽屉取出布袋，把钥匙倒在自己掌心，递给周梅。'),...e('周梅把钥匙串进自己的钥匙圈，挂到围裙口袋里的小钩上。')]},
 O_PATTERN:{previous_holder:'林禾',custody:{holder:'周梅',location:'改衣摊木箱内宽纸套与硬纸板上',condition:'同箱交接，未强行摊平；原用途仍不明'},reader_known:'纸样随箱交周梅，无名样原用途和复制计划未定',character_known:{林禾:'实际参与放稳纸套及移箱；复制需等能展开',周梅:'接收纸样，尚未确定给谁'},evidence:e('她们把纸套放稳，合上箱盖。')},
 O_RECEIPT:{type:'object',statement:'周梅签字的交接清单，含木箱纸样围裙带蓝布',status:'active',cast:['林禾','周梅'],custody:{holder:'林禾',location:'便民处柜台',condition:'有划痕、日期改笔；周梅已签字'},evidence:e('念完，她自己签了名字，日期写错一笔，划掉重写，没要新纸。')},
 T_CLAIM:{status:'resolved',reader_known:'周梅实际收箱、钥匙和箱内物，本次失物交接完成',character_known:{林禾:'交箱钥匙并帮搬',周梅:'签单并接收'},evidence:e('林禾等她试完，把空布袋叠好放回抽屉。')},
 T_PATTERN:{status:'intentional-open',reader_known:'复制计划明确暂不决定，原纸样给谁仍不知道',character_known:{林禾:'问过描一套，听周梅说等能摊开再想',周梅:'尚不知给谁，未作复制决定'},evidence:e('“等能摊开再想吧。给谁都还不知道。”')},
 R_LISTEN:{status:'partial',reader_known:'林禾承认误怪旧伞，周梅承认没全忘；仍能重缠伞柄与吃面，关系只有限修复',character_known:{林禾:'已明确承认丢伞怪错人，知道周梅当年找过半下午',周梅:'听见林禾承认，说明自己没全忘，提出有条件帮看摊'},evidence:e('“我也没全忘。”周梅把筐接过去，“那天我找了半下午。”')},
 T_FUTURE:{type:'thread',statement:'林禾何时回县、是否留镇，寄存与缠柄费用尚未决定',status:'intentional-open',cast:['林禾','周梅'],reader_known:'费用等林秀回来问，林禾回县日期尚未定',character_known:{林禾:'未定回县，不能替母亲定费用',周梅:'知道费用待林秀、明日是否帮忙取决林禾在不在'},evidence:e('林禾说还没定，要等母亲复查完。')}
}};
json(`${base}/inputs/record-6-complete.json`,x);
cli('native-one-42-preview-6',['record-preview','--project',project,'--input',`${base}/inputs/record-6-complete.json`]);
cli('native-one-43-record-6',['record','--project',project,'--input',`${base}/inputs/record-6-complete.json`]);
cli('native-one-44-check-6',['check','--project',project]);
const s=state(),wf=structuredClone(s.governance);
wf.stage='structure';wf.task='六章试写已完成；暂停正文，仅讨论结构、登记开放意见，不写7也不改5–6';
wf.authorization={allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['等待下一阶段新的模拟作者授权；不写第7章，不修控制样本']};
const quote='本轮只授权试写1–6，完成后暂停正文，只做结构审查，不写7。';
json(`${base}/inputs/pause-workflow.json`,{expected_revision:s.revision,operation_id:'native-one-pause-after-six',author_evidence:{quote,local_source:'研究/验证授权原话.md',source_sha256:sha(fs.readFileSync(`${project}/研究/验证授权原话.md`)),locator:'合成作者原话中有限试写与停止条件原句',recorded_by:'native Codex primary session'},workflow:wf});
cli('native-one-45-pause',['workflow','set','--project',project,'--input',`${base}/inputs/pause-workflow.json`]);
cli('native-one-46-status-paused',['status','--project',project]);
cli('native-one-47-context-7-denied',['context','--project',project,'--unit','7'],{expect:1});
cli('native-one-48-template-7-denied',['record-template','--project',project,'--unit','7','--draft','正文/0007-未获授权.md','--out','.writer/drafts/forbidden-template-7.json'],{expect:1});
json(`${base}/pre-review-integrity.json`,{state_sha256:sha(fs.readFileSync(`${project}/.writer/state.json`)),schema:state().schema_version,revision:state().revision,units_sha256:sha(JSON.stringify(state().units)),snapshot_sha256:sha(JSON.stringify(state().snapshot)),body:state().units.map(u=>({unit:u.unit,draft:u.draft,sha256:sha(fs.readFileSync(`${project}/${u.draft}`))}))});
cli('native-one-49-review-template-1-6',['review-template','--project',project,'--from','1','--to','6','--out','.writer/drafts/review-1-6-before-reading.json']);
