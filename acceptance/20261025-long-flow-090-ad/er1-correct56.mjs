import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{base,j,sha,write,cli,state}from'./ef-lib.mjs';
const r=j(path.join(base,'e-revision-private.json')),root=r.workspace,token=r.token,prior=j(path.join(base,'er1-result-56.json'));assert.equal(state(root).revision,337);
write(path.join(base,'er1-correction56-before-state.json'),fs.readFileSync(path.join(root,'.writer/state.json'),'utf8'));
cli('er1-correction56-rewind',['rewind','--from','56','--expected-revision','337'],{root,token,show:false});
cli('er1c-context-56',['context','--purpose','revision','--unit','56','--max-chars','200000','--out','.writer/drafts/er1c-context-56.json'],{root,token,show:false});
cli('er1c-template-56',['record-template','--unit','56','--draft',prior.draft,'--out','.writer/drafts/er1c-template-56.json'],{root,token,show:false});
cli('er1c-replay-56',['revision','replay-input','--unit','56','--out','.writer/drafts/er1c-replay-56.json'],{root,token,show:false});
const delta=j(path.join(base,'er1-delta-56.json'));assert(delta.ledger.T_D_CABINET_PHOTOS.character_known['柜门客户'].includes('付70收2'));delta.ledger.T_D_CABINET_PHOTOS.character_known['柜门客户']=delta.ledger.T_D_CABINET_PHOTOS.character_known['柜门客户'].replace('付70收2','付70收8');
write(path.join(base,'er1c-delta-56.json'),delta);
write(path.join(base,'er1c-notes-56.md'),fs.readFileSync(path.join(base,'er1-notes-56.md'),'utf8')+'\n\n停止审计发现首次r337登记T_D_CABINET_PHOTOS.柜门客户仍“亲付70收2”，仅该追踪短语漏改，正文/费用总账/客户character/时间线均为70找8净62。首次preview/record机械通过不能证明语义正确。保留原输入、报告、原journal及r337完整状态，合法同ID候选内rewind from56 expected337后，重新context/template/replay-input，仅本项改收8，其他本章增量逐项复核无变。正文同SHA、先前本进程修后11页已经逐页完整返回，本次明确引用同路径同SHA的er1-final56-p1至p11，不重复冒报新阅读。核先前全部真实引文、summary、characters、timeline、ledger、evidence、downstream，重新建立当前报告/依赖并preview/record。此纠正不计为有效保护负例。\n');
let code=fs.readFileSync(path.join(base,'er1-record.mjs'),'utf8').replaceAll('er1-','er1c-').replaceAll('AD-E-r1-','AD-E-r1c-');code=code.replace('`er1-final${n}`','`er1-final${n}`');
// Page evidence retains its original real label; the correction never edits body bytes.
code=code.replace('`er1c-final${n}`','`er1-final${n}`').replace('`er1c-before${n}`','`er1-before${n}`');
write(path.join(base,'er1c-record.mjs'),code);
console.log(JSON.stringify({ok:true,revision:state(root).revision,units:state(root).units.length,body_sha256:sha(fs.readFileSync(path.join(root,prior.draft))),original_failed_record_preserved:true}));
