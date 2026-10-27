import fs from 'node:fs';
import crypto from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {cleanKeys,applyDelta} from './journal.mjs';
import {userError} from './help.mjs';

export const FUNCTION_FIELDS=['goal','obstacle','choice','consequence','relationship_change'];
export function initialReviewWorkflow(){return {reports:{},issues:{},events:[],operations:{}};}
export function createReviewWorkflow(api){
  const {project,safe,json,text,hash,atomic,withLock,fresh,string,strings,integer,object,stateLimit,writeEvidence,gate,reviewData,reviewStatus,dependency,revisionInfo,publication,journal}=api;
  const fail=(code,message)=>{throw userError(message,{code});};
  const id=v=>typeof v==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(v)&&!['constructor','prototype','__proto__'].includes(v);
  function keys(v,allowed,name){cleanKeys(v);if(!object(v)||Object.keys(v).some(k=>!allowed.includes(k)))fail('REVIEW_INPUT_INVALID',`${name}含未知字段或不是对象`);}
  function enabled(p){if(p.state.schema_version<5)fail('REVIEW_WORKFLOW_REQUIRED','结构化复核和意见闭环需要schema 5；先review-workflow preview，再按授权显式enable。旧作品不自动迁移');}
  function issueScope(p,units){const info=revisionInfo(p.root),scope=info?.revise_range?{from:info.revise_range.from,through:info.revise_range.to}:info?.scope;if(scope&&units.some(unit=>unit<scope.from||unit>scope.through))fail('REVISION_SCOPE_INVALID','意见新增或处置超出独立修订会话范围；扩展实读不等于扩大处置范围');}
  function digest(root,ref){return hash(fs.readFileSync(safe(root,ref)));}
  function blob(p,bytes,suffix){const ref=`.writer/objects/${hash(bytes)}.${suffix}`,file=safe(p.root,ref);fs.mkdirSync(safe(p.root,'.writer/objects'),{recursive:true});if(fs.existsSync(file)){if(digest(p.root,ref)!==hash(bytes))fail('REVIEW_CORRUPT','冻结审查对象已损坏');}else fs.writeFileSync(file,bytes,{flag:'wx'});return ref;}
  function event(p,payload){const ref=`.writer/objects/${crypto.randomUUID()}.json`;atomic(safe(p.root,ref),{kind:'review-workflow',payload});const binding={ref,sha256:digest(p.root,ref)};p.state.review_workflow.events.push(binding);return binding;}
  function readEvent(p,binding){if(!/^\.writer\/objects\/[a-f0-9-]+\.json$/.test(binding?.ref??'')||digest(p.root,binding.ref)!==binding.sha256)fail('REVIEW_CORRUPT','意见事件缺失或哈希变化');const e=json(safe(p.root,binding.ref));if(e.kind!=='review-workflow')fail('REVIEW_CORRUPT','意见事件类型损坏');return e.payload;}
  function validateProof(p,proof){if(!proof)return;const ref=proof.frozen_ref;if(!/^\.writer\/objects\/[a-f0-9]{64}\.txt$/.test(ref??'')||digest(p.root,ref)!==proof.source_sha256||!text(safe(p.root,ref)).includes(proof.quote))fail('REVIEW_CORRUPT','意见处置作者原话损坏');}
  function validate(p){
    if(p.state.schema_version<5)return;
    const w=p.state.review_workflow;keys(w,['reports','issues','events','operations'],'review_workflow');
    for(const u of p.state.units)if(u.replay_review){const r=u.replay_review;if(r.draft_sha256!==u.sha256||!/^\.writer\/objects\/[a-f0-9]{64}\.replay-review$/.test(r.frozen_ref??'')||digest(p.root,r.frozen_ref)!==r.report_sha256)fail('REVIEW_CORRUPT','重登实读依据缺失或损坏');}
    if(!object(w.reports)||!object(w.issues)||!object(w.operations)||!Array.isArray(w.events))fail('REVIEW_CORRUPT','审查索引损坏');
    const bindings=new Set();
    for(const b of w.events){const e=readEvent(p,b);bindings.add(`${b.ref}:${b.sha256}`);validateProof(p,e.author_evidence);}
    for(const [ref,sha]of Object.entries(w.reports)){
      if(!/^\.writer\/reviews\/[a-f0-9-]+\.json$/.test(ref)||digest(p.root,ref)!==sha)fail('REVIEW_CORRUPT','结构化审查记录损坏');
      const r=json(safe(p.root,ref));
      if(!r.structured||!r.frozen_report||digest(p.root,r.frozen_report)!==r.report_sha256)fail('REVIEW_CORRUPT','原审查报告冻结对象损坏');
      for(const u of r.units)if(!/^\.writer\/objects\/[a-f0-9]{64}\.review-body$/.test(u.frozen_ref??'')||digest(p.root,u.frozen_ref)!==u.sha256)fail('REVIEW_CORRUPT','原审查正文冻结对象损坏');
    }
    for(const [key,issue]of Object.entries(w.issues)){
      if(!id(key)||issue.id!==key||!['open','adopted','retained','deferred','applied','verified','needs-recheck'].includes(issue.status)||!bindings.has(`${issue.binding?.ref}:${issue.binding?.sha256}`))fail('REVIEW_CORRUPT','意见状态或事件索引损坏');
      const payload=readEvent(p,issue.binding);const {binding,...current}=issue;if(!same(payload.issue,current))fail('REVIEW_CORRUPT','意见当前投影与不可变事件不符');
      if(issue.application?.local_revision_id){const a=issue.application,b=a.local_revision_binding;if(!/^\.writer\/objects\/[a-f0-9-]+\.json$/.test(b?.ref??'')||!fs.existsSync(safe(p.root,b.ref))||digest(p.root,b.ref)!==b.sha256)fail('REVIEW_CORRUPT','候选修订凭据缺失或损坏');const proof=json(safe(p.root,b.ref));if(proof.kind!=='candidate-local-revision'||proof.id!==a.local_revision_id||proof.session_id!==a.local_session_id||proof.publication!==false)fail('REVIEW_CORRUPT','候选意见应用的本地修订身份不符');for(const frozen of [proof.before_body,proof.after_body,proof.frozen_report])if(!/^\.writer\/objects\/[a-f0-9-]+\.revision-(before|after|report)$/.test(frozen?.ref??'')||!fs.existsSync(safe(p.root,frozen.ref))||digest(p.root,frozen.ref)!==frozen.sha256)fail('REVIEW_CORRUPT','候选实际修改或复核归档损坏');}
      if(w.reports[issue.origin.review_ref]!==issue.origin.review_sha256)fail('REVIEW_CORRUPT','意见原始报告绑定损坏');
    }
  }
  function basis(p,units){return [...new Set(units)].sort((a,b)=>a-b).map(n=>{const u=p.state.units[n-1];if(!u)fail('REVIEW_RANGE_INVALID','意见章节尚未登记');return {unit:n,draft:u.draft,sha256:u.sha256,dependency:dependency(u)};});}
  function current(p,units){return units.every(u=>{const now=p.state.units[u.unit-1];return now?.draft===u.draft&&now.sha256===u.sha256&&dependency(now)===u.dependency&&fs.existsSync(safe(p.root,u.draft))&&digest(p.root,u.draft)===u.sha256;});}
  function canonical(value){return Array.isArray(value)?value.map(canonical):object(value)?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;}
  function trackingBasis(p,state,units){
    const wanted=new Set(units),found=new Map();let snapshot=structuredClone(state.snapshot);
    for(let i=state.units.length-1;i>=0;i--){
      const u=state.units[i];
      if(wanted.has(u.unit))found.set(u.unit,{summary_sha256:hash(JSON.stringify(canonical(u.summary))),snapshot_sha256:hash(JSON.stringify(canonical(snapshot)))});
      if(found.size===wanted.size)break;
      if(u.journal)snapshot=applyDelta(snapshot,journal.read(p.root,u),true,false);
      else if(Object.hasOwn(u,'before'))snapshot=structuredClone(u.before);
      else fail('REVIEW_PUBLICATION_MISMATCH','修订归档缺少可核验的登记追踪基线');
    }
    if(found.size!==wanted.size)fail('REVIEW_PUBLICATION_MISMATCH','修订归档未覆盖意见对应的登记单元');
    return found;
  }
  function publicationStates(p,proof){
    const refs=proof.state_refs;
    if(!refs?.before||!refs.after)fail('REVIEW_PUBLICATION_MISMATCH','实际修订缺少前后登记状态归档');
    for(const b of Object.values(refs))if(digest(p.root,b.ref)!==b.sha256)fail('REVIEW_PUBLICATION_MISMATCH','实际修订前后登记状态归档哈希不符');
    return {before:json(safe(p.root,refs.before.ref),stateLimit),after:json(safe(p.root,refs.after.ref),stateLimit)};
  }
  function publicationReferences(p,proof,rows){
    const references=rows.filter(old=>old.unit<proof.scope.from||old.unit>proof.scope.through);
    if(!references.length)return {};
    const {before,after}=publicationStates(p,proof);
    for(const old of rows){
      const prior=before.units[old.unit-1],published=after.units[old.unit-1],now=p.state.units[old.unit-1];
      if(!prior||!published||!now||old.draft!==prior.draft||old.sha256!==prior.sha256||old.dependency!==dependency(prior))fail('REVIEW_PUBLICATION_MISMATCH','采用时登记与真实提交前基线不匹配，不能事后替换参考章');
      if(references.includes(old)){
        const change=proof.plan.find(x=>x.file===old.draft);
        if(!same(prior,published)||!same(now,published)||digest(p.root,old.draft)!==old.sha256||change&&(change.before!==old.sha256||change.after!==old.sha256))fail('REVIEW_CONTEXT_CHANGED','范围外参考章须在采用、提交前后及当前保持，参考变化不能藏成已修复');
      }else if(!same(now,published))fail('REVIEW_PUBLICATION_MISMATCH','当前目标章登记已不匹配该实际提交，不凭旧提交覆盖后续重登');
    }
    return {reference_units:references.map(old=>old.unit),reference_state_refs:structuredClone(proof.state_refs)};
  }
  function trackingChanges(p,proof,rows){
    const {before,after}=publicationStates(p,proof),refs=proof.state_refs,nums=rows.map(u=>u.unit);
    const oldTracking=trackingBasis(p,before,nums),newTracking=trackingBasis(p,after,nums),currentTracking=trackingBasis(p,p.state,nums);
    const changes=rows.map(old=>{
      const prior=before.units[old.unit-1],published=after.units[old.unit-1],now=p.state.units[old.unit-1];
      if(!prior||!published||!now||old.draft!==prior.draft||old.sha256!==prior.sha256||old.dependency!==dependency(prior)||now.draft!==published.draft||now.sha256!==published.sha256||dependency(now)!==dependency(published)||!same(currentTracking.get(old.unit),newTracking.get(old.unit)))fail('REVIEW_PUBLICATION_MISMATCH','采用时旧登记或当前追踪与实际修订前后基线不匹配');
      const a=oldTracking.get(old.unit),b=newTracking.get(old.unit);
      return {unit:old.unit,before:a,after:b,summary_changed:a.summary_sha256!==b.summary_sha256,snapshot_changed:a.snapshot_sha256!==b.snapshot_sha256};
    });
    if(!changes.some(c=>c.summary_changed||c.snapshot_changed))fail('REVIEW_CHANGE_REQUIRED','没有对应登记摘要或事实快照的实际变化；重建来源、报告或修订号不能当作已修复');
    return {change_scope:'tracking',tracking_state_refs:refs,tracking_changes:changes};
  }
  function anchors(p,list,from,to){
    if(!Array.isArray(list)||!list.length)fail('REVIEW_EVIDENCE_REQUIRED','需要实际正文引文');
    return list.map(e=>{keys(e,['unit','quote'],'evidence');integer(e.unit,'evidence.unit',from);if(e.unit>to)fail('REVIEW_RANGE_INVALID','证据超出实读范围');string(e.quote,'quote',2000);const u=p.state.units[e.unit-1],body=text(safe(p.root,u.draft)),at=body.indexOf(e.quote);if(at<0)fail('REVIEW_EVIDENCE_MISMATCH',`单元${e.unit}找不到引文`);return {unit:e.unit,draft:u.draft,sha256:u.sha256,line:body.slice(0,at).split(/\r?\n/).length,quote:e.quote};});
  }
  function functions(p,input){
    if(input.chapter_functions===undefined){if(input.comparison!==undefined)fail('REVIEW_INPUT_INVALID','comparison须与完整chapter_functions一起提交');return {};}
    if(!Array.isArray(input.chapter_functions)||input.chapter_functions.length!==input.to-input.from+1)fail('REVIEW_FUNCTIONS_INCOMPLETE','功能表须逐章覆盖整个实际连读范围');
    const rows=input.chapter_functions.map((row,i)=>{keys(row,['unit',...FUNCTION_FIELDS],'chapter_functions');if(row.unit!==input.from+i)fail('REVIEW_FUNCTIONS_INCOMPLETE','功能表单元须按实读顺序连续');const result={unit:row.unit};for(const field of FUNCTION_FIELDS){const v=row[field];keys(v,['status','text','reason','evidence'],field);if(!['observed','unknown','none'].includes(v.status))fail('REVIEW_INPUT_INVALID','功能字段status须为observed/unknown/none');if(v.status==='observed'){string(v.text,field);result[field]={status:v.status,text:v.text,evidence:anchors(p,v.evidence,row.unit,row.unit)};}else{string(v.reason,`${field}.reason`);if(v.text!==undefined||v.evidence?.length)fail('REVIEW_INPUT_INVALID','unknown/none须说明原因，不混入观察结论');result[field]={status:v.status,reason:v.reason};}}return result;});
    const c=input.comparison;keys(c,['similar_structures','distinct_gains','preserve','optional_adjustments','limits'],'comparison');string(c.limits,'comparison.limits');for(const k of ['distinct_gains','preserve','optional_adjustments'])strings(c[k],k);if(!Array.isArray(c.similar_structures))fail('REVIEW_INPUT_INVALID','similar_structures须为数组，允许无相似结构');
    const similar=c.similar_structures.map(s=>{keys(s,['units','judgment','differences','preserve','optional_adjustments','uncertainty','evidence'],'similar_structure');if(!Array.isArray(s.units)||new Set(s.units).size<2||new Set(s.units).size!==s.units.length||s.units.some(n=>!Number.isInteger(n)||n<input.from||n>input.to))fail('REVIEW_RANGE_INVALID','比较须列至少两个不同的实读章节');for(const k of ['judgment','differences','preserve','uncertainty'])string(s[k],k);strings(s.optional_adjustments,'optional_adjustments');const evidence=anchors(p,s.evidence,input.from,input.to);if(s.units.some(n=>!evidence.some(e=>e.unit===n))||evidence.some(e=>!s.units.includes(e.unit)))fail('REVIEW_EVIDENCE_REQUIRED','每个比较章节均须提供引文');return {...s,evidence};});
    return {chapter_functions:rows,comparison:{...c,similar_structures:similar},literary_judgment:'model-reported-not-script-acceptance'};
  }
  function operation(p,input){
    if(!id(input.operation_id))fail('REVIEW_INPUT_INVALID','operation_id须稳定且非保留ID');const digest=hash(JSON.stringify(input)),old=Object.hasOwn(p.state.review_workflow.operations,input.operation_id)?p.state.review_workflow.operations[input.operation_id]:undefined;if(old){if(old.input_sha256!==digest)fail('OPERATION_CONFLICT','同一operation_id不能对应不同输入');return {old:old.result,digest};}
    integer(input.expected_revision,'expected_revision',0);if(input.expected_revision!==p.state.revision)fail('REVISION_CHANGED','业务revision已变化，请重读当前状态');return {digest};
  }
  function save(p,input,op,result){p.state.revision++;const out={ok:true,revision:p.state.revision,...result};p.state.review_workflow.operations[input.operation_id]={input_sha256:op.digest,result:out};atomic(safe(p.root,'.writer/state.json'),p.state,stateLimit);return out;}
  function register(root,input){
    keys(input,['from','to','kind','report','source_hashes','expected_revision','operation_id','chapter_functions','comparison','issues','_instructions'],'review input');
    return withLock(root,()=>{const p=project(root);enabled(p);const op=operation(p,input);if(op.old)return {...op.old,unchanged:true};fresh(p);const record=reviewData(p,input),extra=functions(p,input);
      if(input.issues!==undefined&&(!Array.isArray(input.issues)||input.issues.length>100))fail('REVIEW_INPUT_INVALID','单次issues最多100条');
      const seen=new Set(),issues=(input.issues??[]).map(v=>{keys(v,['id','type','severity','confidence','statement','suggestion','evidence'],'issue');if(!id(v.id)||seen.has(v.id)||Object.hasOwn(p.state.review_workflow.issues,v.id))fail('REVIEW_ISSUE_CONFLICT','意见ID重复或无效');seen.add(v.id);if(!['correctness','continuity','readability','optional_style'].includes(v.type)||!['critical','major','minor','suggestion'].includes(v.severity)||!['high','medium','low'].includes(v.confidence))fail('REVIEW_INPUT_INVALID','意见类型、严重度或置信度无效');if(v.type==='optional_style'&&v.severity!=='suggestion')fail('REVIEW_OPTIONAL_NOT_REQUIRED','可选风格建议不能登记为硬性问题');string(v.statement,'statement');string(v.suggestion,'suggestion');return {...v,evidence:anchors(p,v.evidence,input.from,input.to)};});
      issueScope(p,issues.flatMap(issue=>issue.evidence.map(e=>e.unit)));
      const ref=`.writer/reviews/${crypto.randomUUID()}.json`;fs.mkdirSync(safe(root,'.writer/reviews'),{recursive:true});
      const frozen_report=blob(p,fs.readFileSync(safe(root,record.report)),'review-report');
      const units=record.units.map(u=>({...u,frozen_ref:blob(p,fs.readFileSync(safe(root,u.draft)),'review-body')}));
      atomic(safe(root,ref),{...record,structured:true,frozen_report,units,...extra,issues});const reportSha=digest(root,ref);p.state.review_workflow.reports[ref]=reportSha;
      for(const v of issues){const issue={...v,status:'open',origin:{review_ref:ref,review_sha256:reportSha,units:basis(p,v.evidence.map(e=>e.unit))},history:[]};const binding=event(p,{issue});p.state.review_workflow.issues[v.id]={...issue,binding};}
      return save(p,input,op,{ref,coverage:[input.from,input.to],issue_ids:issues.map(v=>v.id),quality:'review-recorded-not-acceptance'});
    },{continuationAction:'review'});
  }
  function template(root, from, to) {
    const p=project(root); enabled(p); fresh(p); integer(from,'from'); integer(to,'to',from);
    if(to>p.state.units.length) fail('REVIEW_RANGE_INVALID','实读范围超出已登记章节');
    const units=p.state.units.slice(from-1,to);
    return {from,to,kind:'model-self-review',expected_revision:p.state.revision,
      operation_id:`review-${from}-${to}-r${p.state.revision}`,report:'',
      source_hashes:Object.fromEntries(units.map(u=>[u.draft,u.sha256])),
      chapter_functions:units.map(u=>({unit:u.unit,...Object.fromEntries(FUNCTION_FIELDS.map(k=>[k,{status:'unknown',reason:''}]))})),
      comparison:{similar_structures:[],distinct_gains:[],preserve:[],optional_adjustments:[],limits:''},issues:[],
      _instructions:'这是待填草案，逐章实读后填写功能、原文引文及比较；unknown/none须说明原因。脚本不判断文学重复；可选建议不自动成为必改。提示字段可保留，不能据此当作已读。'};
  }
  function actor(p,input,issue){
    if(!['author','agent-within-authorized-scope'].includes(input.decision_actor))fail('REVIEW_ACTOR_REQUIRED','须区分作者逐项决定与代理在既有授权内处置');
    if(input.decision_actor==='author'){if(input.authorization!==undefined)fail('REVIEW_INPUT_INVALID','作者决定使用原话，不混入代理授权标签');return {decision_actor:input.decision_actor,author_evidence:writeEvidence(p,input.author_evidence)};}
    if(input.author_evidence!==undefined||!same(input.authorization,p.state.governance_binding??null)||!input.authorization)fail('REVIEW_AUTHORIZATION_MISMATCH','代理处置须绑定当前真实授权事件，不能伪称作者逐条决定');
    const nums=issue.evidence.map(e=>e.unit);gate(p,input.disposition==='adopted'?'revise':'discuss',...(input.disposition==='adopted'?[Math.min(...nums),Math.max(...nums)]:[]));return {decision_actor:input.decision_actor,authorization:structuredClone(input.authorization)};
  }
  function mutate(root,input,kind,allowed,build){keys(input,['expected_revision','operation_id','id',...allowed],kind);return withLock(root,()=>{const p=project(root);enabled(p);const op=operation(p,input);if(op.old)return {...op.old,unchanged:true};fresh(p);if(!id(input.id)||!Object.hasOwn(p.state.review_workflow.issues,input.id))fail('REVIEW_ISSUE_UNKNOWN','意见ID不存在');const previous=p.state.review_workflow.issues[input.id],{binding,...old}=previous;issueScope(p,old.evidence.map(e=>e.unit));const update=build(p,old),issue={...old,...update,history:[...old.history,binding]};const next=event(p,{issue,...(update.resolution?.author_evidence?{author_evidence:update.resolution.author_evidence}:{})});p.state.review_workflow.issues[input.id]={...issue,binding:next};return save(p,input,op,{id:input.id,status:issue.status,event:next});},{continuationAction:'issues'});}
  function resolve(root,input){
    return mutate(root,input,'resolve',['disposition','reason','decision_actor','author_evidence','authorization'],(p,issue)=>{
      if(!['adopted','retained','deferred'].includes(input.disposition))fail('REVIEW_TRANSITION_INVALID','处置须adopted/retained/deferred');
      string(input.reason,'reason');
      const previousChoice=issue.resolution?.author_choice??(issue.resolution?.decision_actor==='author'?{disposition:issue.resolution.disposition??(['retained','deferred'].includes(issue.status)?issue.status:'adopted'),evidence:issue.resolution.author_evidence}:null);
      if(input.decision_actor==='agent-within-authorized-scope'&&previousChoice&&input.disposition!==previousChoice.disposition)fail('REVIEW_AUTHOR_CHOICE_REQUIRED','作者明确采用/保留/延期不能被一般修订授权替换；沿用原选择或登记作者的新明确原话');
      const who=actor(p,input,issue),author_choice=who.decision_actor==='author'?{disposition:input.disposition,evidence:who.author_evidence}:previousChoice;
      return {status:input.disposition,resolution:{...who,disposition:input.disposition,reason:input.reason,author_choice,basis_units:basis(p,issue.evidence.map(e=>e.unit))},application:null,verification:null};
    });
  }
  function apply(root,input){return mutate(root,input,'apply',['commit_id','local_revision_id','reason','change_scope'],(p,issue)=>{
    const info=revisionInfo(p.root);
    if(info?.kind==='continuation-revision'){
      if(input.commit_id!==undefined||typeof input.local_revision_id!=='string'||input.change_scope!==undefined&&input.change_scope!=='draft')fail('REVIEW_LOCAL_PROOF_REQUIRED','限章候选须使用local_revision_id，不伪造commit或主稿发布');
      if(issue.status!=='adopted')fail('REVIEW_TRANSITION_INVALID','只有已采用意见才能登记applied');string(input.reason,'reason');const proof=api.localRevisionProof(p.root,input.local_revision_id),rows=issue.resolution.basis_units;
      if(!rows.length||rows.some(old=>old.unit!==proof.unit||old.draft!==proof.before_unit.draft||old.sha256!==proof.before_unit.sha256||old.dependency!==dependency(proof.before_unit)))fail('REVIEW_PUBLICATION_MISMATCH','意见采用时的旧稿不匹配该候选修订基线');
      return {status:'applied',application:{local_revision_id:proof.id,local_revision_binding:proof.binding,local_session_id:info.id,scope:'unpublished-candidate-only',publication:false,reason:input.reason,changes:[{unit:proof.unit,draft:proof.after_unit.draft,before:proof.before_unit.sha256,after:proof.after_unit.sha256}],after_units:basis(p,[proof.unit])},verification:null};
    }
    if(input.local_revision_id!==undefined)fail('REVIEW_LOCAL_PROOF_REQUIRED','候选凭据不能冒充普通主稿的实际提交');
    if(revisionInfo(p.root))fail('REVIEW_PUBLICATION_REQUIRED','应用绑定须在主作品实际事务提交后登记，不把分支当已发布');if(issue.status!=='adopted')fail('REVIEW_TRANSITION_INVALID','只有已采用意见才能登记applied');string(input.reason,'reason');
    const changeScope=input.change_scope===undefined?'draft':input.change_scope;if(!['draft','tracking'].includes(changeScope))fail('REVIEW_INPUT_INVALID','change_scope须为draft或tracking，省略时仍要求正文实际变化');
    const proof=publication(p.root,input.commit_id),rows=issue.resolution.basis_units,changes=[],references=publicationReferences(p,proof,rows);
    for(const old of rows){if(references.reference_units?.includes(old.unit))continue;const now=p.state.units[old.unit-1],change=proof.plan.find(x=>x.file===old.draft);if(!now||now.draft!==old.draft||old.unit<proof.scope.from||old.unit>proof.scope.through||(change?change.before!==old.sha256||change.after!==now.sha256:now.sha256!==old.sha256))fail('REVIEW_PUBLICATION_MISMATCH','实际修订提交与采用时旧稿/当前新稿不匹配');changes.push({unit:old.unit,draft:old.draft,before:old.sha256,after:now.sha256});}
    const tracking=changeScope==='tracking'?trackingChanges(p,proof,rows):{};
    if(changeScope==='draft'&&!changes.some(c=>c.before!==c.after))fail('REVIEW_CHANGE_REQUIRED','没有对应原文的实际修改，不能把采用或保留登记为已修复');
    const targets=references.reference_units?{target_units:changeScope==='tracking'?tracking.tracking_changes.filter(c=>c.summary_changed||c.snapshot_changed).map(c=>c.unit):changes.filter(c=>c.before!==c.after).map(c=>c.unit)}:{};
    return {status:'applied',application:{commit_id:proof.id,commit_binding:proof.binding,transaction_id:proof.transaction_id,reason:input.reason,changes,after_units:basis(p,rows.map(u=>u.unit)),...references,...targets,...tracking},verification:null};
  });}
  function verify(root,input){
    return mutate(root,input,'verify',['review_ref','reviewer','conclusion','reason'],(p,issue)=>{
      if(!['applied','verified','needs-recheck'].includes(issue.status)||!issue.application)fail('REVIEW_TRANSITION_INVALID','须先绑定实际修改，再核查新版本');
      const local=issue.application.local_revision_id;
      if(local){const proof=api.localRevisionProof(p.root,local);if(revisionInfo(p.root)?.id!==issue.application.local_session_id||!same(proof.binding,issue.application.local_revision_binding))fail('REVIEW_PUBLICATION_UNKNOWN','候选修订凭据不属于当前限章修订会话');}
      else if(!p.state.committed_revisions.some(binding=>same(binding,issue.application.commit_binding)))fail('REVIEW_PUBLICATION_UNKNOWN','原实际修改提交已不在当前作品历史中，不能凭意见状态虚构修复');
      if(!['resolved','not-resolved'].includes(input.conclusion))fail('REVIEW_INPUT_INVALID','复核结论须resolved/not-resolved');
      string(input.reviewer,'reviewer');string(input.reason,'reason');
      const records=reviewStatus(p,true).current_records,r=records.find(r=>r.ref===input.review_ref);
      if(!r||issue.application.after_units.some(u=>u.unit<r.from||u.unit>r.to))fail('REVIEW_CURRENT_READING_REQUIRED','需要覆盖意见章节的当前有效模型实读记录，不拼接旧短评');
      return {status:input.conclusion==='resolved'?'verified':'needs-recheck',verification:{review_ref:input.review_ref,review_sha256:digest(p.root,input.review_ref),reviewer:input.reviewer,conclusion:input.conclusion,reason:input.reason,rechecked_context:!current(p,issue.application.after_units)||Boolean(issue.verification&&(!current(p,issue.verification.units)||!records.some(old=>old.ref===issue.verification.review_ref&&digest(p.root,old.ref)===issue.verification.review_sha256))),...(local?{application_local_revision_id:local,scope:'unpublished-candidate-only',publication:false}:{application_commit_id:issue.application.commit_id}),revision_session:revisionInfo(p.root)?.id??null,units:basis(p,r.units.map(u=>u.unit))}};
    });
  }
  function acknowledge(root,input){return mutate(root,input,'acknowledge',['commit_id','target_units','reason','decision_actor','authorization'],(p,issue)=>{
    if(revisionInfo(p.root))fail('REVIEW_PUBLICATION_REQUIRED','已有修复补登记只在实际提交后的主作品执行');
    const agentDeferred=issue.status==='deferred'&&issue.resolution?.decision_actor==='agent-within-authorized-scope'&&issue.resolution.disposition==='deferred'&&!issue.resolution.author_choice;
    const priorAdoption=issue.history.some(binding=>{const previous=readEvent(p,binding).issue;return ['adopted','applied','verified','needs-recheck'].includes(previous.status)||Boolean(previous.application);});
    if(!(issue.status==='open'&&!issue.resolution||agentDeferred)||priorAdoption||!['correctness','continuity'].includes(issue.type)||issue.confidence!=='high')fail('REVIEW_ACKNOWLEDGEMENT_INVALID','仅补登记未采用或代理延期的高置信事实/连续性问题，不替换作者取舍、既有采纳或可选润色');
    if(input.decision_actor!=='agent-within-authorized-scope'||!input.authorization||!same(input.authorization,p.state.governance_binding??null))fail('REVIEW_AUTHORIZATION_MISMATCH','已有修复接受须绑定当前真实代理授权，不冒充作者事前采用');
    string(input.reason,'reason');const targets=input.target_units,rows=issue.origin.units;
    if(!Array.isArray(targets)||!targets.length||targets.some((n,i)=>!Number.isInteger(n)||n<1||i>0&&n<=targets[i-1]||!rows.some(u=>u.unit===n)))fail('REVIEW_TARGETS_INVALID','target_units须为来自原证据的非空递增章节，不重复、不扩展');
    gate(p,'revise',targets[0],targets.at(-1));
    const proof=publication(p.root,input.commit_id),refs=proof.state_refs;
    if(!refs?.before||!refs.after)fail('REVIEW_PUBLICATION_MISMATCH','实际修复缺少前后登记归档');
    for(const b of Object.values(refs))if(digest(p.root,b.ref)!==b.sha256)fail('REVIEW_PUBLICATION_MISMATCH','实际修复登记归档哈希不符');
    const before=json(safe(p.root,refs.before.ref),stateLimit),after=json(safe(p.root,refs.after.ref),stateLimit),changes=[];
    for(const old of rows){
      const prior=before.units[old.unit-1],published=after.units[old.unit-1],now=p.state.units[old.unit-1];
      if(!prior||!published||!now||prior.draft!==old.draft||prior.sha256!==old.sha256||dependency(prior)!==old.dependency||!same(now,published))fail('REVIEW_PUBLICATION_MISMATCH','原意见、修复前登记或当前修复后登记不匹配，不倒填新的基线');
      if(targets.includes(old.unit)){
        const change=proof.plan.find(x=>x.file===old.draft);
        if(old.unit<proof.scope.from||old.unit>proof.scope.through||!change||change.before!==old.sha256||change.after!==now.sha256||change.before===change.after)fail('REVIEW_CHANGE_REQUIRED','每个目标章都须有该真实提交中的正文实改');
        changes.push({unit:old.unit,draft:old.draft,before:old.sha256,after:now.sha256});
      }else if(!same(prior,published))fail('REVIEW_CONTEXT_CHANGED','非目标参考章须在修复前后及当前完全保持，不把参考范围藏成修改范围');
    }
    const acknowledged_at=new Date().toISOString();
    return {status:'applied',resolution:{decision_actor:input.decision_actor,authorization:structuredClone(input.authorization),disposition:'adopted',phase:'after-actual-repair',prior_adoption_recorded:false,acknowledged_at,reason:input.reason,author_choice:null,basis_units:structuredClone(rows.filter(u=>targets.includes(u.unit)))},application:{commit_id:proof.id,commit_binding:proof.binding,transaction_id:proof.transaction_id,reason:input.reason,changes,after_units:basis(p,rows.map(u=>u.unit)),acknowledged_existing_repair:true,acknowledged_at,target_units:[...targets],reference_units:rows.filter(u=>!targets.includes(u.unit)).map(u=>u.unit)},verification:null};
  });}
  function list(root, detail = true, onlyId) {
    const p = project(root);
    if (p.state.schema_version < 5) return {ok:true, enabled:false, note:'意见闭环未启用，不据旧报告虚构作者处置'};
    const selected = Object.values(p.state.review_workflow.issues).filter(i => onlyId === undefined || i.id === onlyId);
    const records = selected.some(i => i.status === 'verified') ? reviewStatus(p,true).current_records : [];
    const valid = new Set(records.map(r => r.ref));
    const issues = selected.map(issue => {
      const basisUnits = issue.verification?.units ?? issue.application?.after_units ?? issue.resolution?.basis_units ?? issue.origin.units;
      const changed = !current(p,basisUnits) || Object.values(p.state.impact_pending ?? {}).some(x => basisUnits.some(u => u.unit >= x.from && u.unit <= x.through));
      const verifiedStale = issue.status === 'verified' && (changed || !valid.has(issue.verification?.review_ref) || digest(p.root,issue.verification.review_ref) !== issue.verification.review_sha256);
      return {...issue, ...(onlyId ? {history_events:issue.history.map(binding => ({binding,...readEvent(p,binding)}))} : {}),
        effective_status:verifiedStale ? 'needs-recheck' : issue.status, context_changed:changed, nature:'disposition-not-author-finalization'};
    });
    const counts = {};
    for (const issue of issues) counts[issue.effective_status] = (counts[issue.effective_status] ?? 0) + 1;
    const pending = issues.filter(i => !['verified','retained'].includes(i.effective_status));
    return {ok:true, enabled:true, revision:p.state.revision, counts,
      ...(detail ? {issues} : {pending:pending.slice(0,8).map(i => ({id:i.id,type:i.type,status:i.effective_status,context_changed:i.context_changed})),omitted:Math.max(0,pending.length-8)}),
      note:'保留不等于修复；可选建议不自动变成必改。旧复核历史保留，版本变化会显示需重核。'};
  }
  function preview(root){const p=project(root);return {ok:true,revision:p.state.revision,schema_version:p.state.schema_version,target_schema:5,already_enabled:p.state.schema_version>=5,requires:'先完成schema4来源/修订保护；enable备份并保持事实/正文/消费记录，不自动升级随附工具'};}
  function enable(root,input){keys(input,['expected_revision','author_evidence'],'review-workflow enable');return withLock(root,()=>{const p=project(root);if(p.state.schema_version>=5)return {ok:true,unchanged:true,revision:p.state.revision};if(p.state.schema_version!==4)fail('PROTECTION_REQUIRED','先显式启用schema4保护');integer(input.expected_revision,'expected_revision',0);if(input.expected_revision!==p.state.revision)fail('REVISION_CHANGED','业务revision已变化');fresh(p);gate(p,'plan');const evidence=writeEvidence(p,input.author_evidence),backup=`.writer/pre-review-workflow-${p.state.revision}-${crypto.randomUUID()}.json`;fs.writeFileSync(safe(root,backup),fs.readFileSync(safe(root,'.writer/state.json')),{flag:'wx'});p.state.review_workflow=initialReviewWorkflow();event(p,{enable:true,author_evidence:evidence});p.state.schema_version=5;p.state.revision++;atomic(safe(root,'.writer/state.json'),p.state,stateLimit);return {ok:true,revision:p.state.revision,schema_version:5,backup,facts_unchanged:true};});}
  return {validate,register,template,resolve,apply,verify,acknowledge,list,preview,enable};
}
