import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),hash=f=>sha(fs.readFileSync(f));
const build=read(v+'/build-tracking-verification.json'),delivery=read(v+'/delivery-current.json'),raw=fs.readFileSync(w+'/.writer/state.json'),state=JSON.parse(raw),rootCheck=read(v+'/parent-a-repair-verification.json');
if(build.ok!==true||build.content_id!==delivery.content_id||delivery.content_id!=='ab14a65fc7677e8c76c03cbe8f7ec7c49203ad070ed0163e265cf5047500e626')throw Error('Root build gate failed');
if(state.revision!==28||sha(raw)!==rootCheck.state_sha256)throw Error('Root state differs');
for(const u of rootCheck.units)if(hash(w+'/'+u.draft)!==u.sha256)throw Error('Body drift '+u.unit);
const sources={};for(const u of state.units)for(const [r,h]of Object.entries(u.source_hashes))if(r!=='.writer/state.json'){if(hash(w+'/'+r)!==h)throw Error('Consumed source drift '+r);sources[r]=h;}
function files(base,rel){const full=path.join(base,rel);if(!fs.existsSync(full))return [];if(fs.statSync(full).isFile())return [rel];return fs.readdirSync(full,{withFileTypes:true}).flatMap(e=>{if(e.isSymbolicLink())throw Error('Unexpected link');return files(base,rel+'/'+e.name);});}
const preserved=Object.fromEntries(['AGENTS.md','.agents','docs','README.md'].flatMap(ref=>files(w,ref)).map(ref=>[ref,hash(w+'/'+ref)]));
fs.writeFileSync(v+'/ac-before-state.json',raw,{flag:'wx'});
fs.writeFileSync(v+'/ac-content-baseline.json',JSON.stringify({sources,root_preserved_files:preserved,bodies:rootCheck.units},null,2)+'\n',{flag:'wx'});
const shown=read(v+'/cli-logs/ac02-old-workflow/stdout.raw.txt'),workflow=structuredClone(shown.workflow);
const local_source='研究/V-A-工具升级与追踪闭环授权原文.md',prompt=fs.readFileSync(w+'/'+local_source);
const quote='本次用户继续推进、发现问题直接修复的工具试验授权，由根明确允许仅对V隔离作品执行正式tool update和意见应用/复核。';
if(!prompt.toString('utf8').includes(quote))throw Error('Actual quote missing');
const author_evidence={quote,local_source,source_sha256:sha(prompt),locator:'本轮实际提示第二段；根在V隔离试验内选择工具更新与tracking闭环，不认证作者身份、不冒充人类逐字选择字段',recorded_by:'同一实际V-A Codex会话'};
workflow.stage='structure';workflow.task='仅规划并正式升级V隔离作品随附工具、对既有追踪修订执行意见应用与实读复核闭环；不写7、不新开剧情修订';
workflow.authorization={allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['根修后构建核验ok=true后，外部P完整包正式tool update，根定制默认保留；六章正文/事实/消费内容不改','新工具默认apply仍须拒绝无正文变更；另存显式change_scope tracking输入绑定已有真实commit，不捏造第二次修改','完整实读4—6和修后summary/timeline，新review后verify；成功才称意见闭环','完成后paused仅discuss、两范围null，到6等根独立复核及B新的7—9提示；不写7','仅V写入，不改U/T/源码，不派代理、不Git提交推送上传；失败留原输入和双流实际码/前后state']};
fs.writeFileSync(v+'/ac-author-evidence.json',JSON.stringify(author_evidence,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(w+'/.writer/drafts/v-ac-workflow-start.json',JSON.stringify({expected_revision:state.revision,operation_id:'v-ac-update-and-tracking-start',author_evidence,workflow},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:state.revision,root_build_ok:build.ok,source:delivery.extracted,target_content_id:delivery.content_id,consumed_sources:Object.keys(sources).length,preserved_root_files:Object.keys(preserved).length,author_evidence}));
