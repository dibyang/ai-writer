import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const replacements = {
  '.agents/skills/writer-project/SKILL.md': [
    ['0.4 新作品默认 state schema 3', '0.5 新作品默认 state schema 4'],
    ['历史 schema 1/2 保持原协议', '历史 schema 1/2/3 保持原协议'],
    ['读 governance、next、stale_units/changed_sources、draft_inventory', '读 governance、next、stale_units/changed_sources、draft_inventory、impact_pending 与 revisions；有事务中断先 revision list/recover'],
    ['2. schema 3 用', '2. schema 3/4 用'],
    ['schema 2/3 填 changes', 'schema 2/3/4 填 changes'],
    ['- 旧稿仍用 `rewind --from N --expected-revision 当前号`：保存旧状态、保留正文，后续逐章重读重登。schema 3 的 revise_range 要覆盖回退导致的受影响登记范围；不足时说明影响，依据作者实际授权处理，不能自己补授权。', '- schema 4 的旧章修改先登记覆盖最早影响章至原末章的 revise_range，再 revision begin；在返回的独立 workspace 实读、rewind、修改和逐章重登，写命令带 --revision-token。完整尾段连读并 review 后，回主作品 prepare/commit。主稿保留到事务提交，候选临时 revision 不直接覆盖主 revision；schema 3 保留原回退兼容。不足的授权不能自行扩大。'],
    ['- 本批只有命令锁/CAS和范围保护，未实现独立修订区、跨会话提交事务或设定版本发布。避免两个会话改同一正文；发现他人修订停止覆盖并保留现场，不自动抢锁。来源哈希保护继续有效。', '- 设定先固定真实旧字节，source impact 后实读旧输入、候选及相关原文；只影响未来才按章 publish。历史变化先 stage 持久阻断，在独立区发布、重登、复核后一次提交。默认设定、细纲、卷纲和事实卡共用版本解析；不能追认不匹配旧哈希的字节，不能把未来标签当作无影响证明。复杂步骤读 docs/revision-and-sources.md。\n- 跨会话 revision list/resume 恢复 ID/令牌和原基线；并行候选须显式声明。主稿或工具变化时保留双方并另建新基线，不自动合并或刷新旧基线。事务未完成时先显式 recover，第三方字节三方保留；不按超时/PID 自动抢锁。令牌遗失仅明确授权 transfer，备份和候选不自动清理。'],
    ['- `governance preview` 只读；migrate 必须在授权作品中显式备份迁移。旧工具会拒绝 schema 3，本批没有安全更新工具的命令。原有作品不能自动迁移、替换随附工具或降级 state。需要时从新主项目入口操作。', '- 旧 1/2 需明确治理迁移至 3，再 protection preview/enable 至 4；备份并核事实等价。旧 0.4 会拒绝 4，必须用新主项目入口；本批没有安全更新命令，不能自动迁移真实旧作、替换工具或手改版本号降级。'],
    ['schema 3 自带差量登记，但分卷契约须另用 long-enable 显式启用；此时仍是 schema 3。', 'schema 3/4 自带差量登记，分卷契约另用 long-enable 显式启用，保持原 schema。'],
  ],
  '.agents/skills/writer-project/references/long-form.md': [
    ['对 schema 3 仅启用分卷契约，仍为 schema 3。schema 3 初始已有 changes 差量追踪', '对 schema 3/4 仅启用分卷契约，保持原版本。schema 3/4 初始已有 changes 差量追踪'],
    ['只需要改未来单元时，不改已消费的整份卷纲；确需改动先核实最早受影响单元并 rewind。', '卷纲的未来补充先固定真实旧版本，再按单元发布新版本；历史改动先实读影响、stage，再在独立修订区 rewind 和重登。schema 4 不在主稿直接回退，详见 docs/revision-and-sources.md。'],
    ['并按 rewind 重登。', '并在 schema 4 独立修订区 rewind 重登；尾段复核后 prepare/commit。'],
    ['再用 rewind 流程修订', '再按协议使用独立区（schema 4）或原 rewind（旧协议）修订'],
  ],
  '.agents/skills/writer-review/references/deslop.md': [
    ['2. 已登记章节先按 writer-project 核实最早受影响范围，使用当前修订号 rewind；正文保留，逐单元重新读取上下文。未登记正文不需要回退。', '2. 已登记章节先按 writer-project 核实影响范围；schema 4 先 revision begin，在独立区使用当前修订号和所有者令牌 rewind、实读改稿与重登，完整尾段复核后 prepare/commit，不直接编辑主稿。旧协议保留原 rewind；未登记正文不需要回退。'],
  ],
};
const sha = b => crypto.createHash('sha256').update(b).digest('hex'), records = [];
for (const [ref, edits] of Object.entries(replacements)) {
  const original = fs.readFileSync(ref), source = original.toString('utf8'); let next = source;
  for (const [before, after] of edits) { if (next.split(before).length !== 2) throw Error(`Expected one match: ${ref}: ${before}`); next = next.replace(before, after); }
  const staged = path.resolve('.tmp/governance-b-skills', ref); fs.mkdirSync(path.dirname(staged), { recursive: true }); fs.writeFileSync(staged, next, { flag: 'wx' }); records.push({ ref, staged, before_sha256: sha(original), after_sha256: sha(Buffer.from(next)) });
}
fs.writeFileSync('acceptance/20261018-governance-b/skill-edits.json', JSON.stringify(records, null, 2) + '\n', { flag: 'wx' }); console.log(JSON.stringify(records));
