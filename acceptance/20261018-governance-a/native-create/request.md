# 最小首批 A：真实 Codex 独立作品创作验收

本请求是本次用户授权范围内的测试任务。你是独立 Codex 写作会话，不改产品实现，不运行额外代理，不联网或推送，不迁移/升级任何真实旧作。仅写 `acceptance/20261018-governance-a/works/纸灯札记`、本阶段 `native-create` 和本轮 commands 中自己命名的文件。禁止写入 D:/work/小说/dzkxqxx 或其他既有作品，禁止修改旧 acceptance 封存目录。

先读主项目 `.agents/skills/writer-project/SKILL.md`、writer-novel 技能和 docs/workflow.md 中创作治理段，用当前 `node bin/ai-writer.mjs` 初始化全新小说。以下是独立夹具作者的真实指令，复制原话到新作品的 `研究/作者指令.md` 再绑定证据，不编造消息ID：

> 在这部全新验收作品中，主角叫林小河，师叔叫陶娘。宗门方向已选青岚宗，只确认这个方向，不确认经名、住舍人数和作息数字；技艺路线已选炼器先行；首件法器仍未选，小盾仅推荐。请先建立简洁故事骨架和分卷契约。本轮仅授权试写第1至6章，每章400–700正文汉字；六章后暂停正文并复盘，转为讨论全书总纲，不写第7章。故事是学徒从修理纸灯中学会分清材料故障与操作失误，保留温和的人物关系，不加阴谋或突然晋阶。第6章结束后请正式保存“暂停正文，先讨论全书总纲”的任务，只允许讨论和规划。

## 过程

- 用正式命令创建 schema 3 小说；补充作品定位、文风和骨架（资料保持小而具体），long-enable 显式启用分卷，再建覆盖1–6章的卷契约。治理输入的证据 quote 必须来自上方原话，source_sha256 用实际文件字节；operation_id 每个实际变更唯一。
- workflow show 的 workflow 字段是可编辑输入原型（governance 字段是展示，不能直接原样复制为输入）。根据上方指令正式登记有限 trial 范围及 stop_conditions。只填真实规划采纳状态，不把文件存在当已采纳。
- 分别登记宗门方向 confirmed、炼器先行 confirmed 和首件法器 candidate 三条决策。只把明确选中的项目放 adopted_items；经名/人数/数字仍未决，小盾不能成为确认的首件法器。决策是作者计划，不要塞入正文事实账本。
- 每章依序 plan、context、record-template、实际写稿与自检，再填真实 summary/changes，用 record 登记。不手改 state，不刷新哈希绕过变化。每章必须有不同目标/选择/后果，400–700汉字，不用重复填充。第3、6章后滚动实读，报告登记 model-self-review 并绑定实际正文哈希，不宣称真人验收。
- 第6章完成后用新的 workflow set 正式转 structure，仅 discuss/plan，正文和修订范围均 null。此时不准备第7章细纲、不写第7章。
- 实际运行 status compact/full、context --purpose discussion、decision current、check、随附工具 doctor；确认 next_unit=7 而行动是总纲。只读 context --unit 7 和伪登记 unit7 必须实际拒绝 ACTION_OUT_OF_SCOPE；保存拒绝前后 state 哈希和正文清单，确认没有未授权写入。

## 命令证据

每条产品 CLI 用以下包装器运行，标签以 `native-one-` 开头且唯一：

`node acceptance/20261018-governance-a/capture.mjs native-one-唯一标签 node bin/ai-writer.mjs ...实际参数...`

包装器保存真实 argv、退出码、完整 stdout/stderr，并回显。预期拒绝的命令有非零退出码，照实保留，不能用伪输出替代。可用 Node 一次性脚本写计划/正文/登记输入，但产品写操作必须经上述包装器；不要通过导入 lib 函数绕开 CLI。不运行 npm test（由主会话负责）。

在 native-create 写完整过程报告及完成摘要，列实际字数/登记范围/当前阶段/未决项/失败及重试/路径。有报错先依据手册修正输入，保留原失败；若发现产品问题，只报告给主会话，不直接改代码。最后停止，等待另一个新会话只凭文件恢复。
