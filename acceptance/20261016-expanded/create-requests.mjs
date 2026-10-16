import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const campaign = path.dirname(fileURLToPath(import.meta.url));
const phases = [
  ['session-b', 5, 8, '第5章沈禾才把内牌完整内容当面告诉周砚，第7章才告知唐穗；先看实际现行正文，不从本请求猜铜牌内容。跨入V2时让人物作出实际选择，不只延长手续。'],
  ['session-c', 9, 12, '跨卷推进线索核查、排除初始误判，主线第12章到期而缺少最终比对时保持partial和原due_unit，不能为卷末好看而提前结案。不要改日期藏掉到期项。'],
  ['session-d', 13, 16, '这是旧章修订之后的全新恢复会话。只能以当前正文/状态确认铜牌地点、钥匙标识等，不读历史版本，不从其他会话取得答案。V3要在实际场景中兑现旧灯号支线，让长期铺垫产生关系或行动后果；不冒充主线已经结束。'],
  ['session-e', 17, 20, '跨过V3/V4边界，回查首卷原物、早期口述与已经兑现的灯号，保持人物的不同信息来源。录音若仍缺设备/完整片段/交叉验证，due_unit=18仍保留且说明下一步，不能把已知片段当作整段答案；为最后四章留真实待完成的行动。'],
  ['session-f', 21, 24, '这是第二轮多处旧章修订后的全新恢复。仅从当前作品确认人物知情、标识、时间、保管链；不能复活已改旧版本。最后四章实际完成跨卷回收：完整听取、交叉核对和查访中的必要动作，交代消息去向、物件最终保管与人的选择。T_SIGNAL/T_TAPE只有正文兑现才resolved；刻意未知的私人原因不用硬编。不要把保存草稿写成现实发布。']
];
for (const [phase, from, to, specific] of phases) {
  const output = `acceptance/20261016-expanded/${phase}`;
  const text = `继续用户授权的真实Codex长篇实跑，独立恢复作品acceptance/20261016-expanded/works/潮汐信号。仓库cwd为D:/work/other/ai-writer。只写该作品和${output}/；所有辅助文件、CLI日志、结果、导出使用完整的这个相对路径，不写仓库根同名目录。不得读其他阶段请求/聊天/结果、测试README或历史旧状态来补剧情；作品当前正文、设定、卷纲、章纲、state、当前报告及recall是恢复来源。不使用子代理，不改产品，不手改state/journal，不提交/推送/发布。

按writer-project/long-form、writer-novel、writer-review及必要连续性规则，先status/check/outline，完整实读当前1–${from - 1}章而不是只看摘要；用recall检索主要稳定ID，回读早期证据，保存${output}/recovery.md：当前卷、人物知情分界、物件保管、未结到期项、现行标识/地点及尚未知事项。答案只能来自实际文件，不能把计划记成事实。

创作并登记第${from}–${to}章，每章1500–2000正文汉字（Unicode Script=Han，不含标题）。保留本书声音、人物利益与情绪后果；每章有具体场景、选择和新变化，不用重复前情、程序清单或章末说理凑字。${specific}

每章先plan/context/record-template，保存真实写前revision和来源；再写正文并完整实读自检，登记changes并check。context的omitted_ids不是可丢线索，相关旧项要显式recall并实读。每逢3的倍数章，完整读当前3章与前三章，保存短报告通过review登记；已有有效报告不能代替新版本实读。尤其检查谁实际在场见证、物件递接与空手、知情口述/亲见区别、每次移动耗时、角色语气和压力是否机械重复。

如发现已登记正文错误，保留修前版本，经正式rewind后逐章重登；不能直接补state。重登时对照回退前后所有ledger条目，除了有依据的剧情改动，不得丢失原有证据/人物所知/未结项。引用必须绑定当前正文哈希与实际行。仍未证实的事保持边界，不为清零而判定。

结束后完整连读1–${to}章并保存模型知情复核报告，核对当前整稿、账本与卷契约（可用全稿报告覆盖本阶段滚动窗口，但发生到期检查仍须及时实读）。输出${output}/result.md：实际读写范围、每章汉字数、修订号、知情/保管/回收边界、错误与修复、来源和状态哈希。真实CLI argv、退出码、原始stdout/stderr全部保留；非零结果不能改写。用当前作品内工具status/check/doctor，导出到${output}/export，恰好1–${to}章、核对无遗漏。预计25–40分钟，每60秒反馈已完成章节、是否正常、下一步及预计剩余时间。
`;
  const dir = path.join(campaign, phase); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'request.md'), text, { flag: 'wx' });
}
console.log(JSON.stringify({ phases: phases.map(p => p[0]) }));
