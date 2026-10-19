import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../..'),file=path.join(root,'docs/usability-sources.json');
const original=fs.readFileSync(file),manifest=JSON.parse(original),selected=JSON.parse(fs.readFileSync(path.join(base,'selected-source-metadata.json'))).files;
const coverage={
 'Openwrite/main':{'docs/REVIEW_DAG_FRAMEWORK.md':'1-83','docs/WORKSPACE_CONTEXT_CONTRACT.md':'1-120 of 126','docs/ISSUE_76_REPAIRS.md':'1-62'},
 'Openwrite/native-core':{'tools/chapter_work_brief.py':'1-200 of 787','tools/context_protection.py':'1-180 of 235','models/narrative_forecast.py':'1-108'},
 'novel-creator-skill/main':{'references/beat-pipeline-spec.md':'1-92','references/anti-resolution-cooldown-spec.md':'1-118','references/outline-anchor-quota-spec.md':'1-89','references/rag-consistency-design.md':'1-39','references/humanizer-guide.md':'1-120 of 149','scripts/outline_anchor_manager.py':'1-190 of 348'},
 'Long-Novel-GPT/main':{'core/writer.py':'1-180 of 534','core/draft_writer.py':'1-47','prompts/对齐剧情和正文/prompt.py':'1-68'}
};
for(const [key,ranges] of Object.entries(coverage)){
 const inv=JSON.parse(fs.readFileSync(path.join(base,'references',key,'inventory.json'))),rows=selected.filter(x=>x.repo===inv.repo&&x.branch===inv.branch),readme=JSON.parse(fs.readFileSync(path.join(base,'references',key,'selected-files.json'))).filter(x=>/readme/i.test(x.file));
 if(manifest.method_references.some(x=>x.commit===inv.commit))throw Error('already appended');
 manifest.method_references.push({repository:'https://github.com/'+inv.repo,branch:inv.branch,commit:inv.commit,checked_at:inv.at,
  license:{github_license:inv.license?.spdx_id??null,root_license_files:inv.tree.filter(x=>x.type==='blob'&&/^(LICENSE|COPYING)(\.[^/]*)?$/i.test(x.path)).map(x=>x.path),...(key.startsWith('novel-creator')?{readme_declaration:'README lines702-704 states MIT License; no complete license text found at root'}:{}),redistributed_upstream_files:false},
  files:[...readme.map(x=>({path:x.file,bytes:x.bytes,sha256:x.sha256})),...rows.map(x=>({path:x.file,bytes:x.bytes,sha256:x.sha256}))],
  read_scope:'Root README overview plus the exact partial ranges below. Other listed files were cached/indexed, not claimed as fully read.',read_coverage:ranges,not_executed:['all upstream code, installers, model calls, example manuscripts'],
  adapted_into:['lib/workspace.mjs','lib/help.mjs','.agents/skills/writer-novel/references/chapter-delivery.md','.agents/skills/writer-novel/SKILL.md','.agents/skills/writer-review/SKILL.md'],
  adopted:key.startsWith('Openwrite/main')?['复用既有版本绑定和覆盖范围，缺证不当完成']:key.startsWith('Openwrite/native')?['上下文超限的可解释诊断，保护必要约束','短程分支候选与已发生事实分离']:key.startsWith('novel-creator')?['长章按事件步骤展开后合章复读','长线保留与本章有限兑现并存，复用现有分卷/增量记忆']:['分层创作与纲文回对','局部修改后核对相邻承接'],
  not_adopted:['复制上游代码、提示词或例文','引入宿主/UI/向量库/付费模型依赖','固定章节配额、场数、强制悬念或机械去词','自动补齐纲文映射或自动判文学通过']});
}
fs.writeFileSync(path.join(base,'usability-sources-before.json'),original,{flag:'wx'});fs.writeFileSync(file,JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({ok:true,added:4,scope:'Independent implementation and methods, no upstream text copied into runtime.'}));
