// Read-only material views. This is not an external preparation package.
import { isDeepStrictEqual } from 'node:util';
import { userError } from './help.mjs';

export function createMaterialView({ capture, context, recordTemplate, replayInput }) {
  return (root, unit, { mode = 'draft', budget = 40000 } = {}) => {
    if (!['draft', 'replay'].includes(mode)) throw userError('mode 须为 draft 或 replay', { code: 'MATERIAL_MODE_INVALID' });
    if (!Number.isSafeInteger(unit) || unit < 1 || !Number.isSafeInteger(budget) || budget < 1000)
      throw userError('unit 须为正整数，max-chars 须为不小于1000的整数', { code: 'MATERIAL_ARGUMENT_INVALID' });
    const before = capture(root);
    const packet = context(root, unit, budget, mode === 'replay' ? 'revision' : 'draft');
    const input = mode === 'replay' ? replayInput(root, unit) : recordTemplate(root, unit);
    const after = capture(root);
    if (!isDeepStrictEqual(before, after) || input.expected_revision !== packet.revision ||
        !isDeepStrictEqual(input.source_hashes, packet.source_hashes) ||
        !isDeepStrictEqual(input.source_bindings ?? null, packet.source_bindings ?? null))
      throw userError('材料读取期间基线或来源发生变化，重新读取；不输出组合材料', { code: 'MATERIAL_VIEW_CHANGED' });
    return { ok: true, format: 'ai-writer-material-view@1', scope: 'read-only-materials', mode, unit,
      basis: before.basis, context: packet, record_input: input,
      requires: ['实读材料并完成真实创作或修订', '填写真实摘要和复核依据', '使用原 record-preview 和 record 全部检查'],
      limitations: ['不是原子快照或已完成外部准备包', '不包含备份、升级演练或写入授权', '返回后材料可能过期，登记时仍须校验'] };
  };
}
