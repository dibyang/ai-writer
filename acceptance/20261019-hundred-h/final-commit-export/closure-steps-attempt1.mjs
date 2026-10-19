import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const H=path.resolve('acceptance/20261019-hundred-h'),D=path.join(H,'final-commit-export'),W=path.join(H,'work'),id='79205b65-a787-466f-a5d9-39906315aafc';
const read=f=>JSON.parse(fs.readFileSync(f)), sha=b=>crypto.createHash('sha256').update(b).digest('hex'),hash=f=>sha(fs.readFileSync(f)),out=(n,x)=>fs.writeFileSync(path.join(D,n),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const state=()=>read(path.join(W,'.writer/state.json')), before=read(path.join(D,'initial-state.bin')), fixed=read(path.join(D,'precommit-verification.json'));
const reasons={
 H72_REPEATED_KNOWLEDGE:'72现句“何说自己不跑去邱铺看夹得牢不牢。”；19/21首次听全滑页和两夹仍在，少一次同段重复自证，保留不验夹的选择、非亲见及无取看权。属于可选风格suggestion，不改作者取舍。',
 H79_SINGLE_BRICK_REFERENCE:'79现句“两块暗红砖仍并排，临车道那块的半月缺口仍朝围挡”；限定单块避免回数缺口和误构图，接36/71原观察。两砖/白罩未亮及各次通行时点保留，不宣判原句造成实体变更，仍suggestion。',
 H83_REPEATED_PHONE_EXCLUSION:'83现结尾“沈没有请她把新旧位置再背一遍。”；71–81何在家接电话、沈亲见收存后转述和没开盒仍在，少一次重复视觉排除，较快回到邱穿针。何不目击/不获取看权仍保留；可选风格suggestion。',
 H107_RETAINED_VOICE_COUNT_CANDIDATE:'107现句“留下的三段试声也都有不好听的地方。”；明确三段是留用素材，避免由站读中止/坐读留用回数尝试。保留录制尝试与留用区别、错误输出另留，不补删除或第四完整成品；数量澄清仍suggestion。',
 H109_RELATIVE_DAY_DRIFT:'107第六十六日自录、108把报价排到第六十七日晨、109第67日现三句“昨天那段车声盖住后半句的试声”“昨天没有做完的事”“昨天处理过的声音”相接。净收益为消除三处相对日期错指；保原66日/不造65日录音，保低置信“昨晚画的鞋”、240自用例价及顾非客户。完整72–112正式报告覆盖107/108/109全部证据单位。'
};
const [action,arg,arg2]=process.argv.slice(2);
if(action==='postcommit'){
 const s=state(),ret=read(path.join(H,'commands/final-commit-publish/stdout.raw.txt')),retry=read(path.join(H,'commands/final-commit-publish-retry/stdout.raw.txt')),meta=read(path.join(H,'commands/final-commit-publish-retry/result.json')),sess=read(path.join(W,'.writer/revisions',id,'session.json')),tx=read(path.join(W,'.writer/transactions',ret.transaction_id,'transaction.json'));
 const binding=s.committed_revisions.at(-1),commit=read(path.join(W,binding.ref));assert.equal(hash(path.join(W,binding.ref)),binding.sha256);assert.equal(commit.id,fixed.planned_commit_id);assert.notEqual(commit.id,ret.transaction_id);assert.equal(tx.status,'completed');assert.equal(sess.status,'committed');assert.equal(sess.transaction_id,ret.transaction_id);assert.equal(retry.unchanged,true);assert.equal(meta.before_state_sha256,meta.after_state_sha256);assert.equal(s.revision,441);
 for(const row of fixed.bodies)assert.equal(hash(path.join(W,row.draft)),row.after);assert.deepEqual(s.units.slice(0,71),before.units.slice(0,71));assert.deepEqual(s.snapshot.timeline.slice(0,before.snapshot.timeline.length),before.snapshot.timeline);
 const original=read(path.join(H,'baseline-state.bin'));for(const [key,v] of Object.entries(original.snapshot.ledger))for(const f of ['type','statement','author_truth'])assert.deepEqual(s.snapshot.ledger[key][f],v[f],key+'.'+f);
 assert.deepEqual(s.governance,before.governance);assert.deepEqual(s.decisions,before.decisions);
 const row=tx.plan.find(x=>x.file==='.writer/state.json'),published=read(path.join(W,row.new_ref));assert.ok(published.committed_revisions.some(b=>b.ref===binding.ref&&b.sha256===binding.sha256));
 fs.copyFileSync(path.join(W,'.writer/state.json'),path.join(D,'committed-state.bin'),fs.constants.COPYFILE_EXCL);
 out('commit-verification.json',{ok:true,at:new Date().toISOString(),commit,transaction_id:tx.id,transaction_status:tx.status,session_status:sess.status,state_sha256:hash(path.join(W,'.writer/state.json')),idempotent_retry:true,bodies:112,changed_bodies:fixed.bodies.filter(x=>x.before!==x.after),prefix_units_unchanged:71,original106_ledger_entries:Object.keys(original.snapshot.ledger).length,original_timeline_prefix:before.snapshot.timeline.length,publication_binding:binding,publication_in_actual_transaction_state:true});console.log('postcommit verified r441, 112 bodies, 71 prefix, original ledger and timeline; commit '+commit.id+' transaction '+tx.id);
}else if(action==='issue-input'){
 const issue=arg,mode=arg2;assert.ok(reasons[issue]);assert.ok(['apply','verify'].includes(mode));const commit=read(path.join(D,'commit-verification.json')).commit;
 const x={expected_revision:state().revision,operation_id:crypto.randomUUID(),id:issue,reason:reasons[issue]};
 if(mode==='apply')x.commit_id=commit.id;else Object.assign(x,{review_ref:'.writer/reviews/b6d4ab4f-1976-4fe0-b1d8-81a478b5e91a.json',reviewer:'actual-Codex-H-final-read-prepare-informed-model-current-72-112',conclusion:'resolved'});
 const name=issue.toLowerCase().replaceAll('_','-')+'-'+mode+'.input.json';out(name,x);console.log(JSON.stringify({file:path.join(D,name),expected_revision:x.expected_revision,id:issue,mode}));
}else throw Error('Unknown stage');
