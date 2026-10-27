import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import{fileURLToPath}from'node:url';
const a=path.dirname(fileURLToPath(import.meta.url)),p=path.join(a,'scenario','东岸末班船-66章独立验证'),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(f,'utf8')),save=(f,o)=>fs.writeFileSync(f,JSON.stringify(o,null,2)+'\n',{flag:'wx'});
const s=read(path.join(p,'.writer/state.json'));
if(process.argv[2]==='begin'){
  save(path.join(a,'fvr1-begin-input.json'),{expected_revision:s.revision,owner:'AE final revision same native 01a176d2-2255-7e80-9c37-d825387a4fef',from:3,through:66});
  console.log(JSON.stringify({begin_input_saved:true,revision:s.revision}));
}else{
  if(s.revision!==396||s.units.length!==66)throw Error('Unexpected baseline');
  const b=path.join(a,'fvr1-baseline');fs.mkdirSync(b);
  fs.copyFileSync(path.join(p,'.writer/state.json'),path.join(b,'state-r396.json'),fs.constants.COPYFILE_EXCL);
  const units=[];
  for(const u of s.units){const bytes=fs.readFileSync(path.join(p,u.draft));if(sha(bytes)!==u.sha256)throw Error('Draft mismatch '+u.unit);const dst=path.join(b,u.draft);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,bytes,{flag:'wx'});const journal=fs.readFileSync(path.join(p,u.journal));if(sha(journal)!==u.journal_sha256)throw Error('Journal mismatch');const j=path.join(b,u.journal);fs.mkdirSync(path.dirname(j),{recursive:true});fs.writeFileSync(j,journal,{flag:'wx'});units.push({unit:u.unit,draft:u.draft,sha256:u.sha256,journal:u.journal,journal_sha256:u.journal_sha256,source_hashes:u.source_hashes,source_bindings:u.source_bindings,decision_bindings:u.decision_bindings,authorization:u.authorization});}
  save(path.join(a,'fvr1-baseline.json'),{at:new Date().toISOString(),native_id:'01a176d2-2255-7e80-9c37-d825387a4fef',project:p,revision:s.revision,state_sha256:sha(fs.readFileSync(path.join(p,'.writer/state.json'))),baseline_dir:b,units,observation:s.snapshot.ledger.O_BOX_PAINT,issues:s.review_workflow,source_versions:s.source_versions,source_ranges:s.source_ranges});
  const source='研究/AE后续授权-卷目录与最终验收.md',evidence={quote:'那就让长篇正文按卷分目录。然后按你的建议继续，先恢复中断现场，完成当前修订和0.9.0最终构建的完整验收，发现问题直接修复，保留完整验证记录，暂不修改现有作品，不提交、不推送。',local_source:source,source_sha256:sha(fs.readFileSync(path.join(p,source))),locator:'第5行；真实持续用户授权，当前用户于2026-10-26T08:36:45.209Z明确激活正式3—66修订/本程停24，未提供消息ID，不伪造',recorded_by:'Codex same native 01a176d2-2255-7e80-9c37-d825387a4fef；具体修订组织由根裁定，不冒称作者逐字替换'};
  const w=structuredClone(s.governance);delete w.enabled;
  w.stage='revision';w.task='AE最终全书1—66已同ID实读462页；正式独立修订保护3—66，预期正文只改3提醒归属/48常班连续性/55老师代词/60私有首录上午入口。本原生首程先真实改3并依原输入重登至24后保存两区CP正常停；后续同ID恢复25—66、完整修后尾读及最终全66review/旧9verify/67范围负例/草稿导出/根总审计仍待完成。';
  w.authorization={allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:3,to:66},stop_conditions:['本程最多完整登记到24，不继续25，不prepare/commit；100—105分钟按真实整章边界保存。','只在正式独立workspace修正文3/48/55/60；当前先修3，未改章保持字节，原来源/意见/不可变观察保持。','登记至66并完成真实尾读前不登记最终全66review/旧9verify，不做67负例/export。','不改真实作品/Git/旧封存/工具源码或冻结v5，不提交推送，不起子代理/其他聊天，不换模型。']};
  save(path.join(a,'fvr1-workflow-input.json'),{expected_revision:s.revision,operation_id:'AE_FVR1_WORKFLOW_3_66_20261026',author_evidence:evidence,workflow:w});
  console.log(JSON.stringify({baseline_saved:true,units:units.length,workflow_input_saved:true,state_revision:s.revision}));
}
