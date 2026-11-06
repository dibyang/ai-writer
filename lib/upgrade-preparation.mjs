import { userError } from './help.mjs';

// Automatic copying remains disabled until its write confinement is verified.
export function unavailableUpgradePreparation() {
  throw userError('自动备份和升级演练尚未具备已验证的写入保护；保留现有资料，当前候选不能执行自动升级准备', {
    code: 'UPGRADE_PREPARATION_UNAVAILABLE',
    next_action: '只读材料查看不替代备份。完成备份保护验证后再运行真实旧制品升级试验。'
  });
}
