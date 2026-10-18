import fs from 'node:fs';
import crypto from 'node:crypto';
const file='D:/work/other/ai-writer/.agents/skills/writer-project/SKILL.md',before=fs.readFileSync(file),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
if(sha(before)!=='0fd05f9ffb840f717cf645fcd4a6d2c3f37c32df7dd3f1ef4ea32b99f721a257')throw Error('Skill baseline changed; do not overwrite');
let s=before.toString('utf8').replace('0.6 新作品默认 state schema 5','0.7 新作品默认 state schema 6').replace('历史 schema 1/2/3/4 保持原协议','历史 schema 1–5 保持原协议').replaceAll('schema 3/4/5','schema 3及以上').replaceAll('schema 2/3/4/5','schema 2及以上').replaceAll('schema 4/5','schema 4及以上').replace('schema5独立区','schema5及以上独立区');
s=s.replace('有事务中断先 revision list/recover。','有事务中断先分辨类型：修订用revision list/recover，工具更新用外部入口tool updates/recover。');
s=s.replace('本批没有安全更新命令，不能自动迁移真实旧作、替换工具或手改版本号降级。','工具更新另行从外部0.7入口显式tool enable至6并重新plan，旧0.6拒绝6；不能自动迁移真实旧作或手改版本号降级。');
s=s.replace('- `tool identify/compare` 只读区分版本与内容指纹，显示清单差异和主项目/轻量副本 profile，不自动更新。实际模块有变化就核对构建，不能只看两个 0.3.0。','- `tool identify/compare/update-plan` 只读核构建、完整本地来源、根定制及阻断；更新任务授权内由Codex准备当前revision、稳定operation_id、包/计划指纹和真实作者依据，从被替换包之外执行tool update。完整资源装入.writer/tool，根AGENTS/技能/手册默认保留，新help指向包内手册；不要覆盖作者定制。代次变化要重启，pending先明确恢复，第三方字节保留，不能只换CLI或按版本号覆盖。备份不自动清理，详细输入和启用撤销边界见docs/tool-updates.md。');
if(s===before.toString('utf8')||s.includes('本批没有安全更新命令'))throw Error('Replacement incomplete');fs.writeFileSync(file,s,'utf8');console.log(JSON.stringify({file,before_sha256:sha(before),after_sha256:sha(Buffer.from(s))}));
