import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {isDeepStrictEqual as same} from 'node:util';
import {userError} from './help.mjs';
import {identifyBuild,packageFiles,fileRef,WORK_GUIDES,writeBuildManifest} from './tool-build.mjs';

export function initialToolControl(){return {generation:0,installed:null,events:[],operations:{},enable_id:null};}
const UUID=/^[a-f0-9]{8}-[a-f0-9-]{27}$/,HEX=/^[a-f0-9]{64}$/;
const ACTIVE=['open','editing','prepared','interrupted','conflicted'];
export function createToolUpdates(api){
  const {project,safe,json,hash,withLock,gate,fresh,stateLimit,revisions,toolRoot}=api;
  const io=revisions.fileTransactions,seen=new Map(),fail=(code,message,extra={})=>{throw userError(message,{code,...extra});};
  const exists=(root,ref)=>fs.existsSync(safe(root,ref)),read=(root,ref)=>io.bytes(root,ref),digest=(root,ref)=>io.digest(root,ref);
  const keys=(x,allowed)=>{if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!allowed.includes(k)))fail('TOOL_INPUT_INVALID','工具输入不是对象或含未知字段');};
  const keyId=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,159}$/.test(x)&&!['__proto__','prototype','constructor'].includes(x);
  function control(state){if(state.schema_version<6)return null;const c=state.tool_control;if(!c||!Number.isSafeInteger(c.generation)||c.generation<0||!Array.isArray(c.events)||!c.operations||typeof c.operations!=='object'||Array.isArray(c.operations)||(c.enable_id!==null&&!UUID.test(c.enable_id??''))||(c.installed!==null&&(!HEX.test(c.installed?.runtime_id??'')||!HEX.test(c.installed?.source_content_id??'')||typeof c.installed?.version!=='string')))fail('TOOL_CONTROL_CORRUPT','工具代次状态损坏');return c;}
  function observe(p){const c=control(p.state);if(!c)return;const old=seen.get(p.root);if(old&&(!same(old,{project_id:p.state.project_id,generation:c.generation})))fail('TOOL_GENERATION_CHANGED','本进程已读作品的工具代次变化；保留输入并重启新命令');seen.set(p.root,{project_id:p.state.project_id,generation:c.generation});for(const r of c.events){if(!/^\.writer\/objects\/[a-f0-9-]+\.json$/.test(r.ref??'')||digest(p.root,r.ref)!==r.sha256)fail('TOOL_CONTROL_CORRUPT','工具更新事件损坏');}}
  function accept(root){const s=json(safe(root,'.writer/state.json'),stateLimit);if(s.schema_version>=6)seen.set(fs.realpathSync(root),{project_id:s.project_id,generation:control(s).generation});}
  function guard(root,coordination=false){revisions.guardLoaded();if(!coordination||io.transactions(root).some(t=>t.kind==='tool-update'&&!['completed','rolled-back'].includes(t.status)))revisions.assertReady(root);if(path.basename(path.dirname(toolRoot))==='.writer'){const build=identifyBuild(toolRoot);if(!build.ok)fail('TOOL_BUILD_CHANGED','随附包与清单不符；保留现场，从外部入口检查');const own=json(path.resolve(toolRoot,'../state.json'),stateLimit),installed=control(own)?.installed;if(installed&&(installed.runtime_id!==build.runtime_id||installed.source_content_id!==build.observed_content_id))fail('TOOL_BUILD_CHANGED','随附完整内容与已安装代次不符；保留现场，从外部入口检查');}const ref='.writer/state.json';if(exists(root,ref)){const s=json(safe(root,ref),stateLimit);if(s.schema_version>=6){const r=fs.realpathSync(root),old=seen.get(r),current={project_id:s.project_id,generation:control(s).generation};if(old&&!same(old,current))fail('TOOL_GENERATION_CHANGED','工具代次已变更；当前进程不能继续写入');}}}
  // An embedded process knows its own work at module startup, before its first command.
  if(path.basename(path.dirname(toolRoot))==='.writer'){
    const own=path.resolve(toolRoot,'../..');if(fs.existsSync(path.join(own,'.writer/state.json'))){const s=json(path.join(own,'.writer/state.json'),stateLimit);if(s.schema_version>=6)seen.set(fs.realpathSync(own),{project_id:s.project_id,generation:control(s).generation});}
  }
  function proof(root,x){keys(x,['quote','local_source','source_sha256','locator','recorded_by']);for(const k of ['quote','local_source','locator','recorded_by'])if(typeof x[k]!=='string'||!x[k].trim())fail('AUTHOR_EVIDENCE_REQUIRED','工具变更需实际作者原话与本地出处');const b=read(root,x.local_source);if(!b||hash(b)!==x.source_sha256||!b.toString('utf8').includes(x.quote))fail('AUTHOR_EVIDENCE_MISMATCH','作者原话/来源SHA不符');return {bytes:b,evidence:{...x,frozen_ref:`.writer/objects/${hash(b)}.txt`}};}
  function freezeProof(root,a){const ref=a.evidence.frozen_ref;if(exists(root,ref)){if(digest(root,ref)!==hash(a.bytes))fail('TOOL_CONTROL_CORRUPT','已冻结作者依据发生变化，保留现场');}else io.storeBytes(root,ref,a.bytes,true);}
  function tree(root,ref){const rows={};function visit(r){const f=safe(root,r);if(!fs.existsSync(f))return;const s=fs.lstatSync(f);if(s.isSymbolicLink())fail('TOOL_UNSAFE_PATH','工具目录不接受链接');if(s.isDirectory())for(const n of fs.readdirSync(f).sort())visit(r+'/'+n);else{if(!s.isFile()||s.nlink!==1||s.size>stateLimit)fail('TOOL_UNSAFE_PATH','工具目录包含特殊文件、硬链接或过大文件');rows[r]=hash(fs.readFileSync(f));}}visit(ref);return rows;}
  const within=(base,file)=>{const r=path.relative(base,file);return r===''||(!path.isAbsolute(r)&&r!=='..'&&!r.startsWith('..'+path.sep));};
  function external(root){const target=safe(root,'.writer/tool');if(within(target,path.resolve(toolRoot)))fail('TOOL_EXTERNAL_ENTRY_REQUIRED','请从被替换工具之外的主项目/可信副本运行更新或恢复');}
  function cleanSessions(root){if(revisions.info(root))fail('TOOL_REVISION_ACTIVE','修订分支不能更新工具');const active=io.sessions(root).filter(s=>ACTIVE.includes(s.status));if(active.length)fail('TOOL_REVISION_ACTIVE','先结束活跃修订再更新工具',{sessions:active.map(s=>({id:s.id,status:s.status}))});}
  function options(input){keys(input,['source','documents','legacy_target_acknowledged']);if(typeof input.source!=='string'||!input.source.trim())fail('TOOL_SOURCE_REQUIRED','需显式本地来源source');const docs=input.documents??[];if(!Array.isArray(docs)||new Set(docs).size!==docs.length||docs.some(x=>!WORK_GUIDES.map(n=>'docs/'+n).includes(x)))fail('TOOL_INPUT_INVALID','documents仅可选择受管手册且不得重复');if(input.legacy_target_acknowledged!==undefined&&typeof input.legacy_target_acknowledged!=='boolean')fail('TOOL_INPUT_INVALID','legacy_target_acknowledged须布尔');return {source:input.source,documents:[...docs].sort(),legacy_target_acknowledged:input.legacy_target_acknowledged??false};}
  function plan(root,input){
    const opts=options(input),p=project(root);const source=packageFiles(opts.source),target=identifyBuild(p.root);
    if(within(safe(p.root,'.writer/tool'),source.tool_root))fail('TOOL_SOURCE_NESTED','来源不能在被替换工具内');
    for(const r of source.files)if(within(safe(p.root,'.writer/tool'),path.join(source.tool_root,fileRef(r))))fail('TOOL_SOURCE_NESTED','来源文件位于被替换目标内');
    const oldFiles=tree(p.root,'.writer/tool'),manifestRef='.writer/tool/build-manifest.json',declared=exists(p.root,manifestRef)?json(safe(p.root,manifestRef)):null;
    const owned=target.content_scope==='tool-root',allowed=new Set(target.files.filter(r=>owned||r.group==='runtime').map(r=>'.writer/tool/'+fileRef(r)));allowed.add(manifestRef);
    const blockers=[];try{cleanSessions(p.root);gate(p,'plan');fresh(p);}catch(e){blockers.push({code:e.code??'TOOL_PROJECT_NOT_READY',reason:e.message});}for(const f of Object.keys(oldFiles))if(!allowed.has(f))blockers.push({code:'TOOL_LOCAL_CUSTOMIZATION',file:f,reason:'工具目录有未知文件，默认保留并阻断替换'});
    const installed=control(p.state)?.installed;if(installed&&(installed.runtime_id!==target.runtime_id||installed.source_content_id!==target.observed_content_id))blockers.push({code:'TOOL_INSTALLED_BUILD_MISMATCH',reason:'当前包与已安装完整内容身份不符；先核原版，不能通过重建清单追认资源变化'});
    const runtimeMismatch=target.mismatches.filter(x=>owned||x.startsWith('runtime/')||x.startsWith('manifest/'));
    if(declared&&runtimeMismatch.length)blockers.push({code:'TOOL_LOCAL_CUSTOMIZATION',files:runtimeMismatch,reason:'运行模块或清单与可信基线不同'});
    if(target.missing.some(x=>owned||x.group==='runtime'))blockers.push({code:'TOOL_TARGET_INCOMPLETE',reason:'目标受管文件缺失，需先核旧基线'});
    const nextFiles=new Set(source.files.map(r=>'.writer/tool/'+fileRef(r)));for(const f of Object.keys(oldFiles))if(f!==manifestRef&&!nextFiles.has(f)&&allowed.has(f))blockers.push({code:'TOOL_PACKAGE_REMOVAL_UNSUPPORTED',file:f,reason:'新包省略旧受管文件；本批不静默删除或遗留混包'});
    if(!declared&&!opts.legacy_target_acknowledged)blockers.push({code:'TOOL_LEGACY_ACK_REQUIRED',reason:'旧无清单副本不能证明未定制；须明确接受此观察基线并完整备份'});
    const baseline=new Map((declared?.workspace_baselines??declared?.files.filter(r=>r.group==='content')??[]).map(r=>[r.file,r.sha256]));
    const local=[],docChanges=[];
    for(const ref of [...WORK_GUIDES.map(n=>'docs/'+n),'AGENTS.md']){const actual=digest(p.root,ref),next=source.files.find(r=>r.group==='content'&&r.file===ref)?.sha256??null,selected=opts.documents.includes(ref);local.push({file:ref,current_sha256:actual,source_sha256:next,selected,action:selected?'requested':'preserve'});if(!selected||actual===next)continue;
      if(actual!==null&&actual!==baseline.get(ref))blockers.push({code:'TOOL_DOCUMENT_CUSTOMIZED',file:ref,reason:'文档无可信旧基线或已有定制，保留原文'});
      if(p.state.units.some(u=>Object.hasOwn(u.source_hashes??{},ref)))blockers.push({code:'TOOL_DOCUMENT_CONSUMED',file:ref,reason:'已被章节消费的来源须走版本/修订流程'});
      docChanges.push({file:ref,before:actual,after:next});
    }
    for(const [ref,sha256] of Object.entries(tree(p.root,'.agents/skills')))local.push({file:ref,current_sha256:sha256,source_sha256:source.files.find(r=>fileRef(r)===ref)?.sha256??null,selected:false,action:'preserve'});
    if(p.state.schema_version!==6)blockers.push({code:'TOOL_PROTOCOL_REQUIRED',schema:p.state.schema_version,reason:'先从新主入口显式启用schema6，更新不暗做迁移'});
    const body={project_id:p.state.project_id,revision:p.state.revision,schema_version:p.state.schema_version,generation:control(p.state)?.generation??null,source:{root:source.tool_root,version:source.tool_version,content_id:source.observed_content_id,files:source.files},target:{content_id:target.observed_content_id,version:target.tool_version,files:oldFiles,manifest_sha256:digest(p.root,manifestRef)},documents:opts.documents,legacy_target_acknowledged:opts.legacy_target_acknowledged,local_content:local,document_changes:docChanges,blockers};
    const plan_sha256=hash(JSON.stringify(body));return {ok:true,read_only:true,can_update:!blockers.length,...body,plan_sha256,package_bytes:source.files.reduce((n,r)=>n+r.bytes,0),request:{expected_revision:p.state.revision,operation_id:crypto.randomUUID(),source:source.tool_root,expected_source_build_id:source.observed_content_id,expected_target_build_id:target.observed_content_id,plan_sha256,documents:opts.documents,legacy_target_acknowledged:opts.legacy_target_acknowledged,author_evidence:null},note:'根AGENTS/技能/手册默认保留；原版资源装入工具包，不改正文或事实。'};
  }
  function op(p,input){if(!keyId(input.operation_id)||!Number.isSafeInteger(input.expected_revision))fail('TOOL_INPUT_INVALID','需稳定operation_id与expected_revision');const fingerprint=hash(JSON.stringify(input)),operations=control(p.state)?.operations,old=operations&&Object.hasOwn(operations,input.operation_id)?operations[input.operation_id]:null;if(old){if(old.input_hash!==fingerprint)fail('TOOL_OPERATION_CONFLICT','同operation_id输入不同');return {old:old.result,fingerprint};}if(p.state.revision!==input.expected_revision)fail('REVISION_CHANGED','作品业务revision已变化');return {fingerprint};}
  function enable(root,input){
    keys(input,['expected_revision','operation_id','source','expected_source_build_id','expected_target_build_id','legacy_target_acknowledged','author_evidence']);return withLock(root,()=>{
      const p=project(root),operation=op(p,input);if(operation.old)return {...operation.old,unchanged:true};if(p.state.schema_version!==5)fail('TOOL_PROTOCOL_REQUIRED','tool enable仅从schema5显式启用6，先完成原迁移');cleanSessions(p.root);gate(p,'plan');fresh(p);external(p.root);
      const proposed=plan(p.root,{source:input.source,legacy_target_acknowledged:input.legacy_target_acknowledged});if(proposed.source.content_id!==input.expected_source_build_id||proposed.target.content_id!==input.expected_target_build_id)fail('TOOL_PLAN_CHANGED','来源或目标指纹变化');if(proposed.blockers.some(x=>x.code!=='TOOL_PROTOCOL_REQUIRED'))fail('TOOL_PLAN_BLOCKED','迁移前先处理更新包/目标阻断',{blockers:proposed.blockers});
      const author=proof(p.root,input.author_evidence),id=crypto.randomUUID(),before=read(p.root,'.writer/state.json'),dir=`.writer/tool-enables/${id}`,eventRef=`.writer/objects/${id}.json`;
      io.storeBytes(p.root,dir+'/before-state.bin',before,true);freezeProof(p.root,author);
      io.metadata(p.root,eventRef,{kind:'tool-enable',before_sha256:hash(before),before_ref:dir+'/before-state.bin',evidence:author.evidence},true);
      p.state.schema_version=6;p.state.revision++;p.state.tool_control=initialToolControl();p.state.tool_control.enable_id=id;p.state.tool_control.events.push({ref:eventRef,sha256:digest(p.root,eventRef)});
      const result={ok:true,schema_version:6,revision:p.state.revision,generation:0,enable_id:id,backup:dir+'/before-state.bin',tool_unchanged:true};p.state.tool_control.operations[input.operation_id]={input_hash:operation.fingerprint,result};
      const after=io.encoded(p.state);io.metadata(p.root,dir+'/enable.json',{id,project_id:p.state.project_id,before_sha256:hash(before),after_sha256:hash(after),event_ref:eventRef,event_sha256:digest(p.root,eventRef)},true);io.storeBytes(p.root,'.writer/state.json',after);accept(p.root);return result;
    });
  }
  function undoEnable(root,input){keys(input,['enable_id','author_evidence']);if(!UUID.test(input.enable_id??''))fail('TOOL_INPUT_INVALID','enable_id无效');return withLock(root,()=>{
    const p=project(root),id=input.enable_id,dir=`.writer/tool-enables/${id}`,record=json(safe(p.root,dir+'/enable.json')),before=read(p.root,dir+'/before-state.bin'),current=digest(p.root,'.writer/state.json');
    if(hash(before)!==record.before_sha256)fail('TOOL_CONTROL_CORRUPT','启用备份损坏');if(exists(p.root,dir+'/undone.json')&&current===record.before_sha256)return {ok:true,unchanged:true,schema_version:5};
    if(p.state.schema_version!==6||control(p.state).generation!==0||p.state.tool_control.enable_id!==id||current!==record.after_sha256)fail('TOOL_ROLLBACK_UNSAFE','启用后已有业务变化，不能回填旧state');cleanSessions(p.root);external(p.root);const a=proof(p.root,input.author_evidence);io.storeBytes(p.root,a.evidence.frozen_ref,a.bytes,!exists(p.root,a.evidence.frozen_ref));io.metadata(p.root,dir+'/undo-proof.json',{evidence:a.evidence},!exists(p.root,dir+'/undo-proof.json'));io.storeBytes(p.root,'.writer/state.json',before);io.metadata(p.root,dir+'/undone.json',{state_sha256:record.before_sha256});seen.delete(p.root);return {ok:true,schema_version:5,revision:JSON.parse(before).revision,tool_unchanged:true};
  });}
  function checks(work){
    const entry=safe(work,'.writer/tool/bin/ai-writer.mjs'),results=[];
    for(const args of [['--help'],['doctor','--project',work],['status','--project',work],['context','--project',work,'--purpose','discussion']]){
      const r=spawnSync(process.execPath,[entry,...args],{encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:8*1024*1024});const row={args,exit_code:r.status,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message??null};results.push(row);if(r.status!==0)fail('TOOL_VALIDATION_FAILED','独立包新入口验证失败',{checks:results});
    }return results;
  }
  const txRef=id=>`.writer/transactions/${id}/transaction.json`;
  function validateTx(root,tx){
    if(tx.schema_version!==2||tx.kind!=='tool-update'||!UUID.test(tx.id??'')||!Array.isArray(tx.plan)||hash(JSON.stringify(tx.plan))!==tx.plan_sha256||tx.plan.at(-1)?.file!=='.writer/state.json')fail('TOOL_TRANSACTION_CORRUPT','工具事务格式或计划损坏');
    if(hash(JSON.stringify(tx.protection))!==tx.protection_sha256)fail('TOOL_TRANSACTION_CORRUPT','作品保护清单损坏');
    const seen=new Set();for(const [i,r]of tx.plan.entries()){
      if(seen.has(r.file)||!(r.file.startsWith('.writer/tool/')||r.file==='.writer/state.json'||/^\.writer\/objects\/(?:[a-f0-9-]+\.json|[a-f0-9]{64}\.txt)$/.test(r.file)||WORK_GUIDES.map(n=>'docs/'+n).includes(r.file)))fail('TOOL_TRANSACTION_CORRUPT','工具事务路径越界或重复');seen.add(r.file);safe(root,r.file);
      for(const side of ['old','new']){const expected=side==='old'?r.before:r.after;if(expected===null){if(side==='new')fail('TOOL_TRANSACTION_CORRUPT','本批不删除工具文件');continue;}const ref=`.writer/transactions/${tx.id}/${side}/${i}.bin`;if(r[side+'_ref']!==ref||digest(root,ref)!==expected)fail('TOOL_TRANSACTION_CORRUPT','工具旧/新备份损坏');}
    }
  }
  function protect(root,tx){const current=tree(root,'.writer/tool'),old=tx.protection.tool_files,next=tx.protection.next_tool_files,conflicts=[];for(const file of new Set([...Object.keys(old),...Object.keys(next),...Object.keys(current)])){const actual=current[file]??null;if(actual!==(old[file]??null)&&actual!==(next[file]??null)){const external_ref=actual===null?null:`.writer/transactions/${tx.id}/external/${crypto.randomUUID()}.bin`;if(external_ref)io.storeBytes(root,external_ref,read(root,file),true);conflicts.push({file,before:old[file]??null,after:next[file]??null,external_sha256:actual,external_ref});}}if(conflicts.length){tx.status='conflicted';tx.conflicts=conflicts;io.saveTx(root,tx);fail('TRANSACTION_EXTERNAL_CONFLICT','工具目录存在第三方改动，旧/新/外部均保留',{conflicts});}const skipped=new Set(tx.plan.map(r=>r.file)),filtered=x=>Object.fromEntries(Object.entries(x).filter(([r])=>!skipped.has(r)));if(!same(filtered(io.inventory(root,tx.protection.extra)),filtered(tx.protection.files)))fail('TOOL_BUSINESS_CHANGED','更新期间作品内容变化；保留现场，先核实第三方变更');}
  function publish(root,tx,direction){validateTx(root,tx);protect(root,tx);return io.publishFiles(root,tx,direction,{validate:validateTx,beforeState:protect,stopAfter:'AI_WRITER_TEST_TOOL_STOP_AFTER',exitCode:95,finalize(root,tx,d){protect(root,tx);if(d==='complete'){
    const work=safe(root,`.writer/tool-updates/${tx.id}/validation`);const current=tree(work,'.writer/tool');if(hash(JSON.stringify(current))!==tx.validation_tool_sha256)fail('TOOL_VALIDATION_FAILED','验证副本工具被改，保留现场');
    if(hash(JSON.stringify(io.inventory(work,tx.protection.extra)))!==tx.validation_inventory_sha256)fail('TOOL_VALIDATION_FAILED','验证副本作品已变化，保留现场');
    const outcomes=checks(work);io.metadata(root,`.writer/tool-updates/${tx.id}/validation-results.json`,outcomes);for(const r of tx.plan)if(digest(root,r.file)!==r.after)fail('TOOL_VALIDATION_FAILED','新目标与准备字节不符');
    const r=spawnSync(process.execPath,[safe(root,'.writer/tool/bin/ai-writer.mjs'),'--help'],{encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:2*1024*1024});if(r.status!==0)fail('TOOL_VALIDATION_FAILED','实际目标新入口help失败');
  }if(process.env.AI_WRITER_TEST_FAULT==='1'&&process.env.AI_WRITER_TEST_TOOL_STOP_PHASE==='validated')process.exit(96);}});}
  function update(root,input){
    keys(input,['expected_revision','operation_id','source','expected_source_build_id','expected_target_build_id','plan_sha256','documents','legacy_target_acknowledged','author_evidence']);return withLock(root,()=>{
      const p=project(root);external(p.root);cleanSessions(p.root);if(p.state.schema_version!==6)fail('TOOL_PROTOCOL_REQUIRED','先显式启用schema6');const operation=op(p,input);if(operation.old)return {...operation.old,unchanged:true};gate(p,'plan');fresh(p);
      const proposed=plan(p.root,{source:input.source,documents:input.documents,legacy_target_acknowledged:input.legacy_target_acknowledged});if(proposed.blockers.length)fail('TOOL_PLAN_BLOCKED','更新计划有阻断，保留原工具及定制',{blockers:proposed.blockers});
      if(proposed.plan_sha256!==input.plan_sha256||proposed.source.content_id!==input.expected_source_build_id||proposed.target.content_id!==input.expected_target_build_id)fail('TOOL_PLAN_CHANGED','计划、来源或目标已变化；重读后重新plan，不刷新旧输入');
      const id=crypto.randomUUID(),dir=`.writer/tool-updates/${id}`,validation=safe(p.root,dir+'/validation'),author=proof(p.root,input.author_evidence),eventRef=`.writer/objects/${id}.json`,event={kind:'tool-update',id,from:proposed.target,source:{...proposed.source,files:undefined},documents:proposed.document_changes,evidence:author.evidence,plan_sha256:proposed.plan_sha256};
      fs.mkdirSync(validation,{recursive:true});for(const name of ['正文','设定','大纲','研究','审查','参考拆解'])fs.mkdirSync(path.join(validation,name),{recursive:true});const extra=io.extras(p).filter(r=>!r.startsWith('.writer/tool/')),beforeInventory=io.inventory(p.root,extra);for(const ref of Object.keys(beforeInventory))io.storeBytes(validation,ref,read(p.root,ref),true);
      const source=packageFiles(input.source);for(const r of source.files){const file=fileRef(r),b=fs.readFileSync(path.join(source.tool_root,file));if(hash(b)!==r.sha256)fail('TOOL_SOURCE_CHANGED','复制时来源变化');io.storeBytes(validation,'.writer/tool/'+file,b,true);}
      const target=structuredClone(p.state),c=control(target);c.generation++;target.revision++;c.installed={version:source.tool_version,source_content_id:source.observed_content_id,runtime_id:source.runtime_id};
      freezeProof(validation,author);io.metadata(validation,eventRef,event,true);c.events.push({ref:eventRef,sha256:digest(validation,eventRef)});
      const result={ok:true,status:'completed',transaction_id:id,revision:target.revision,generation:c.generation,source_content_id:source.observed_content_id,backups_preserved:true};c.operations[input.operation_id]={input_hash:operation.fingerprint,result};
      for(const d of proposed.document_changes)io.storeBytes(validation,d.file,fs.readFileSync(path.join(source.tool_root,d.file)));
      const oldManifest=exists(p.root,'.writer/tool/build-manifest.json')?json(safe(p.root,'.writer/tool/build-manifest.json')):null,baselineRows=oldManifest?.workspace_baselines??oldManifest?.files.filter(r=>r.group==='content')??[],trusted=new Map(baselineRows.filter(r=>digest(p.root,r.file)===r.sha256).map(r=>[r.file,r.sha256]));for(const d of proposed.document_changes)trusted.set(d.file,d.after);
      writeBuildManifest(safe(validation,'.writer/tool'),source.provenance,[...trusted].map(([file,sha256])=>({file,sha256})));io.storeBytes(validation,'.writer/state.json',io.encoded(target));
      const outcomes=checks(validation);io.metadata(p.root,dir+'/prepared-checks.json',outcomes,true);
      if(!same(io.inventory(p.root,extra),beforeInventory)||plan(p.root,{source:input.source,documents:input.documents,legacy_target_acknowledged:input.legacy_target_acknowledged}).plan_sha256!==input.plan_sha256)fail('TOOL_PLAN_CHANGED','验证期间主作品或包变化，候选保留');
      const files=[...Object.keys(tree(validation,'.writer/tool')),...proposed.document_changes.map(x=>x.file),author.evidence.frozen_ref,eventRef,'.writer/state.json'],changes=[];
      for(const file of [...new Set(files)]){const before=digest(p.root,file),after=digest(validation,file);if(before!==after)changes.push({file,before,after});}
      if(changes.at(-1)?.file!=='.writer/state.json')fail('TOOL_TRANSACTION_CORRUPT','工具状态必须最后发布');
      const protection={extra,files:beforeInventory,tool_files:proposed.target.files,next_tool_files:tree(validation,'.writer/tool')};const tx={schema_version:2,kind:'tool-update',id,status:'prepared',operation_id:input.operation_id,request_hash:operation.fingerprint,protection,protection_sha256:hash(JSON.stringify(protection)),validation_inventory_sha256:hash(JSON.stringify(io.inventory(validation,extra))),validation_tool_sha256:hash(JSON.stringify(tree(validation,'.writer/tool'))),plan:[]};
      for(const [i,r]of changes.entries()){const oldRef=`.writer/transactions/${id}/old/${i}.bin`,newRef=`.writer/transactions/${id}/new/${i}.bin`;if(digest(p.root,r.file)!==r.before)fail('TOOL_PLAN_CHANGED','备份前目标变化');if(r.before!==null)io.storeBytes(p.root,oldRef,read(p.root,r.file),true);io.storeBytes(p.root,newRef,read(validation,r.file),true);tx.plan.push({...r,old_ref:r.before===null?null:oldRef,new_ref:newRef});}
      tx.plan_sha256=hash(JSON.stringify(tx.plan));if(process.env.AI_WRITER_TEST_FAULT==='1'&&process.env.AI_WRITER_TEST_TOOL_STOP_PHASE==='backups')process.exit(98);io.saveTx(p.root,tx);if(process.env.AI_WRITER_TEST_FAULT==='1'&&process.env.AI_WRITER_TEST_TOOL_STOP_PHASE==='prepared')process.exit(97);
      const completed=publish(p.root,tx,'complete');accept(p.root);return {...result,...completed};
    });
  }
  function recover(root,input){
    keys(input,['transaction_id','direction','lock_sha256','author_evidence']);if(!UUID.test(input.transaction_id??'')||!['complete','rollback'].includes(input.direction))fail('TOOL_INPUT_INVALID','恢复需有效事务ID与complete/rollback');external(root);
    const tx=json(safe(root,txRef(input.transaction_id)),stateLimit);validateTx(root,tx);if(['completed','rolled-back'].includes(tx.status)){if((tx.status==='completed')!==(input.direction==='complete'))fail('TOOL_TRANSACTION_TERMINAL','终态不能反向回填，撤销须新更新');return {ok:true,unchanged:true,transaction_id:tx.id,status:tx.status};}
    proof(root,input.author_evidence);io.releaseStaleLock(root,input);
    return withLock(root,()=>{const current=json(safe(root,txRef(tx.id)),stateLimit);validateTx(root,current);const a=proof(root,input.author_evidence);io.storeBytes(root,`.writer/tool-updates/${tx.id}/recovery-${crypto.randomUUID()}.txt`,a.bytes,true);const out=publish(root,current,input.direction);accept(root);return out;},{coordination:true,toolRecovery:true});
  }
  function list(root){const transactions=io.transactions(root).filter(t=>t.kind==='tool-update').map(t=>({id:t.id,status:t.status,operation_id:t.operation_id,conflicts:t.conflicts??[]})),known=new Set(transactions.map(t=>t.id)),dir=safe(root,'.writer/tool-updates'),staging=fs.existsSync(dir)?fs.readdirSync(dir).filter(id=>UUID.test(id)&&!known.has(id)).map(id=>({id,status:'pre-transaction-candidate',action:'未发布事务；核旧目标后明确处理遗留锁。候选和备份保留，不自动清理。'})):[];return {ok:true,transactions,staging,note:'仅列更新协调记录，不把pending作品当可用状态；恢复需外部入口和明确依据'};}
  return {observe,guard,accept,plan,enable,undoEnable,update,recover,list};
}
