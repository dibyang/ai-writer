import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base='acceptance/20261015-usability-fix',out=`${base}/genres`;
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const copies=[['LICENSE.md','root-LICENSE.md'],['docs/sources.md','root-sources.md'],['docs/usability-sources.json','root-usability-sources.json'],['vendor/oh-story-deslop-reference/LICENSE','deslop-reference-LICENSE']];
fs.mkdirSync(`${out}/provenance`,{recursive:true});
const provenance=[];
for(const [source,name] of copies){const target=`${out}/provenance/${name}`;fs.copyFileSync(source,target,fs.constants.COPYFILE_EXCL);provenance.push({source,snapshot:target,source_sha256:hash(source),snapshot_sha256:hash(target)});}
const registry=JSON.parse(fs.readFileSync('docs/usability-sources.json','utf8'));
for(const file of registry.files){if(hash(file.file)!==file.sha256)throw new Error(`source registry mismatch: ${file.file}`);}
write(`${out}/provenance/manifest.json`,{purpose:'验证材料来源保全，不补改随作品生成的工具包；不构成发布许可',copies:provenance,upstream_commit:registry.commit,registry_files_verified:true});
const readFiles=['docs/user-guide.md','docs/deslop.md','.agents/skills/writer-project/SKILL.md','.agents/skills/writer-screenplay/SKILL.md','.agents/skills/writer-history/SKILL.md','.agents/skills/writer-history/references/history-method.md','.agents/skills/writer-review/SKILL.md','.agents/skills/writer-review/references/deslop.md',`${base}/fixtures/screenplay.md`,`${base}/fixtures/history.md`,`${base}/fixtures/history-facts.json`];
write(`${out}/read-coverage.json`,{reviewer:'同一会话模型知情实读',network_used:false,read_order:'user-guide, deslop, writer-project; genre/review rules; full fixtures and all 3 claims; context before each record; complete final drafts, actual diff and exported drafts; both local user guides',files:readFiles.map(p=>({path:p,sha256:hash(p),coverage:'full'})),history_claims:3,history_source_excerpts:'3/3 complete; same underlying source',final_versions:JSON.parse(fs.readFileSync(`${out}/content-preservation.json`,'utf8')).works});
const entries=fs.readFileSync(`${out}/cli-executions.jsonl`,'utf8').trim().split('\n').map(s=>JSON.parse(s));
const files=fs.readdirSync(`${out}/cli`).filter(s=>s.endsWith('.json'));
const evidenceFor=e=>files.find(f=>{const v=JSON.parse(fs.readFileSync(`${out}/cli/${f}`,'utf8'));return v.started_at===e.started_at&&JSON.stringify(v.argv)===JSON.stringify(e.argv);});
let index='# 实际 CLI 调用索引\n\n全部从 `D:/work/other/ai-writer` 启动真实 Node 进程。记录含 argv、cwd、时间、stdout、stderr、退出码；审修由本会话按技能实读完成。入口说明阶段另调用主 CLI 的 init/plan/record/export 帮助与 doctor，输出在会话工具记录中。以下为建档后完整落盘的 62 次调用。\n\n| 序号 | 命令 | CLI | 退出码 | 原始证据 |\n| --- | --- | --- | --- | --- |\n';
entries.forEach((e,i)=>{const kind=e.argv[0].includes('借一把椅子')?'随附剧本':e.argv[0].includes('字放回格子里')?'随附历史':'主项目';const command=e.argv[1]+(e.argv.includes('--help')?' --help':'');index+=`| ${i+1} | ${command} | ${kind} | ${e.exit_code} | [日志](cli/${evidenceFor(e)}) |\n`;});
index+='\n两次 init 帮助退出 2 是验收脚本误传不适用的 --project，原日志保留；最后两条改用正确 init --help，均退出 0。不得将两次拒绝计为有效帮助通过，也不将其称为产品功能故障。\n';
write(`${out}/cli-index.md`,index);
write(`${out}/validation-incidents.json`,{incidents:[{stage:'bundled help',type:'验收脚本参数错误',observed:'init --help --project 被拒绝，exit=2',resolution:'保留两份失败CLI日志，补跑两个正确 init --help；不改产品',evidence:['cli/bundled-screenplay-init-help.json','cli/bundled-history-init-help.json','cli/bundled-screenplay-init-help-corrected.json','cli/bundled-history-init-help-corrected.json']},{stage:'first final evidence verifier',type:'额外分发核对假设失败',observed:"ENOENT: no such file or directory, open 'D:\\work\\other\\ai-writer\\acceptance\\20261015-usability-fix\\works\\借一把椅子\\LICENSE.md'",exit_code:1,resolution:'只读核对初始化复制清单与两作品目录，确认缺失；改为报告实际缺失，不再断言随附存在，不补文件掩盖现象'},{stage:'second final evidence verifier',type:'全局零漂移断言失败',observed:'3 个范围外验收文件哈希变化；另有一个新增验收文件',exit_code:1,resolution:'保留前后哈希与新增路径；产品/输入不变作为单独硬检查，其他验收变更作为来源未确认的外部观测。不改、不回退外部文件。'}]});
console.log(JSON.stringify({provenance_snapshots:copies.length,read_files:readFiles.length,indexed_cli_calls:entries.length},null,2));
