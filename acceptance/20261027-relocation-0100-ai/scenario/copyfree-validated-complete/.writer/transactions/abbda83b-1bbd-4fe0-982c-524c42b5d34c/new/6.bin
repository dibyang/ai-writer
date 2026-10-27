import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual as same } from 'node:util';
import { cleanKeys } from './journal.mjs';
import { userError } from './help.mjs';
import { identifyBuild } from './tool-build.mjs';

const HEX=/^[a-f0-9]{64}$/, UUID=/^[a-f0-9]{8}-[a-f0-9-]{27}$/;
const fail=(code,message,extra={})=>{throw userError(message,{code,...extra});};
const key=s=>s.normalize('NFC').toLowerCase();
export function createRelocation(api){
  const {project,safe,json,hash,atomic,withLock,fresh,revisions,writeEvidence,gate,stateLimit,toolRoot}=api;
  const io=revisions.fileTransactions;
  const digest=(root,ref)=>io.digest(root,ref);
  function keys(v,names){cleanKeys(v);if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!names.includes(k)))fail('RELOCATION_INPUT_INVALID','输入不是对象或含未知字段');}
  function ordinary(root,ref,allowPair=false){
    const file=safe(root,ref);
    if(file.length>240||ref.split('/').some(s=>/[<>"|?*]/.test(s)||/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(s)))fail('RELOCATION_UNSAFE_PATH','路径不兼容 Windows 或过长',{ref});
    let cursor=fs.realpathSync(root);
    for(const part of ref.split('/')){if(fs.existsSync(cursor)){const matches=fs.readdirSync(cursor).filter(n=>key(n)===key(part));if(matches.some(n=>n!==part))fail('RELOCATION_PATH_ALIAS','路径存在大小写或 Unicode 别名',{ref});}cursor=path.join(cursor,part);if(fs.existsSync(cursor)){const s=fs.lstatSync(cursor);if(s.isSymbolicLink()||(!s.isDirectory()&&(!s.isFile()||s.nlink!==1&&!(allowPair&&s.nlink===2))))fail('RELOCATION_UNSAFE_PATH','路径含链接或特殊文件',{ref});}}
    return file;
  }
  function bodyPath(root,ref,allowPair=false){if(typeof ref!=='string'||!/^正文\/.+\.(md|txt)$/.test(ref))fail('RELOCATION_PATH_INVALID','仅可移动正文中的 md/txt');return ordinary(root,ref,allowPair);}
  function event(p,b){if(!/^\.writer\/objects\/[a-f0-9-]+\.json$/.test(b?.ref??'')||!HEX.test(b.sha256??'')||digest(p.root,b.ref)!==b.sha256)fail('RELOCATION_CORRUPT','迁移事件损坏');const e=json(safe(p.root,b.ref),stateLimit);if(e.kind!=='draft-relocation'||!Array.isArray(e.mapping)||!Array.isArray(e.directories))fail('RELOCATION_CORRUPT','迁移事件格式损坏');return e;}
  function resolve(p,ref){let current=ref;for(const b of p.state.draft_relocations?.events??[]){const e=event(p,b),m=e.mapping.find(x=>x.from===current);if(m)current=m.to;}if(current!==ref&&fs.existsSync(safe(p.root,ref)))fail('RELOCATION_ALIAS_SHADOW','历史正文地址重新出现文件，保留现场，不静默忽略');return current;}
  function equivalent(p,a,b){return resolve(p,a)===resolve(p,b);}
  function validate(p){
    if(p.state.schema_version<7){if(p.state.draft_relocations)fail('RELOCATION_CORRUPT','旧协议不能含迁移状态');return;}
    const r=p.state.draft_relocations;if(!r||!Array.isArray(r.events)||!r.events.length||!Array.isArray(r.directories))fail('RELOCATION_CORRUPT','schema7 缺少迁移事件');
    let last;const visited=new Set();for(const b of r.events){const e=event(p,b);if(visited.has(e.operation_id))fail('RELOCATION_CORRUPT','迁移操作重复');visited.add(e.operation_id);for(const m of e.mapping){bodyPath(p.root,m.from);bodyPath(p.root,m.to);if(!HEX.test(m.sha256)||m.from===m.to)fail('RELOCATION_CORRUPT','迁移路径或哈希损坏');}const a=e.evidence;if(!a||digest(p.root,a.frozen_ref)!==a.source_sha256||!fs.readFileSync(safe(p.root,a.frozen_ref),'utf8').includes(a.quote))fail('RELOCATION_CORRUPT','迁移作者证据损坏');last=e;}
    if(!same(r.directories,last.directories))fail('RELOCATION_CORRUPT','卷目录投影与最后事件不符');
    for(const u of p.state.units)if(resolve(p,u.draft)!==u.draft)fail('RELOCATION_CORRUPT','当前登记仍指向迁移前路径');
  }
  function directories(root,value){
    if(!Array.isArray(value)||!value.length)fail('RELOCATION_INPUT_INVALID','需显式卷目录契约');const ids=new Set(),dirs=new Set();
    return value.map(d=>{keys(d,['volume_id','directory','from','to']);if(!/^[A-Za-z0-9_-]{1,80}$/.test(d.volume_id??'')||ids.has(d.volume_id)||!Number.isSafeInteger(d.from)||d.from<1||!Number.isSafeInteger(d.to)||d.to<d.from||typeof d.directory!=='string'||!/^正文\/[^/]+$/.test(d.directory)||dirs.has(key(d.directory)))fail('RELOCATION_INPUT_INVALID','卷目录、范围或 ID 无效/重复');ordinary(root,d.directory);if(value.some(o=>o!==d&&o.from<=d.to&&d.from<=o.to))fail('RELOCATION_VOLUME_OVERLAP','目录契约范围重叠');ids.add(d.volume_id);dirs.add(key(d.directory));return {...d};});
  }
  function ready(p){if(p.state.schema_version<6)fail('RELOCATION_PROTOCOL_REQUIRED','迁移需要 schema6 及受控更新后的工具');if(revisions.info(p.root)||io.sessions(p.root).some(s=>['open','editing','prepared','interrupted','conflicted'].includes(s.status)))fail('RELOCATION_REVISION_ACTIVE','先结束活跃修订');gate(p,'plan');fresh(p);const build=identifyBuild(p.root);if(!build.ok||!build.supported_state_schemas.includes(7))fail('RELOCATION_TOOL_REQUIRED','先采用支持 schema7 的固定制品，不能直接用外部工具迁移旧随附包');return build;}
  function plan(root,input){
    keys(input,['mapping','directories']);const p=project(root),build=ready(p),dirs=directories(root,input.directories);
    if(!Array.isArray(input.mapping)||(!input.mapping.length&&!p.state.draft_relocations))fail('RELOCATION_INPUT_INVALID','需显式非空章节映射');const units=new Set(),targets=new Set(),sources=new Set();
    const mapping=input.mapping.map(m=>{keys(m,['unit','from','to','sha256']);const u=p.state.units[m.unit-1];if(!Number.isSafeInteger(m.unit)||units.has(m.unit)||!u||u.draft!==m.from||m.sha256!==u.sha256||m.from===m.to)fail('RELOCATION_MAPPING_INVALID','映射与唯一登记不符');bodyPath(root,m.from);bodyPath(root,m.to);if(digest(root,m.from)!==m.sha256)fail('RELOCATION_HASH_CHANGED','原正文已变化');if(fs.existsSync(safe(root,m.to))||targets.has(key(m.to)))fail('RELOCATION_TARGET_EXISTS','目标已存在或重复');if((p.state.draft_relocations?.events??[]).some(b=>event(p,b).mapping.some(old=>key(old.from)===key(m.to))))fail('RELOCATION_ALIAS_REUSE','不能重用历史正文地址');const d=dirs.find(d=>d.from<=m.unit&&m.unit<=d.to);if(!d||path.posix.dirname(m.to)!==d.directory)fail('RELOCATION_VOLUME_MISMATCH','目标与显式卷目录契约不符');units.add(m.unit);targets.add(key(m.to));sources.add(key(m.from));return {...m,bytes:fs.statSync(safe(root,m.from)).size};});
    if(mapping.some(m=>sources.has(key(m.to))))fail('RELOCATION_PATH_ALIAS','不支持交换路径或路径循环');
    for(const u of p.state.units){const d=dirs.find(d=>d.from<=u.unit&&u.unit<=d.to);if(!d)fail('RELOCATION_MAPPING_INCOMPLETE','目录契约须覆盖全部已登记章节');if(d&&!units.has(u.unit)&&path.posix.dirname(u.draft)!==d.directory)fail('RELOCATION_MAPPING_INCOMPLETE','契约覆盖的已登记章节必须全部位于约定目录或在映射中');}
    const executor=identifyBuild(toolRoot);if(!executor.ok)fail('RELOCATION_TOOL_REQUIRED','执行入口构建不完整');const basis={executor_build_id:executor.observed_content_id,project_id:p.state.project_id,revision:p.state.revision,state_sha256:digest(root,'.writer/state.json'),generation:p.state.tool_control.generation,build_id:build.observed_content_id,mapping,directories:dirs};
    return {ok:true,read_only:true,...basis,plan_sha256:hash(JSON.stringify(basis)),request:{expected_revision:p.state.revision,expected_generation:basis.generation,expected_build_id:basis.build_id,expected_executor_build_id:basis.executor_build_id,operation_id:crypto.randomUUID(),plan_sha256:hash(JSON.stringify(basis)),mapping:input.mapping,directories:dirs,author_evidence:null},note:'只改变路径；采用后 schema7，旧工具拒绝读取；正文通过 rename 移动，不复制备份。'};
  }
  const txref=id=>`.writer/transactions/${id}/transaction.json`;
  function list(root){return {ok:true,read_only:true,transactions:io.transactions(root).filter(t=>t.kind==='draft-relocation').map(t=>({id:t.id,status:t.status,operation_id:t.operation_id,conflicts:t.conflicts??[],lock_sha256:digest(root,'.writer/write.lock')}))};}
  function validateTx(root,t){if(!UUID.test(t.id??'')||t.kind!=='draft-relocation'||hash(JSON.stringify(t.protection))!==t.protection_sha256)fail('RELOCATION_CORRUPT','事务清单损坏');const b=t.protection;for(const side of ['before','after'])if(digest(root,b[side+'_ref'])!==b[side+'_sha256'])fail('RELOCATION_CORRUPT','状态备份损坏');for(const m of b.mapping){bodyPath(root,m.from,true);bodyPath(root,m.to,true);}return b;}
  function publish(root,t,direction){
    const b=validateTx(root,t),conflicts=[];
    function ownedPair(m){const a=safe(root,m.from),z=safe(root,m.to);if(!fs.existsSync(a)||!fs.existsSync(z))return false;const x=fs.lstatSync(a),y=fs.lstatSync(z);return x.isFile()&&y.isFile()&&x.nlink===2&&y.nlink===2&&x.dev===y.dev&&x.ino===y.ino&&digest(root,m.from)===m.sha256&&digest(root,m.to)===m.sha256;}
    for(const m of b.mapping){const pair=ownedPair(m);ordinary(root,m.from,pair);ordinary(root,m.to,pair);const a=digest(root,m.from),z=digest(root,m.to);if(!((a===m.sha256&&z===null)||(a===null&&z===m.sha256)||pair))conflicts.push({unit:m.unit,from_sha256:a,to_sha256:z});}
    const state=digest(root,'.writer/state.json');if(![b.before_sha256,b.after_sha256].includes(state))conflicts.push({file:'.writer/state.json',sha256:state});
    const ignore=new Set(['.writer/state.json',...b.mapping.flatMap(m=>[m.from,m.to])]),filter=x=>Object.fromEntries(Object.entries(x).filter(([r])=>!ignore.has(r)));
    if(!same(filter(io.inventory(root,b.extra)),filter(b.inventory)))conflicts.push({reason:'非迁移文件发生变化'});
    if(conflicts.length){t.status='conflicted';t.conflicts=conflicts;io.saveTx(root,t);fail('RELOCATION_EXTERNAL_CONFLICT','保留现场，不覆盖第三方文件',{conflicts});}
    t.status='applying';io.saveTx(root,t);let count=0;
    for(const m of b.mapping){
      const from=direction==='complete'?m.from:m.to,to=direction==='complete'?m.to:m.from;
      if(digest(root,from)!==null){
        const pair=ownedPair(m),a=ordinary(root,from,pair),z=ordinary(root,to,pair);fs.mkdirSync(path.dirname(z),{recursive:true});
        if(!pair){if(digest(root,from)!==m.sha256)fail('RELOCATION_EXTERNAL_CONFLICT','移动前正文变化');
          // link is an exclusive directory-entry claim: unlike rename, it cannot
          // replace a target that appeared after inspection. No body bytes copy.
          try{fs.linkSync(a,z);}catch(error){fail('RELOCATION_MOVE_BLOCKED','目标已出现或文件系统不支持安全同卷移动；保留事务，可回滚',{cause:error.code});}
          if(process.env.AI_WRITER_TEST_FAULT==='1'&&Number(process.env.AI_WRITER_TEST_RELOCATE_STOP_LINK)===count+1)process.exit(90);
        }
        if(!ownedPair(m))fail('RELOCATION_EXTERNAL_CONFLICT','移动期间文件身份或字节变化，保留双方路径');fs.unlinkSync(a);
      }
      ordinary(root,to);if(digest(root,to)!==m.sha256||fs.existsSync(safe(root,from)))fail('RELOCATION_HASH_CHANGED','移动后路径或哈希不符');count++;if(process.env.AI_WRITER_TEST_FAULT==='1'&&Number(process.env.AI_WRITER_TEST_RELOCATE_STOP_AFTER)===count)process.exit(94);
    }
    for(const m of b.mapping){const to=direction==='complete'?m.to:m.from,from=direction==='complete'?m.from:m.to;ordinary(root,to);if(digest(root,to)!==m.sha256||fs.existsSync(safe(root,from)))fail('RELOCATION_EXTERNAL_CONFLICT','发布状态前正文发生变化');}
    if(!same(filter(io.inventory(root,b.extra)),filter(b.inventory)))fail('RELOCATION_EXTERNAL_CONFLICT','发布状态前非迁移文件变化');
    const wanted=direction==='complete'?'after':'before';if(![b.before_sha256,b.after_sha256].includes(digest(root,'.writer/state.json')))fail('RELOCATION_EXTERNAL_CONFLICT','发布前状态变化');io.storeBytes(root,'.writer/state.json',io.bytes(root,b[wanted+'_ref']));
    if(process.env.AI_WRITER_TEST_FAULT==='1'&&process.env.AI_WRITER_TEST_RELOCATE_STOP_PHASE==='state')process.exit(93);
    t.status=direction==='complete'?'completed':'rolled-back';t.direction=direction;io.saveTx(root,t);return {ok:true,transaction_id:t.id,status:t.status,revision:json(safe(root,'.writer/state.json'),stateLimit).revision,moved:b.mapping.length,body_copies:0,move_method:'exclusive-link-unlink'};
  }
  function relocate(root,input){
    keys(input,['expected_revision','expected_generation','expected_build_id','expected_executor_build_id','operation_id','plan_sha256','mapping','directories','author_evidence']);return withLock(root,()=>{
      if(!/^[A-Za-z0-9_-]{1,100}$/.test(input.operation_id??''))fail('RELOCATION_INPUT_INVALID','operation_id 无效');const fingerprint=hash(JSON.stringify(input)),old=io.transactions(root).find(t=>t.kind==='draft-relocation'&&t.operation_id===input.operation_id);if(old){validateTx(root,old);if(old.request_hash!==fingerprint)fail('RELOCATION_OPERATION_CONFLICT','operation_id 输入不同');if(old.status==='completed')return {ok:true,unchanged:true,transaction_id:old.id,status:old.status};fail('RELOCATION_OPERATION_TERMINAL','回滚后重新预览并使用新 operation_id');}
      const proposed=plan(root,{mapping:input.mapping,directories:input.directories});if(input.expected_revision!==proposed.revision||input.expected_generation!==proposed.generation||input.expected_build_id!==proposed.build_id||input.expected_executor_build_id!==proposed.executor_build_id||input.plan_sha256!==proposed.plan_sha256)fail('RELOCATION_PLAN_CHANGED','预览、修订号、工具代次或构建已变化');
      if(/^正文\//.test(input.author_evidence?.local_source??''))fail('AUTHOR_EVIDENCE_MISMATCH','作者依据须独立记录，不能把正文当作授权备份');
      const p=project(root);if(digest(root,'.writer/state.json')!==proposed.state_sha256)fail('RELOCATION_PLAN_CHANGED','锁内核对期间状态变化');const evidence=writeEvidence(p,input.author_evidence),id=crypto.randomUUID(),eventRef=`.writer/objects/${id}.json`,e={kind:'draft-relocation',operation_id:input.operation_id,evidence,mapping:proposed.mapping,directories:proposed.directories,baseline:{revision:proposed.revision,generation:proposed.generation,build_id:proposed.build_id,executor_build_id:proposed.executor_build_id,state_sha256:proposed.state_sha256}};
      atomic(safe(root,eventRef),e,stateLimit);const after=structuredClone(p.state);after.schema_version=7;after.revision++;after.draft_relocations={events:[...(after.draft_relocations?.events??[]),{ref:eventRef,sha256:digest(root,eventRef)}],directories:proposed.directories};for(const m of proposed.mapping)after.units[m.unit-1].draft=m.to;
      const dir=`.writer/transactions/${id}`,before_ref=dir+'/before-state.json',after_ref=dir+'/after-state.json';io.storeBytes(root,before_ref,io.bytes(root,'.writer/state.json'),true);io.metadata(root,after_ref,after,true);
      const extra=io.extras(p),protection={mapping:proposed.mapping,extra,inventory:io.inventory(root,extra),before_ref,after_ref,before_sha256:digest(root,before_ref),after_sha256:digest(root,after_ref)},t={schema_version:1,kind:'draft-relocation',id,status:'prepared',operation_id:input.operation_id,request_hash:fingerprint,protection,protection_sha256:hash(JSON.stringify(protection))};io.saveTx(root,t);
      if(process.env.AI_WRITER_TEST_FAULT==='1'&&process.env.AI_WRITER_TEST_RELOCATE_STOP_PHASE==='prepared')process.exit(92);return publish(root,t,'complete');
    });
  }
  function recover(root,input){keys(input,['transaction_id','direction','lock_sha256','author_evidence']);if(!UUID.test(input.transaction_id??'')||!['complete','rollback'].includes(input.direction))fail('RELOCATION_INPUT_INVALID','恢复需要事务 ID 与明确方向');const t=json(safe(root,txref(input.transaction_id)),stateLimit);validateTx(root,t);if(['completed','rolled-back'].includes(t.status)){if((t.status==='completed')!==(input.direction==='complete'))fail('RELOCATION_OPERATION_TERMINAL','不能反向恢复终态');return {ok:true,unchanged:true,status:t.status};}
    // Evidence is checked before releasing only the explicitly identified stale lock.
    const a=input.author_evidence;keys(a,['quote','local_source','source_sha256','locator','recorded_by']);if(!a.quote||!a.locator||!a.recorded_by||digest(root,a.local_source)!==a.source_sha256||!fs.readFileSync(safe(root,a.local_source),'utf8').includes(a.quote))fail('AUTHOR_EVIDENCE_MISMATCH','恢复作者依据不符');
    io.releaseStaleLock(root,input);
    return withLock(root,()=>{const current=json(safe(root,txref(input.transaction_id)),stateLimit);io.metadata(root,`.writer/transactions/${t.id}/recovery-${crypto.randomUUID()}.json`,input,true);return publish(root,current,input.direction);},{coordination:true,toolRecovery:true});
  }
  return {plan,relocate,recover,list,resolve,equivalent,validate};
}
