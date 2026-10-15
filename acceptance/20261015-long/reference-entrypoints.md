# SOURCE: skills/browser-cdp/SKILL.md

---
name: browser-cdp
description: "Use this skill when you need to control a Chrome browser via CDP (Chrome DevTools Protocol) to reuse existing login sessions. Covers: launching Chrome in debug mode, opening URLs, waiting for page load, evaluating JavaScript, taking snapshots, and extracting auth tokens. Trigger phrases: browser automation, CDP, agent-browser, 浏览器操作, 操作浏览器, Chrome CDP, 复用登录态, extract token from browser."
metadata: {"openclaw":{"requires":{"bins":["agent-browser"]},"source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# Browser CDP 操作工具

通过 CDP（Chrome DevTools Protocol）连接 Chrome，复用登录态并执行浏览器操作。

## 前置条件

- macOS / Linux / Windows（实验性），已安装并使用过 Google Chrome，来源 profile 已存在
- Node.js 20+
- `agent-browser` 已安装：`npm install -g agent-browser`

> 启动或重建时，若需结束 Chrome 进程，先按下方流程征得同意；未保存的标签页或草稿可能丢失。

---

## 启动流程（skill-mode 强制步骤）

**第一步：探测当前状态（无副作用）**

```bash
node {SKILL_DIR}/scripts/setup-cdp-chrome.js 9222 --detect-only
```

输出形如：

```
CDP_STATUS=ready                        # 已就绪，可直接复用
CDP_URL=http://127.0.0.1:9222/json/version
BROWSER=Chrome/148.0.7778.168
```

或：

```
CDP_STATUS=needs-setup
CHROME_RUNNING=yes                      # 用户有 Chrome 在跑，启动会杀掉
CHROME_PID_COUNT=3
```

**第二步：根据探测结果分支**

- `CDP_STATUS=ready` 且本次只需连接 → 直接使用 `agent-browser --cdp 9222 ...`，**不要运行 setup**。
- 明确请求 `--reset` / `--profile` → 即使 ready 也走重建。用 `--dry-run` 查看将结束的进程，按下方同意流程带原定选项启动。
- `CDP_STATUS=needs-setup` 且 `CHROME_RUNNING=no` → 安全启动：
  ```bash
  node {SKILL_DIR}/scripts/setup-cdp-chrome.js 9222 --yes
  ```
- `CDP_STATUS=needs-setup` 且 `CHROME_RUNNING=yes` → **先向用户确认**：告知会结束 N 个 Chrome 进程、可能丢失未保存工作；同意后带 `--yes` 启动，拒绝则放弃这次自动化。

非 TTY 调用中，Chrome 在运行且未传 `--yes` 时，脚本以退出码 3 报 `NEEDS_CONSENT: ...` 并中止。取得同意后再重跑，不自动补 `--yes`。

---

## 启动脚本选项

| 选项 | 说明 |
|------|------|
| `--detect-only` | 只探测，不修改任何状态（skill 用） |
| `--yes` | 已征得同意，跳过交互提示 |
| `--reset` | 启动前清空 `~/chrome-debug-profile`（登录失效时用） |
| `--profile <name>` | 指定来源 profile（默认 `Default`，如 `"Profile 1"`）；显式传入即重建 |
| `--dry-run` | 打印将执行的步骤，不执行 |

退出码：`0` 成功 / `1` 通用错误 / `2` 用户拒绝（TTY）/ `3` 需同意但缺 `--yes`。

---

## 常用操作

### 打开页面并等待加载

```bash
agent-browser --cdp 9222 open "<URL>"
agent-browser --cdp 9222 wait 3000
```

### 提取页面文本

```bash
agent-browser --cdp 9222 eval 'document.body.innerText.substring(0, 8000)'
```

### 提取 Auth Token

示例读取 localStorage 的 `token` 项或 JavaScript 可读的 Cookie；实际存放位置按站点确认。

```bash
agent-browser --cdp 9222 eval 'localStorage.getItem("token") || document.cookie'
```

### 复杂 JS（含引号 / `$` / 反引号）

用 base64 或标准输入传入脚本，避免 shell 转义错误：

```bash
# 1) base64 包裹
agent-browser --cdp 9222 eval -b "$(echo -n "document.querySelectorAll('a').length" | base64)"

# 2) heredoc + --stdin
cat <<'EOF' | agent-browser --cdp 9222 eval --stdin
const links = document.querySelectorAll('a');
links.length;
EOF
```

### 页面交互（snapshot 拿元素引用）

```bash
agent-browser --cdp 9222 snapshot -i        # 仅交互元素
agent-browser --cdp 9222 click "<CSS or @e1>"
agent-browser --cdp 9222 type "<sel>" "<text>"
```

---

## 停止 / 清理

- 关掉 debug Chrome 窗口即可。若窗口无响应，先按 `--user-data-dir` 核验出 debug 实例的 PID 再只结束它：
  - macOS / Linux：`pgrep -af chrome-debug-profile`
  - Windows：`wmic process where "name='chrome.exe'" get ProcessId,CommandLine | findstr chrome-debug-profile`
  核验 PID 后用 `kill -9 {PID}` / `taskkill /F /PID {PID}`，无法核验则停止。**手工清理不得按 Chrome 可执行文件名批量结束进程**；启动脚本仍走上述同意流程。
- 登录态失效：`node {SKILL_DIR}/scripts/setup-cdp-chrome.js 9222 --reset --yes` 重新复制来源 profile；需结束 Chrome 时仍先征得同意。

---

## OpenCode 环境注意事项

在 OpenCode 前台执行耗时的 CDP 命令时，为页面加载和批量采集设置超时，避免单次调用长时间占住会话。

### 超时包装

Windows 用 PowerShell Job 设置超时：

```powershell
$job = Start-Job { agent-browser --cdp 9222 eval "window.location.replace('https://www.qidian.com/rank/')" }
Wait-Job $job -Timeout 30 | Out-Null
if ($job.State -eq 'Running') { Stop-Job $job; Write-Output "⏱ CDP 操作超时（30s），请重试或手动打断" }
else { Receive-Job $job }
Remove-Job $job -Force
```

macOS / Linux 有 `timeout` 时：

```bash
timeout 30 agent-browser --cdp 9222 eval "window.location.replace('https://www.qidian.com/rank/')" || echo "⏱ CDP 操作超时（30s），请重试或手动打断"
```

### 已知限制

| 场景 | 风险 | 缓解 |
|------|------|------|
| 页面加载超时 | eval 命令等待永不返回 | 设置 30s 超时，超时后重试 |
| 大批量数据抓取 | 多页翻页时累计等待过长 | 每页独立超时，失败后从断点继续 |
| Chrome 进程僵死 | CDP 连接断开但进程未退出 | 先核验 debug profile 对应 PID，只结束该 debug 实例后重连；不得连带普通 Chrome |
| 网络波动 | 请求挂起无超时 | 超时后自动重试一次 |

持续卡死时，在 OpenCode 按 `ESC` 打断。

---

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| `NEEDS_CONSENT` + 退出码 3 | 询问用户是否允许结束现有 Chrome，同意后加 `--yes` 重跑 |
| `CHROME_INSTALLED=no` 或来源 profile 不存在 | 安装并使用 Chrome 一次；已有其他 profile 时用 `--profile` 指定 |
| CDP 端口未监听 | `--detect-only` 再确认；端口被占用则换端口 |
| 页面跳转到登录页 | `snapshot -i` 找登录按钮并操作 |
| `eval` 返回 `null` | 检查 localStorage key 名；含引号的 JS 用 `eval -b` 或 `--stdin` |
| 登录态过期 | `setup-cdp-chrome.js 9222 --reset --yes` 重新拷贝 |
| 有多个 Chrome profile | `--profile "Profile 1"` 指定 |
| Chrome 不会启动（30s 超时） | 试 `--reset`；检查端口冲突；查看 `~/chrome-debug-profile/` 是否损坏 |


---

# SOURCE: skills/story/SKILL.md

---
name: story
description: "网络小说工具箱主入口。根据用户需求自动路由到对应 skill，并可管理作者习惯、启动本地 Dashboard。触发方式：/story、$story、/story dashboard、/网文、「我想写小说」「记住我的写作习惯」「打开工作台」「检查更新」。"
metadata: {"openclaw":{"source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# story：网文工具箱路由

识别用户的写作需求，并路由到对应 skill。

## 路由表

> Codex CLI 中优先使用 `$story-*` 或 `/skills` 触发；Claude Code / OpenCode 继续使用 `/story-*`；Antigravity 可在 `/skills` 中选择或用自然语言点名；OpenClaw 可用 `/skill story-*` 或自然语言点名 skill。下表以 slash command 展示，Codex 可将 `/story-long-write` 等价替换为 `$story-long-write`，OpenClaw 可将其等价替换为 `/skill story-long-write`。

| 用户意图 | 关键词示例 | 路由到 |
|---|---|---|
| 长篇规划/写作 | 讨论长篇结构、规划剧情、开书、写大纲、补细纲、长篇、连载 | `/story-long-write` |
| 写短篇 | 短篇、盐言、一万字 | `/story-short-write` |
| 长篇拆文 | 拆文、分析这本书、黄金三章、灵感库、跨书灵感聚合 | `/story-long-analyze` |
| 短篇拆文 | 拆短篇、分析这个故事 | `/story-short-analyze` |
| 长篇扫榜 | 长篇排行、什么火、新书在冒什么、起点/番茄/晋江/七猫长篇 | `/story-long-scan` |
| 选题决策 | 写什么能爆、帮我选题、选题方向 | `/story-long-scan` |
| 短篇扫榜 | 短篇排行、知乎盐言排行 | `/story-short-scan` |
| 去 AI 味 | 去 AI 味、太 AI、去味 | `/story-deslop` |
| 审查稿件 | 审查、审稿、帮我审一下、一致性检查、看看有没有问题 | `/story-review` |
| 封面 | 封面、封面图 | `/story-cover` |
| 环境部署 | 准备写书、搭环境、初始化 | `/story-setup` |
| 浏览器操控 | 浏览器、抓取、登录态 | `/browser-cdp` |
| 导入小说 | 导入、反向解析、导入小说、把我的书导进来 | `/story-import` |
| 工作台 | dashboard、工作台、看拆文库、浏览项目文件、打开项目面板 | 见下方「Dashboard 工作台」 |
| 检查/更新版本 | 检查更新、有新版本吗、升级、更新工具箱 | 见下方「版本更新检查」 |
| 切换/列出书目 | 切书、换书、列出我的书、我在写哪几本、切换项目 | 见下方「多书切换」 |
| 管理作者习惯 | 记住我的写作习惯、作者画像、待确认偏好、忘掉这个偏好 | 见下方「作者记忆」 |
| 查故事资料 | 查角色、查伏笔、查进度、查设定、什么状态、写到哪了 | spawn `story-explorer` agent（结构化 prompt：`项目目录：{dir}\n查询类型：{根据意图选择}\n查询参数：{用户查询}`）；agent 不可用时见下方「查询降级」 |
| 查资料 | 查资料、帮我查资料、调研、搜索一下、搜一下 | spawn `story-researcher` agent；agent 不可用时见下方「查询降级」 |

### 裸调用与新手

只说 `/story`、看不出意图时，不贴路由表，给四个白话选项：「开一本长篇或接着写」→ `/story-long-write`；「写一篇短篇」→ `/story-short-write`；「把一章改得不那么 AI」→ `/story-deslop`；「更多（拆书、扫榜、导入旧稿、审稿、封面）」→ 再列进阶项。还没部署过（项目根没有 `.story-deployed`）时先建议 `/story-setup`。

### 导入续写顺序

用户问"导入续写先 setup 还是 import"时，直接回答：**推荐先 `/story-setup`，新开/刷新会话后 `/story-import`，最后 `/story-long-write 日更` 或 `/story-long-write 写第N章`**。如果用户已经直接触发 `/story-import`，按 story-import 自带环境检测继续：未 setup 时让用户选择先去 setup 或继续串行导入。

## 作者记忆

用户要求记住、查看、确认、替换或忘掉作者习惯时，加载 [references/author-memory.md](references/author-memory.md)，并只用本 skill 的 `scripts/author_memory_commit.py` 管理两级 `.story/作者记忆/`：全局、题材、流程条目在工作区（`AP`），本书条目在书目录（`BP`，传 `--book-root`）。常用变更走单事件 `record`；工具未返回 `ok: true` 和 `Author Memory Receipt` 前，不得声称已记住。告诉作者时先用一句人话说记住了什么（如「记住了：这本书的对话一律用「」」），回执放最后一行，写法见协议「回执怎么告诉作者」。显示画像或待确认项是只读操作；不存在时直接说明尚未建立。

新增习惯保留用户原话和适用范围，只记作者明确表达的偏好；一次性要求只执行，小说事实写入本书设定/追踪，不从反复修改或成稿推断偏好。范围含糊时进待确认；与同范围生效条目冲突时记录候选，作者明确替换旧规则才用 `replace`，不原地改写历史。

作者要求「整理作者记忆」、回执提示容量不足、工具报单书布局错误，或项目级画像仍有「本书：」条目时，加载 [references/author-memory-maintenance.md](references/author-memory-maintenance.md)；迁移本书条目用 `migrate --book-root`。工作区按协议定位已有记忆的最近祖先或当前创作工作区，不默认写到用户主目录。

## Dashboard 工作台

用户执行 `/story dashboard`（Codex 为 `$story dashboard`），或明确要求打开工作台、查看项目文件时，启动本 skill 的本地 Dashboard：

1. 把**当前工作目录**作为默认工作区；用户明确给出目录时改用该目录。目录必须存在。
2. 从当前已加载的 `story` skill 目录定位 `scripts/dashboard-server.mjs`，不要硬编码仓库路径、
   全局 skill 路径或用户主目录。
3. 检查 `node` 可用后，以长运行进程执行：

   ```bash
   node "<story-skill-dir>/scripts/dashboard-server.mjs" --root "<workspace>" --open
   ```

4. 等待输出出现“本机地址”，把完整 URL 回给用户。工具支持后台进程/PTY 时让服务保持运行；
   无法自动拉起浏览器不算失败，仍返回可点击 URL。
5. Dashboard 默认只监听 `127.0.0.1`。不要主动增加 `--allow-network`，不要把工作区暴露到
   局域网或公网。

工作台会识别标准 `拆文库/{书名}/`，兼容存量 `拆文库-{书名}/`。写作项目识别同时支持：

- 长篇目录结构：目录内含 `正文/`、`大纲/`、`设定/` 或 `追踪/` 任一普通子目录。
- 短篇单文件结构：目录内含普通文件 `正文.md`，并同时含 `小节大纲.md` 或 `设定.md`。

符号链接不作为项目标记，只有单个 `正文.md` 的资料目录不识别为写作项目。浏览器可编辑 `.md`、`.txt`、`.json`、`.yaml`、`.yml`、`.toml`；保存或确认删除时核对文件内容版本，避免覆盖外部修改。

停止服务时终止对应的 Node 长运行进程即可。若用户只问用法，不要替他启动；给出
`/story dashboard` / `$story dashboard` 两种平台对应入口。

## 路由流程

1. 分析用户请求，提取意图关键词
2. 匹配上表，找到对应的 skill
3. 如果能明确匹配，直接调用对应 skill（Claude/OpenCode 可用 `Skill("skill-name")` 或 slash command；Codex 用 `$skill-name` / `/skills`；Antigravity 用 `/skills` 或自然语言点名；OpenClaw 用 `/skill skill-name` 或自然语言点名）
4. 无法匹配时只问缺失信息；写作篇幅按下一条处理
5. 如果用户说"我想写小说"但未指定长篇/短篇，询问篇幅类型后再路由

## 查询降级

> Spawn 版本提示（不阻断 spawn）：先读取项目根 `.story-deployed` 的 `agents_version`。与本版 `agents_version: 34` 不一致时（标记缺失、字段缺失/非整数、小于或大于 34）**照常按文件存在性检查并 spawn**，但只检查当前运行时的 canonical 目录；同时报告 `Notice: agents bundle 版本不匹配（项目 {N}，本版 34）` 并提示重新运行 `/story-setup` 后新开会话；大于 34 时额外提示先更新 oh-story-claudecode，不要用本地旧版 setup 降级覆盖。只有 agent 文件缺失、或运行时不暴露 custom agent 时才降级 solo/direct，报告 `Fallback: ... -> solo`。

「查故事资料」「查资料」走 agent 前先做轻量可用性检查（路由只做这一层，不承担全局部署策略）：当前不在子代理上下文、当前运行时的 Agent/Task 或 `invoke_subagent` 工具可用，且对应部署文件存在（Claude `.claude/agents/*.md`、OpenCode `.opencode/agents/*.md`、Codex `.codex/agents/*.toml`、Antigravity `.agents/agents/agent-name/agent.md`，其中 `agent-name` 为目标 agent 名）→ 可尝试 spawn。Antigravity 用 `invoke_subagent` + 同名 `TypeName`，不得因其他端文件存在而误判。任一不满足，或运行时返回 unknown agent / 未暴露 custom-agent registry，则降级，不硬失败：

- `story-explorer` 不可用 → 主会话直接用 Read/Grep 从项目文件检索（角色状态/伏笔/进度/设定），回答前说一句「查资料助手没启用，这次我直接翻项目文件」；项目尚未部署时提示先 `/story-setup`（Codex 中用 `$story-setup`）。
- `story-researcher` 不可用 → 主会话用现有检索/回答能力完成，或提示用户改用 `/browser-cdp` 采集，同样用一句白话说明。

回答作者时讲故事里的事（谁、在哪章、发生了什么）；文件字段名、伏笔/事件编号不单独出现，编号必须跟着故事描述。

## 项目状态感知

路由前先检查当前项目状态：

- **无项目目录**（没有包含 `追踪/` 或 `设定/` 的书名目录，也没有同时有 `正文.md` 与 `小节大纲.md`（或 `设定.md`）的短篇目录）：
  - 创建写作项目时先运行 `/story-setup` 初始化环境（Codex 中用 `$story-setup`）；只讨论结构或选题时直接路由
  - 如果用户要扫榜/拆文，直接路由
- **已有项目**：读取 `.story-deployed`，按目标 skill 的环境检查继续；查询沿用上方降级，导入保留串行选项。需要初始化或补部署时运行 `/story-setup`（Codex 中用 `$story-setup`）。

## 多书切换

用户想切换或查看在写的书时（一个项目可同时有多本）：

1. 在项目根查找所有书目录：包含 `追踪/` 或 `设定/` 子目录的目录，或同时有 `正文.md` 与 `小节大纲.md`（或 `设定.md`）的目录（含 `长篇/`、`短篇/` 下的子目录）。
2. 列出书名，并标出当前 `.active-book` 指向的那本。
3. 让用户选择，把所选书的相对路径写入项目根 `.active-book`（覆盖原内容）。
4. 只发现一本时直接确认为活跃书，无需询问。

## 版本更新检查

用户问“有没有新版本”“检查更新”“升级”时执行。**先报告版本，是否安装由用户决定。**

1. **当前版本**：读本 skill 同目录的 `VERSION` 文件；缺失则视为未知。
2. **最新版本**：优先 `gh release view --json tagName,name,url -R zenstory-ai/oh-story-claudecode` 取 `tagName`；无 gh 用 `curl -fsS --max-time 5 https://api.github.com/repos/zenstory-ai/oh-story-claudecode/releases/latest` 取 `.tag_name`（jq 或 grep）。查不到 → 告知"暂时拉不到最新版本，可手动看 [Releases](https://github.com/zenstory-ai/oh-story-claudecode/releases)"，不报错。
3. **比较**：当前版本已知时，去掉 `v` 前缀按语义版本比较（major.minor.patch）；未知时只展示最新稳定版，不判定是否已最新。`gh release` 默认取 latest 稳定版，不含 pre-release。
4. **告知**：
   - 已最新 → 「已是最新版 vX.Y.Z」。
   - 有新版或当前版本未知 → 展示已知版本与 [Releases](https://github.com/zenstory-ai/oh-story-claudecode/releases)/[CHANGELOG](https://github.com/zenstory-ai/oh-story-claudecode/blob/main/CHANGELOG.md)，有 release notes 时附更新要点，再用宿主可用的提问方式问「现在更新吗？」：
     - 选更新 → 跑 `npx skills add zenstory-ai/oh-story-claudecode -y -g`（`-g` 全局，去掉则只更当前目录）；完成后提示：已部署过的项目在项目根重跑 `/story-setup`（Codex 中用 `$story-setup`）同步 hooks/agents/references，并**新开一个会话**让 agents 重新注册。
     - 选先不 → 不动，告知随时可再来。


---

# SOURCE: skills/story-cover/SKILL.md

---
name: story-cover
version: 1.0.0
description: "小说封面生成。根据书名、作者名自动分析题材风格，调用 GPT-Image-2 生成含标题和署名的专业级网文封面；Codex CLI 优先使用内置 ImageGen，无需单独 API Key。触发方式：/story-cover、/封面、「帮我做个封面」「生成封面图」「做个小说封面」「封面设计」。"
metadata: {"openclaw":{"requires":{"env":["GPT_IMAGE_API_KEY"],"bins":["curl","jq","base64"]},"primaryEnv":"GPT_IMAGE_API_KEY","source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# story-cover：小说封面生成

根据书名和题材生成包含书名、笔名的完整封面，让读者一眼看出题材和氛围。

---

## 生成通路

- **Codex 内置（优先）**：当前 Codex CLI 会话可调用 `$imagegen` / `image_gen` 时，直接调用工具生成并保存，无需 `OPENAI_API_KEY` 或 `GPT_IMAGE_API_KEY`，不运行 `curl`。
- **API 回退**：仅在会话没有内置工具或用户明确指定 API 时使用，需要 `GPT_IMAGE_API_KEY`。工具缺失不等于 Codex 订阅不支持生图；内置调用失败时先报告错误，不静默切换到可能收费的 API。

## 输出参数与 API 回退环境变量

| 变量 | 必填 | 默认 | 说明 |
|:-----|:----:|:-----|:-----|
| `GPT_IMAGE_API_KEY` | API 回退必填 | — | OpenAI 或兼容代理的 API Key；Codex 内置通路不用 |
| `GPT_IMAGE_BASE_URL` | | `https://api.openai.com/v1` | 兼容代理时改这个 |
| `GPT_IMAGE_MODEL` | | `gpt-image-2` | 仅在测试新模型时覆盖 |
| `GPT_IMAGE_SIZE` | | `1024x1536` | API 回退的请求尺寸：番茄 3:4→`768x1024`，默认 2:3→`1024x1536`。实际尺寸以出图结果为准，固定上传像素由「导出平台上传尺寸」步骤保证 |
| `UPLOAD_SIZE` | | — | 平台固定上传像素（番茄 `600x800`）；设置后由「导出平台上传尺寸」步骤居中裁剪+缩放出上传版（不变形、不依赖出图尺寸） |
| `BOOK_DIR` | ✅ | — | 输出目录，建议 `./covers/<书名>` |
| `REF_IMAGE` | | — | 参考图本地路径或 URL；内置通路先把图片载入会话，API 回退走 `images/edits` 图生图 |

---

## 生成流程

### Step 1：收集信息

必填：书名、作者名（笔名）、目标平台、输出目录 `BOOK_DIR`。目录建议为 `./covers/<书名>`；API 回退通过环境变量传入，内置通路直接使用本次确定的目录。问作者时说「封面存在哪？默认 `./covers/<书名>`」。
选填：参考图 `REF_IMAGE`（本地路径或 URL）、风格偏好、尺寸；参考图的用法见 Step 4 对应通路。

> **书名和笔名是封面必需信息**：缺任一时，先用宿主可用的提问方式请作者补全，不得编造或留空。

**按目标平台定封面尺寸**：番茄上传 600×800，比例为 **3:4**；出图比例不符时，平台再次裁剪可能切掉书名或笔名。

| 平台 | 上传尺寸 | 比例 | 生成 `GPT_IMAGE_SIZE`（尽量） |
|:-----|:--------|:-----|:-------------------|
| 番茄小说 | 600×800 | 3:4 | `768x1024` |
| 其他平台（默认竖版） | 按平台规格 | 2:3 | `1024x1536` |

内置通路把目标比例写进提示词；API 回退再 `export GPT_IMAGE_SIZE`。平台有固定上传像素时设置 `UPLOAD_SIZE`（番茄 `600x800`），在 Step 5 居中裁剪并缩放到精确尺寸。平台与题材风格见 [references/cover-styles.md](references/cover-styles.md)。

### Step 2：题材判定

扫描书名（必要时简介）中的关键词，对照 [references/cover-styles.md](references/cover-styles.md) 的「题材推断规则」表选定题材。

- 单题材命中 → 直接采用
- 多题材命中 → 按优先级取一：仙侠 > 西幻 > 古言 > 现言 > 都市 > 悬疑 > 科幻 > 历史 > 灵异 > 轻小说
- 零命中 → 默认 `都市`

### Step 3：构建提示词

提示词 = **文字层** + **风格层** + **画面层**。设计指令用英文，书名和笔名保留作者提供的原文。

#### 文字层：书名 + 作者名字体设计

在提示词中直接包含中文书名和作者名，GPT-Image-2 可直接渲染。**重点描述字体风格**：

```
Title text '书名' at top center in [书名字体风格].
Author name '作者名' at bottom center in [作者名字体风格].
```

#### 书名字体风格

| 题材 | 描述关键词 |
|:-----|:-----------|
| 玄幻/仙侠 | `bold golden brush calligraphy with metallic glow and sharp strokes` |
| 都市 | `modern bold sans-serif with metallic silver finish` |
| 古言/宫斗 | `elegant golden traditional Kai script with ornate decoration` |
| 现言/甜宠 | `soft rounded handwritten style in white with pink glow` |
| 悬疑/推理 | `distorted bold cracked letters in blood red` |
| 科幻/末世 | `neon glowing futuristic font in electric blue` |
| 西幻 | `metallic embossed fantasy lettering with glow effect` |
| 历史/军事 | `heavy stone-carved seal script in deep red` |
| 灵异/恐怖 | `eerie dripping handwritten font in sickly green` |
| 轻小说 | `colorful cartoon outlined bubbly font` |

#### 作者名字体风格（重点：作者名必须精心设计，不能只是"小字"）

作者名指定**字体、颜色和装饰元素**，与书名风格呼应，保持清晰可读而不抢焦点。

| 题材 | 作者名风格提示词 |
|:-----|:----------------|
| 玄幻/仙侠 | `small refined white serif text with faint golden glow, flanked by delicate cloud-scroll ornaments on both sides, resting on a thin horizontal gold line` |
| 都市 | `small clean white modern text with subtle drop shadow, positioned above a thin silver horizontal divider line` |
| 古言/宫斗 | `small elegant dark red traditional text inside a thin golden rectangular border frame with corner decorations` |
| 现言/甜宠 | `small soft pink-white handwritten text with a tiny heart motif on the left side, light sparkle effect` |
| 悬疑/推理 | `small pale grey text with slight blur effect, almost hidden in the shadows, a thin cracked line underneath` |
| 科幻/末世 | `small crisp white monospace text with subtle cyan scanline overlay, flanked by small geometric brackets` |
| 西幻 | `small bronze medieval script text with aged parchment texture, enclosed in a small decorative shield or banner shape` |
| 历史/军事 | `small dignified white Song typeface text above a double horizontal line in dark red` |
| 灵异/恐怖 | `small faded grey-green text slightly tilted, with a thin dripping ink line above` |
| 轻小说 | `small playful rounded white text with pastel color outline, tiny star decorations on both sides` |

**作者名通用规则**：
- 大小：`small`（不能太大抢书名焦点，也不能太小看不清）
- 位置：`at bottom center`，与画面底部保持适当间距
- 必须有装饰元素：线条/边框/小图标/光效中至少一种
- 颜色与背景形成对比但不刺眼

#### 风格层：平台风格

从 [references/cover-styles.md](references/cover-styles.md) 的「平台风格」节选取目标平台对应的关键词串。

#### 画面层：题材 + 构图

从 [references/cover-styles.md](references/cover-styles.md) 读取题材对应的风格标签、色彩、人物、背景描述。

构图变体（首次输出 2-3 个方案）：

| 方案 | 构图 | 适合题材 |
|:-----|:-----|:---------|
| A | 人物特写 + 场景 | 全题材通用 |
| B | 全身像 + 动态姿势 | 玄幻、都市、西幻 |
| C | 纯场景/氛围图 | 悬疑、科幻、历史 |

#### 完整提示词模板

```
Chinese web novel cover design, [平台风格].
Title text '{书名}' at top center in [书名字体风格].
Author name '{作者名}' at bottom center in [作者名字体风格 — 从上表选择].
[题材风格标签]. [人物描述]. [背景描述].
[色彩指令]. [光效指令].
Professional book cover, high detail digital painting, portrait [平台比例：番茄=3:4，默认=2:3] ratio, keep title and author name inside the central safe area away from edges (inner ~85%), no watermark
```

#### 提示词技巧（实测验证）

- 人物描述越具体越好：服饰、姿态、发型、表情、道具每个维度都指定
- 背景分层：前景（人物）→ 中景（场景）→ 远景（氛围）
- 光效是指定光源方向 + 颜色（如 `dramatic golden light from above`）
- 用 `digital painting style` 而非 `photo`，避免真人照片感

### Step 4：生成并保存

#### Codex 内置 ImageGen（优先）

1. 用 Step 3 的完整提示词调用 `image_gen`。比例和安全区写进提示词，不传 `GPT_IMAGE_MODEL`、`GPT_IMAGE_SIZE`、`response_format` 等 API 参数。
2. 有 `REF_IMAGE` 时，本地文件先用图片查看工具载入会话；URL 先下载再载入。说明它是编辑目标还是风格参考，并列出必须保持的内容。
3. 每个构图方案单独调用一次。先创建 `BOOK_DIR/封面/`，再把工具返回的图片复制为 `封面_vN.png`，`N` 自增且不覆盖旧版；保留 `$CODEX_HOME/generated_images/` 原文件，同时保存同名 `.prompt.txt`，有参考图再保存 `.ref.txt`。确认图片可读，并把原图绝对路径交给 Step 5。

#### API 回退

`gpt-image-2` 返回 base64，请求体不带 `response_format`。`$PROMPT` 使用 Step 3 拼出的完整提示词。

两种调用方式二选一：未设置 `REF_IMAGE` → 走「文生图」；设置了 → 走「图生图」。

#### 文生图（默认）

```bash
set -euo pipefail
: "${GPT_IMAGE_API_KEY:?请设置 export GPT_IMAGE_API_KEY=你的key}"
: "${PROMPT:?请先 export PROMPT=构建提示词步骤拼好的完整提示词}"
BASE_URL="${GPT_IMAGE_BASE_URL:-https://api.openai.com/v1}"
MODEL="${GPT_IMAGE_MODEL:-gpt-image-2}"
SIZE="${GPT_IMAGE_SIZE:-1024x1536}"
BOOK_DIR="${BOOK_DIR:?请先 export BOOK_DIR=./covers/<书名>}"

mkdir -p "$BOOK_DIR/封面"

# 自增版本号，避免覆盖之前生成的封面
i=1
while [ -f "$BOOK_DIR/封面/封面_v${i}.png" ]; do i=$((i+1)); done
OUT="$BOOK_DIR/封面/封面_v${i}.png"
RESP=$(mktemp)
trap 'rm -f "$RESP"' EXIT

# 用 jq 拼 JSON 体，避免 PROMPT 里的引号/换行/中文把 shell 字符串撑破
BODY=$(jq -n \
  --arg m "$MODEL" \
  --arg p "$PROMPT" \
  --arg s "$SIZE" \
  '{model:$m, prompt:$p, size:$s}')

curl -fsS --max-time 180 --retry 2 --retry-delay 5 \
  "$BASE_URL/images/generations" \
  -H "Authorization: Bearer $GPT_IMAGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$BODY" > "$RESP"

# API 出错时早退，避免把 error JSON 当成 base64 写成损坏 PNG
if jq -e '.error' "$RESP" >/dev/null 2>&1; then
  echo "API error:" >&2
  jq '.error' "$RESP" >&2
  exit 1
fi

# `// empty` 让缺失字段输出空串而非 "null"，配合下面的 -s 检查避免写出 3 字节假 PNG
jq -er '.data[0].b64_json // empty' "$RESP" | base64 --decode > "$OUT"
[ -s "$OUT" ] || { echo "empty or malformed output: $OUT" >&2; head -c 300 "$RESP" >&2; exit 1; }

# 落地提示词副本，方便迭代时基于上一次微调
printf '%s\n' "$PROMPT" > "${OUT%.png}.prompt.txt"

file "$OUT"
ls -lt "$BOOK_DIR/封面/"
```

#### 图生图（提供参考图时）

下面的 `/v1/images/edits` 命令通过 `multipart/form-data` 上传本地图片，不加 `Content-Type: application/json`。文本字段用 `--form-string`，图片字段用 `-F image=@path`。

```bash
set -euo pipefail
: "${GPT_IMAGE_API_KEY:?请设置 export GPT_IMAGE_API_KEY=你的key}"
: "${PROMPT:?请先 export PROMPT=构建提示词步骤拼好的完整提示词}"
BASE_URL="${GPT_IMAGE_BASE_URL:-https://api.openai.com/v1}"
MODEL="${GPT_IMAGE_MODEL:-gpt-image-2}"
SIZE="${GPT_IMAGE_SIZE:-1024x1536}"
BOOK_DIR="${BOOK_DIR:?请先 export BOOK_DIR=./covers/<书名>}"
REF_IMAGE="${REF_IMAGE:?请先 export REF_IMAGE=本地路径或 URL}"

mkdir -p "$BOOK_DIR/封面"

# 自增版本号
i=1
while [ -f "$BOOK_DIR/封面/封面_v${i}.png" ]; do i=$((i+1)); done
OUT="$BOOK_DIR/封面/封面_v${i}.png"
RESP=$(mktemp)
REF_TMP=""
trap '[ -n "$REF_TMP" ] && rm -f "$REF_TMP"; rm -f "$RESP"' EXIT

# URL 先下载到临时文件，本地路径直接用。用裸 mktemp 以保证 macOS/Linux 行为一致。
case "$REF_IMAGE" in
  http://*|https://*)
    REF_TMP=$(mktemp)
    curl -fsSL --max-time 60 -o "$REF_TMP" "$REF_IMAGE"
    REF_LOCAL="$REF_TMP"
    ;;
  *)
    [ -f "$REF_IMAGE" ] || { echo "参考图不存在: $REF_IMAGE" >&2; exit 1; }
    REF_LOCAL="$REF_IMAGE"
    ;;
esac

curl -fsS --max-time 240 --retry 2 --retry-delay 5 \
  "$BASE_URL/images/edits" \
  -H "Authorization: Bearer $GPT_IMAGE_API_KEY" \
  --form-string "model=$MODEL" \
  --form-string "size=$SIZE" \
  --form-string "prompt=$PROMPT" \
  -F "image=@$REF_LOCAL" > "$RESP"

if jq -e '.error' "$RESP" >/dev/null 2>&1; then
  echo "API error:" >&2
  jq '.error' "$RESP" >&2
  exit 1
fi

# `// empty` 让缺失字段输出空串而非 "null"，配合 -s 检查避免写出 3 字节假 PNG
jq -er '.data[0].b64_json // empty' "$RESP" | base64 --decode > "$OUT"
[ -s "$OUT" ] || { echo "empty or malformed output: $OUT" >&2; head -c 300 "$RESP" >&2; exit 1; }

printf '%s\n' "$PROMPT"    > "${OUT%.png}.prompt.txt"
printf '%s\n' "$REF_IMAGE" > "${OUT%.png}.ref.txt"

file "$OUT"
ls -lt "$BOOK_DIR/封面/"
```

### Step 5：导出平台上传尺寸（平台有固定像素时）

平台有固定上传像素（番茄 600×800）时，把原图**居中裁剪+缩放**到精确尺寸，保持画面比例，原图保留并另存 `_上传` 版。`SRC` 填 Step 4 的原图绝对路径，`TARGET` 填 Step 1 的上传尺寸，不依赖上一段 shell 的临时变量：

```bash
SRC='<Step 4 生成的原图绝对路径>'
TARGET='<Step 1 确定的平台上传尺寸；无则留空>'
[ -f "$SRC" ] || { echo "封面原图不存在: $SRC" >&2; exit 1; }
if [ -n "$TARGET" ] && [ -f "$SRC" ]; then
  UP="${SRC%.png}_上传.png"; W="${TARGET%x*}"; H="${TARGET#*x}"
  if command -v magick >/dev/null 2>&1; then M=magick
  elif command -v convert >/dev/null 2>&1; then M=convert; else M=""; fi
  if [ -n "$M" ]; then
    "$M" "$SRC" -resize "${W}x${H}^" -gravity center -extent "${W}x${H}" "$UP"  # 缩放填满后居中裁
  elif command -v sips >/dev/null 2>&1; then
    cp "$SRC" "$UP"
    sw=$(sips -g pixelWidth "$UP" | awk '/pixelWidth/{print $NF}')
    sh=$(sips -g pixelHeight "$UP" | awk '/pixelHeight/{print $NF}')
    if [ $((sw*H)) -ge $((sh*W)) ]; then sips --resampleHeight "$H" "$UP" >/dev/null
    else sips --resampleWidth "$W" "$UP" >/dev/null; fi
    sips -c "$H" "$W" "$UP" >/dev/null   # sips -c 是 高 宽，居中裁
  else
    echo "无 magick/convert/sips，跳过；手动把 $SRC 居中裁剪+缩放到 $TARGET 再上传" >&2
  fi
  [ -f "$UP" ] && file "$UP"
fi
```

> 提示词中的中心安全区用于减少裁切风险；导出后仍按 Step 6 检查书名和笔名是否完整。

### Step 6：质量检查 + 迭代

| 检查项 | 标准 |
|:-------|:-----|
| 文字渲染 | 书名、笔名清晰可辨，字体风格匹配题材 |
| 题材匹配 | 视觉风格与书名题材一致 |
| 构图合理 | 主体突出，文字不遮挡核心画面 |
| 平台适配 | 符合目标平台的封面风格调性 |
| 平台尺寸 | 比例与平台一致；缩放到上传尺寸后书名、笔名完整可见、未被裁切 |

未达标或作者希望调整时，可更换构图、色调、字体或平台风格。

交付时这样告诉作者；命令、环境变量和接口报错不贴给作者，失败时用一句话说原因和办法（如「生图接口没配好，需要先设置 API Key」）：

<!-- author-report -->
```md
封面做好了：`{封面图路径}`{；{平台}上传版（{上传尺寸}）：`{上传版路径}`}
这版的思路：{构图 + 色调 + 书名字体，一句话}
想调的话可以说：{2-3 个具体方向，如「换成人物特写」「书名改成毛笔字」}
```

---

## 参考资料

| 文件 | 何时加载 |
|:-----|:---------|
| [references/cover-styles.md](references/cover-styles.md) | 题材→视觉风格映射、平台风格详情、提示词模板 |


---

# SOURCE: skills/story-deslop/SKILL.md

---
name: story-deslop
version: 1.0.0
description: "网文去AI味。检测并清除文本中的AI写作痕迹，让文字回归自然、非模板化。触发方式：/story-deslop、/去AI味、「去AI味」「这篇太AI了」「网文去AI味」。"
metadata: {"openclaw":{"source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# story-deslop：网文去AI味

**文风裁决**：正文写作、改写或审稿前先读 [references/style-resolution.md](references/style-resolution.md)，加载本书文风并形成 `style_resolution`；无作者记忆也执行。当前请求、本书文风和 active 偏好按维度覆盖通用 references；同一裁决交给后续执行者。

**改写重点：保留剧情功能，删掉空转解释与套话，按人物声线恢复自然节奏。**

---

> Agent 兼容性：只检查当前运行时的 canonical 目录：Claude `.claude/agents/{agent}.md`、OpenCode `.opencode/agents/{agent}.md`、Codex `.codex/agents/{agent}.toml`、Antigravity `.agents/agents/agent-name/agent.md`（`agent-name` 为目标 agent 名），不得因其他端文件存在而误判。Claude 用 `subagent_type`，OpenCode 用 `subagent` 工具的 `agent` 参数，Codex 用同名 `agent_type`，Antigravity 用 `invoke_subagent` + `TypeName`。运行时未暴露 custom-agent registry / `invoke_subagent`、返回未知 agent，或检测到 `.zcode/`（ZCode 3.3.4 不执行项目 custom agents）时降级 solo/direct：报告里一句白话告诉作者「这次由我直接改」，`Fallback: project custom agents unavailable -> solo` 原文只写进报告最后一行「技术备注：」。
>
> Spawn 版本提示（不阻断 spawn）：先读取项目根 `.story-deployed` 的 `agents_version`。与本版 `agents_version: 34` 不一致时（标记缺失、字段缺失/非整数、小于或大于 34）**照常按文件存在性检查并 spawn**，同时用一句白话提示作者「写作助手是旧版，运行 /story-setup 后新开对话」，`Notice: agents bundle 版本不匹配（项目 {N}，本版 34）` 原文写进技术备注行；大于 34 时额外提示先更新 oh-story-claudecode，不要用本地旧版 setup 降级覆盖。只有 agent 文件缺失、或运行时不暴露 custom agent 时才降级 solo/direct，`Fallback: ... -> solo` 同样只进技术备注行。

## 核心哲学

### 原则 1：改味优先，别当改错

AI味按风格问题处理：检查书面腔、机械对仗和重复解释，保留自然、可读且承担信息的表达。

### 原则 2：改最少，效果最大

去AI味不等于重写。目标是改最少的字，让整段文字的"味"变过来。能改一个词就不改一句，能删一句就不重写一段。没有问题的句子尽量保留原句；人名、地名、数字、章节名、专有名词优先保留。

**过度去AI味保护**：
- **不得整段删除正文内容**。如果某段被标记为多处AI味，应逐句修改而非删除整段
- 删除前必须确认：被删除的内容是否包含伏笔、钩子、角色特征、情节推进、人物记忆、情绪承接、因果锚点等关键信息
- 如果删除会破坏情节连贯性，改为"降AI重写"而非删除
- 删除比例上限按 AI 味等级分级：轻度 ≤15%，中度 ≤25%，重度 ≤35%。重度文本可通过“合并重复描写+重写降AI”产生更大字符差，但仍不得整段删除或删掉剧情功能。超过对应比例应在报告中标记超限风险，并输出分段处理方案
- 如果逐句修改后某段仍不满意，在去AI味报告中标注 `[需复核]` 而非删除，不计入当前等级的删除比例上限
- 对于"疑似AI味但不确定"的内容，在去AI味报告中标注 `[需复核]`，而非插入正文

### 原则 3：保留创作意图

去AI味只改"怎么说"，不改"说什么"。剧情、人设、情节走向一概不动；不新增原文没有的情节、设定、关系或时间线。原文逻辑问题单独标记，不借润色改剧情。

### 原则 4：按文风保留有功能的语气与停顿

去AI味不是把文字全部磨成句号。质问里的 `？`、爆发峰值的少量 `！` 可以保留；犹豫、未尽、打断或拖长用动作、短句、换行、逗号或句号重排。默认不保留 `……` / `——`；本书明确选择并登记的功能性停顿保留，也要清理无功能的 `!!!` 和随机标点堆砌。

### 边界：去AI味只处理读感与叙事功能

去AI味治读感，不承诺任何分数结果。若用户贴出工具报告，只把能对应到正文的问题转成具体修改点；不写“0% AI / 100% 真人”，不注水、故意错字或打乱标点。去AI味仍以原文剧情边界为准，不把表达修复变成新增情节或新增事件链。

### 作者习惯

若作者记忆 state 已存在，改写前用 `scripts/author_memory_commit.py query --workspace {工作区} --book-root {书目录} --kind prose_style [--genre {题材}] [--workflow 去AI味]` 获取匹配的 active 文风条目（`--workspace` 必传；`--genre` 填本书题材类型），把输出的 `lines`（≤2KB）交给 inline/spawn 执行者作为自然倾向，不逐条展示或最大化命中，不牺牲连贯、节奏和字数；当前请求、原文剧情功能和本 skill 保护规则优先。用户明确声明长期文风习惯时，改写后按 [references/author-memory.md](references/author-memory.md) 用 `record` 写入并按其「回执怎么告诉作者」转告；只记作者明确说的，一次性要求、反复修改、检测器 findings 和助手自己的结果不记录。`omitted_ids` 非空时，按 `omitted_summaries` 原话告诉作者哪些习惯没带上。

---

## 自然文本基准

去AI味需要知道自然网文文本的特征。下表用于定位常见表达问题，具体取舍按本书文风：

### 自然文本特征（与AI味对比）
| 维度 | 自然文本 | AI味文本 |
|------|----------|--------|
| 段落长度 | 随 beat 长短不一：爽点/转折压短，推理/氛围/情绪链放长 | 通篇同一长度，整齐均匀 |
| 句内节奏 | 叙述以逗号长句为主（逗号之间 8-12 字、整句 20-30 字，见 anti-ai-writing.md 规则 3） | 要么长句臃肿，要么通篇碎句像提纲 |
| 对话标签 | 标签低频且不公式化，多用动作/上下文引出；普通"说"可保留 | 几乎每句都有"说道/问道/笑道" |
| 情绪表达 | 直写有上下文支撑，反应带后果 | 空转的情绪总结句，或给每个情绪词配微动作 |
| 比喻 | 贴合人物视角（如"像哈士奇护食"） | 套用万能画面（如"如寒冰般"） |
| 语气词 | "嘤""嘶""靠""行吧" | 几乎没有 |
| 省略 | 省去已清楚的信息，保留必要指代 | 重复解释已知信息 |
| 排比 | 偶尔1-2个，从不连续3+ | 连续3-5个排比是标配 |
| 结尾 | 动作/对话收尾 | 总结/升华/感慨收尾 |

### 自然表达替换参考
> 以下是替换方向；只沿用原文已有信息，不把示例动作照加进正文。

- 替代"深吸一口气"→ 直接删；若确有功能，改成角色当下动作
- 替代"眼中闪过一丝..."→ "他垂下眼" / "眯起眼"
- 替代"嘴角勾起一抹..."→ "他嘴角一扯" / "乐了"
- 替代"仿佛..."→ 优先直接白描；确需比喻时只留少数生活化、角色化比喻
- 替代"不禁..."→ 直接写动作
- 替代"缓缓开口"→ "说" / 用动作引出对话

---

## 检测流程

去 AI 味只有一条管线：确定性检测器 → 按分级选 Gate → 一次定点改写 → 复扫。长篇写作的章末检测与按需审查、story-review 的确定性预检用的是同一套检测器与 Gate，本 skill 是它的独立入口。

### Phase 1：AI味扫描

**先认篇幅**：目标是单个 `正文.md`（同目录常有 `小节大纲.md` 或 `设定.md`）按短篇处理，门禁 F/G 保留短篇卖点（主观审判句、火葬场预告、心死式章尾）；`正文/` 下逐章文件或章节片段按长篇处理。拿不准问作者一句。

对用户提交的文本做快速扫描，标记AI味浓重的位置。报告写给作者：问题用白话说并附原文，脚本名、检测器类别名、Gate 字母不进报告。

<!-- author-report -->
```md
## AI味检测报告

### 整体评估
- AI味等级：{轻度/中度/重度}
- 主要问题：{1-3 个白话描述}

### 问题标记
| 位置 | 类型 | 原文 | 问题 |
|------|------|------|------|
| 第X段 | 套话 | "眼中闪过一丝..." | 典型AI高频词 |
| 第Y段 | 句式 | "...，带着..." / 连续3句排比 | AI惯用句式，过于工整 |
| 第Z段 | 情绪空转 | "一丝悲伤涌上心头" | 只总结情绪，没有落点 |
| 第M段 | 节奏 | 段段4-6句、长度均匀 | 整段同节奏 |
| 第N段 | 重复描写 | 同一动作连续拆写 | 相邻段重复同一瞬间 |
| 第P段 | 解释腔 | "她不知道的是…" / "之所以…是因为" | 叙述者跳出角色解释、剧透或下结论 |
| 第Q段 | 动作清单 | "伸手拿起…取过…放下…转身…" | 像监控录像，缺人物的感受 |
```

> 类型 → Gate 速查（选 Gate 用，不写进表）：套话 = A，句式 = B，情绪空转 = C，节奏 = D，对话腔调 = E，结尾升华 = F，解释腔 = G，重复描写 = C/D，动作清单 = D/E。

> 评价只输出 AI味等级（轻度/中度/重度）与问题标记；不做「上乘 / 新人投稿属上乘 / 性价比高」这类横向市场判断——skill 没有平台投稿分布数据，这类措辞是无依据的越权担保。

**确定性句式预检（文件模式）**：本地文件的「AI味扫描」先运行本 skill 自带脚本，只报告不修改。下列 `node scripts/...` 命令从本 skill 根运行，正文参数使用绝对路径：

```bash
node scripts/check-ai-patterns.js --check --fail-on=blocking <正文文件...>
```

- 检测器 blocking＝必须修，advisory＝建议看；脚本不逐词统计整份禁用词表，findings 条数不能直接当定档密度。轻/中/重仍按「诊断与分级」六指标核定。
- severity=blocking 的类别（`not-is-comparison` / `em-dash` / `voice-contrast` / `negation-parade` / `reverse-not-is` / `trailer-ending` / `trailer-summary`）是写作/去 AI 味时优先处理的问题：章尾预告与章尾状态总结（`trailer-ending` / `trailer-summary`）归 Gate F，其余 blocking 并入 Gate B。
- 其他 findings（碎句号、长段落、微动作、套式反应细节、动作清单、抽象总结、套词、比喻密度、解释链、公文腔、过度精炼、低连接密度、引号强调滥用、`formulaic-parallelism` 工整并列）只作读感提示；完整类别和修法见 `references/anti-ai-writing.md`。其中工整并列会扫描台词，必须读语境判断，不能因为 hook 对台词低误报豁免就跳过。
- 处理方式：删重复铺垫、直接写实质内容；需要改写时沿用原文已有选择、台词、物件或后果，不另配身体反应。
- 若用户只要检测，保留报告不改文。若执行去 AI 味，只改确实损害读感且无叙事功能的问题；功能性写法标 `[需复核]` 并保留。

---

### Phase 2：诊断与分级

用户明确指定 Gate 时，直接使用该范围；未指定时按下表定档、选处理策略：

| AI味程度 | 特征 | 处理策略 |
|----------|------|----------|
| 轻度 | 少量禁用词，偶有书面腔 | 只过 Gate A + B |
| 中度 | 多处禁用词 + 句式套路 + 心理描写抽象 | 过 Gate A + B + C + D + G |
| 重度 | 全文AI味明显，节奏/对话/结尾/解释腔都有问题 | 完整 7 Gate + 重点段落重写 |

**定档只看这六项**（阈值是参考值，按题材放宽，如古风的对话标签天然偏多）：

| 指标 | 计算方式 | 轻度 | 中度 | 重度 |
|------|----------|---------|---------|---------|
| 禁用词密度 | 命中次数 / 千字 | ≤5 | 6-15 | >15 |
| 连续排比段数 | 连续相同句式结构的段落数 | ≤2 | 3-4 | ≥5 |
| 空转情绪句 | 无落点的情绪总结句数 / 总段落数 | ≤10% | 10-25% | >25% |
| 对话标签密度 | "说道/问道/笑道" 等 / 对话句数 | ≤30% | 30-50% | >50% |
| 平均段落句数 | 总句数 / 总段落数 | ≤3 | 3-5 | >5 |
| 重复描写密度 | 同一信息/动作/情绪连续多段拆写的处数 / 千字 | ≤1处/千字 | 2-3处/千字 | ≥4处/千字 |

- **怎么定档**：任一项到重度，或四项及以上到中度，按重度；有一项到中度，按中度；六项都在轻度，按轻度。
- **要紧处加一档**：本次处理的这段文字里，开头约 500 字、高潮那场戏、最后约 500 字出现重复描写，「重复描写密度」这一项按高一档算（轻→中，中→重）。短篇按全篇、长篇按本章算开头和结尾。
- **禁用词怎么数**：banned-words.md 的条目作为连续字符串出现一次算一处，同一处只算一次；`.deslop-whitelist` 里的词是命中片段的一部分时不算（免得误报世界观术语）。
- 按指标定档后，可按题材语境往下调至多一档，并在报告里写明理由；不往上调。

**改写顺序**（只排所选 Gate 的先后，不扩大范围）：先去泛化与套话（禁用词、抽象情绪、工整对仗、解释腔），再去书面腔，最后回自然节奏、对话差异与结尾落点；做法与范例见 [references/anti-ai-writing.md](references/anti-ai-writing.md)。

---

### Phase 3：逐项清除

#### Agent 调用：narrative-writer（去AI味执行）

「诊断与分级」完成后，按以下顺序选择执行路径：

1. **已在 narrative-writer 子代理内**：按选定 Gate 范围 inline 执行，不再 spawn（嵌套 spawn 会被静默降级）。
2. **未在子代理内且按顶部顺序找到 `narrative-writer` agent**：按当前运行时调用；Antigravity 用 `invoke_subagent(TypeName: "narrative-writer")`，Claude/OpenCode/Codex 用各自字段。prompt 照 [references/agent-calls.md](references/agent-calls.md) 填，只在交给写手时读。
3. **agent 不存在或 spawn 失败**：主会话 inline 执行。

#### Gate 规则入口

实际执行者逐项清除前读 [references/deslop-gates.md](references/deslop-gates.md) 的删除保护、所选 Gate 细则与「写法抽查」；inline 与 agent 使用同源规则。按上文「改写顺序」排所选 Gate 的先后，不另起一次全篇去味。

### Phase 4：确定性收尾（文件模式）

当输入是正文文件路径，且「逐项清除」已落盘修改后，**先**做句式/段落复扫，**再**做机械标点兜底（破折号要按功能改写，故先于机械替换报出）：

```bash
node scripts/check-ai-patterns.js --check --fail-on=blocking <正文文件...>
node scripts/check-degeneration.js --check <正文文件...>
node scripts/normalize-punctuation.js <正文文件...>
```

作用边界：
- `check-ai-patterns.js` 只报告不改写：severity=blocking 的类别优先改正文并复扫；advisory 先通读判断，确属提纲感、解释腔或模板腔再改，功能性写法标 `[需复核]`。
- 退出 1 表示命中当前 `--fail-on` 范围；退出 2 是命令或文件错误。退化脚本此处默认有任意 finding 即退出 1，须按每条 severity 分流，不能把 advisory 当 blocking。
- `check-degeneration.js` 报告模型退化（逐字复读/打转、末尾截断、占位符、工程词泄漏 `细纲`/`情节点` 等），每条带 `severity: blocking|advisory`。blocking 是退化信号，去AI味改不掉，应回去重新生成那一段再 deslop；advisory（tier2 章节/歧义词）只提示。
- `normalize-punctuation.js` 机械兜底：保留书级白名单获准的停顿，清除其余残留的 `……`、漏网破折号 `——`/`—`、双连字符 `--` 和独立行 `---`；默认不改变引号风格，也不把有功能的 `？` / 少量 `！` 改成句号。
- 知乎盐言短篇可保留 `「」`；只有用户或项目明确要求时，才给标点脚本加 `--quote-mode ascii` 或 `--quote-mode yan`。

---

**视角改写复核（仅本次要求切换视角时）**：交付前回读原文，逐项核对新增的感知/认知句。原文只说明事件发生，不等于人物已经看见或知道；不得自行补观察时点。没有原文依据的“进门时发现”“后来看到”等句子删去，或只呈现原有、当前场景可见的物件状态；不可得的信息暂不叙述。这个检查先于交付，不能用句式脚本通过代替。

### Phase 5：输出润色结果

<!-- author-report -->
```md
## 去AI味结果
- AI味：{轻度/中度/重度} → 改后 {轻度/已基本去除}；主要问题：{1-3 个白话描述}
- 改了 {N} 处：{最多的 2-4 类，如「删掉"眼中闪过一丝"一类套话 6 处；拆开连续排比 3 处」}
- 字数：{N0} → {N1}（{删/增}{百分比}）{；超过本档删减上限时写明已分段处理}

### 改前改后
{逐段展示，每处一句说明为什么改；超过 30 处时只展示前 10 处 + 末 5 处，其余按问题类型计数}

### 需要你看一眼
{标 [需复核] 的地方：原文 + 为什么没动或拿不准；没有就写"无"}

### 润色后全文
{文件模式（默认；章节/正文文件、批量与长篇去AI）：直接改写落盘，写明改了哪个文件，本节只回 ≤200 字代表性片段，不向父会话返回全文。文本模式（仅限交互式贴入、无文件路径的零散片段）：完整输出润色后的文本。}

下一步：{一句话，如「要我接着处理下一章吗？」}
技术备注：{降级或版本提示的原文；没有就删掉这一行}
```

**字数硬约束**：删除比例不得超过「诊断与分级」对应上限（轻度 ≤15%、中度 ≤25%、重度 ≤35%）。超限时分段输出并在报告里标记，不得整段删除正文。

**收敛终止**：
1. 同一段连续两轮去 AI 后没有新改动 → 停止该段处理
2. 全文上限 3 轮重扫；第 3 轮仍有 ≥10 处改动 → 在报告里标 `[需复核]`，移交人工
3. 每轮结束按已选 Gate 复核；有未解决问题则在上述轮次上限内继续，没有则停

---

## 使用场景

| 场景 | 操作 |
|------|------|
| 用户贴一段文字说"太AI了" | 执行完整检测 + 润色流程 |
| 用户说"帮我润色" | 先检测AI味，再润色 |
| 用户说"检查下有没有AI味" | 只做检测，不做修改 |
| 用户写作中要求 `仅标注 / 只检测 / 不要改` | 嵌入式提醒模式：执行「AI味扫描」和「诊断与分级」，跳过「逐项清除」「确定性收尾」「输出润色结果」；输出问题标记表，不修改原文，不写文件 |

---

## 参考资料

按需加载以下文件：

| 文件 | 何时加载 |
|------|----------|
| [references/banned-words.md](references/banned-words.md) | 检测和替换禁用词时 |
| [references/deslop-gates.md](references/deslop-gates.md) | 逐项清除前：删除保护与所选 Gate 的细则、示例 |
| [references/agent-calls.md](references/agent-calls.md) | 交给 narrative-writer 去味时：prompt 模板 |
| [references/anti-ai-writing.md](references/anti-ai-writing.md) | **去AI味完整指南**：预防+改写顺序+范例 |
| [scripts/normalize-punctuation.js](scripts/normalize-punctuation.js) | 文件模式落盘后做确定性标点收尾；默认保留引号风格 |
| [scripts/check-ai-patterns.js](scripts/check-ai-patterns.js) | 文件模式预检与复扫；各规则对台词豁免不同，破折号与部分工整并列也查引号内；只报告不改写 |
| [scripts/check-degeneration.js](scripts/check-degeneration.js) | 文件模式「确定性收尾」复扫，只报告不改写 |
| [references/author-memory.md](references/author-memory.md) + [scripts/author_memory_commit.py](scripts/author_memory_commit.py) | 读取或更新跨会话作者文风习惯时 |

---

## 流程衔接

**流水线：** 通用
**位置：** 润色（共享收尾）

| 时机 | 跳转到 | 命令 |
|---|---|---|
| 继续写作 | story-long-write / story-short-write | `/story-long-write` 或 `/story-short-write` |
| 发现结构问题 | story-long-analyze / story-short-analyze | `/story-long-analyze` 或 `/story-short-analyze` |
| 准备做封面 | story-cover | `/story-cover` |


---

# SOURCE: skills/story-long-scan/SKILL.md

---
name: story-long-scan
version: 1.0.0
description: "长篇网文扫榜。分析起点、番茄、晋江、七猫等平台排行榜与新书数据，提炼市场趋势与热门题材。触发方式：/story-long-scan、/长篇扫榜、「长篇什么火」「起点排行」「扫七猫新书」。"
metadata: {"openclaw":{"source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# story-long-scan：长篇网文扫榜

你负责从长篇榜单的重复样本中识别题材候选，结合作者条件给出可行性、失败风险与验证动作。

**核心信念：单本排名提供线索，近期多榜单、多作品的重复模式才支持趋势判断。**

---

## 扫榜原则

### 原则 1：扫榜看模式，别只看排名

提取样本中重复的题材、设定、套路、书名词和开篇卖点，判断能否支持趋势候选。

### 原则 2：流量型平台和付费型平台看的东西不同

番茄重点看在读与流量，起点看付费榜表现，晋江看收藏、营养液和积分。完读率、追读、订阅转化等后台指标需作者另行提供，当前采集脚本不产出。

### 原则 3：扫榜的目的是找到你能写的爆款题材

每个方向都结合素材储备、题材边界、计划篇幅和目标平台样本判断可行性，再给选题建议。

---

## 扫榜流程

### Phase 1：确认平台和方向

问用户：**「你想看哪个平台？（起点/番茄/晋江/七猫/刺猬猫/其他）有没有关注的题材方向？」**

关键判断：
- 用户已有方向 → 针对该方向做深度扫榜
- 用户没有方向 → 做全榜概览 + 找趋势
- 用户想跨平台比较 → 做平台对比分析

---

### Phase 2：确定数据来源

按当前环境选择数据来源：

| 优先级 | 模式 | 说明 | 何时用 |
|--------|------|------|--------|
| 1 | **脚本采集** | 直接抓取平台页面/SSR 数据，产出结构化文件 | 优先；起点默认不需要 Chrome |
| 2 | **用户提供** | 用户粘贴榜单截图/文字/链接 | 用户已有数据时 |
| 3 | **内置知识** | 基于知识库趋势数据做分析 | 无法联网、用户无数据时 |

#### 脚本采集模式

命令中的 `scripts/` 相对本 skill 根目录；`{输出目录}` 指本次工作目录里的扫榜目录。

1. 只读所选平台那一份：[起点](references/platform-qidian.md) / [番茄](references/platform-fanqie.md) / [七猫](references/platform-qimao.md) / [晋江](references/platform-jjwxc.md) / [刺猬猫](references/platform-ciweimao.md)。里面有榜单网址、命令、字段、默认组合、故障排查和该平台的分析维度；需要浏览器态的平台先 `/browser-cdp` 启动 Chrome。
2. 每次扫榜新建输出目录 `扫榜/{YYYYMMDD}/`（同日再扫加 `-2`），存本次榜单，不往旧目录追加（聚合会混进旧榜）；文件名 `{平台}{榜单}_{YYYYMMDD}.md`。脚本已做清洗和质量标注。
3. 聚合：`node scripts/aggregate-rank.js {输出目录} --out {输出目录}/扫榜聚合.md`（小平台加 `--sparse 10`）。**主会话先只读聚合**中的题材分布、去重本数、热度与字数中位、标签、书名词、多榜重合和代表作。刺猬猫混合各榜的「榜单值」不可用于热度比较，按平台参考回查单榜。
4. 看聚合的「采集情况」：标了问题（书名没解出来、没采到、只有书单）的榜单按平台参考排查重采；重采不了就在报告里说明结论不含它。同方向不到 15 本（小平台 10 本）标「少」，等同 `[数据稀疏]`。
5. 分析开篇卖点、新人设、新桥段时按需抽样：`node scripts/aggregate-rank.js {输出目录} --sample {题材/标签/书名词} --n 5`，一次一个方向。抽样命中条数含多榜重复，样本本数按同平台书名+作者去重。

#### 其他数据来源

**用户提供：** 已有扫榜结果文件 → 直接聚合；链接 → 用 WebFetch 抓取；粘贴/截图 → 整理成 `# {平台} · {榜单名}` 标题、每本一段 `### #{排名} {书名}` 加一行 `*作者 · 题材 · 连载中 · 120万字 · 3.5万收藏*`（热度写「数字+口径」；有标签再加 `**标签：** a、b`）存进输出目录，再同样聚合。

**内置知识：** 加载 `references/genre-trends.md`，明确标注「以下分析基于历史趋势数据；未完成实时榜单校验前只能作为候选假设。」并列出需要复扫的榜单。

---

### Phase 3：数据分析

以聚合结果为主，按所选平台参考里的「分析维度」看，再提取通用维度：

1. **题材分布**：题材表的本数、占比与热度中位
2. **新题材信号**：新书榜样本与多榜重合；同时采到新书榜和其他榜时，聚合才显示「新书榜」列。上次日期目录有 `扫榜聚合.md` 时，按相同平台、榜单与筛选范围对比
3. **经典题材变化**：老牌题材的走势（上升/稳定/下降），没有上期数据就只写现状
4. **字数**：字数分布与各题材字数中位
5. **书名模式**：书名常见词 + 代表作书名
6. **开头卖点**：标签热词 + 代表作简介
7. **新元素**：对候选方向抽样原始条目，标出新的人物设定、开篇切入点、桥段套路

---

### Phase 4：输出扫榜报告

报告讲本次样本支持的结论和作者能写的方向；无可比上期时，趋势栏写「未比较」，不填涨跌。脚本名、命令和采集状态码不进报告；缺榜时说「XX 榜这次没拿到（原因），结论不含它」。

报告展示给作者，同时写进输出目录的 `选题决策.md`：文件不存在就先按 [references/topic-decision.md](references/topic-decision.md) 的模板写文件头，再把报告作为「扫榜结论」一节写入（已存在同名一节就整节替换）。作者只扫榜不选题，结论也已落盘。

<!-- author-report -->
```md
## 扫榜结论：{平台名称}

### 市场概况
- 扫榜时间：{日期}
- 核心发现：{一句话总结}

### 题材热度排行
| 排名 | 题材 | 榜上数量 | 趋势 | 代表作 |
|------|------|----------|------|--------|
| 1 | {题材} | {N本} | ↑/→/↓ | {书名} |

### 新题材信号
- {新出现或正在上升的题材，附依据}

### 经典题材动态
- {老牌题材的现状，附依据}

### 新元素提取
- 新人物设定：{新模式描述 + 代表作}
- 新开篇切入点：{新切入点描述 + 代表作}
- 新桥段/套路：{新桥段描述 + 代表作}

### 关键数据洞察
- 字数区间：上榜作品集中在 {X}-{Y} 万字
- 书名特征：{命名模式总结}
- 标签热词：{高频标签词}

### 值得关注的方向
1. {方向 + 为什么值得关注 + 可行性评估}
2. {方向 + 为什么值得关注 + 可行性评估}
3. {方向 + 为什么值得关注 + 可行性评估}

### 一句话
{犀利的总结}
```

---

### Phase 5：选题决策

按 [references/topic-decision.md](references/topic-decision.md) 的选题四步、可行性规则与模板补全 `选题决策.md`。

**从文件接上：** 先读 `{outdir}/选题决策.md` 的「扫榜结论」和 `扫榜聚合.md`，不靠对话记忆；两者都没有就回 Phase 2。

**如信息不足，向用户补齐项目条件：**「目标平台、已有素材、擅长题材/写作约束、计划篇幅是什么？」

按 `topic-decision.md` 的选题四步产出 2-3 个推荐选题（能爆的原因 → 市场验证 → 差异化定位 → 可行性+失败风险+验证动作），写入**本次扫榜输出目录** `{outdir}/选题决策.md` 的「推荐选题」一节，保留「扫榜结论」。

**硬规则：**
- 可行性上限：榜单标了 `[数据稀疏]`、聚合表标「少」或同方向样本 <15（小平台<10）时，最高给"中"并写明先验证；内置知识同样最高给"中"。素材、平台等条件不符时仍给"低"。
- 选题须由项目素材支撑，写清可行性与失败风险，并符合目标平台调性。

---

## 平台特性速查

| 平台 | 调性 | 核心指标 | 主力读者 | 适合类型 |
|------|------|----------|----------|----------|
| 起点中文网 | 男频为主，硬核爽文 | 月票/畅销榜名次 | 升级、成长与长线追读受众 | 玄幻、都市、科幻、游戏 |
| 番茄小说 | 下沉市场，免费阅读 | 在读数、阅读榜排名 | 大众读者 | 脑洞、快节奏、强爽感 |
| 晋江文学城 | 女频为主 | 收藏、营养液、积分 | 言情、纯爱与衍生受众 | 言情、纯爱、衍生 |
| 七猫小说 | 下沉市场，免费阅读 | 热度、大热榜排名 | 大众读者 | 快节奏爽文 |
| 刺猬猫 | 二次元、轻小说 | 各榜单值 | ACG 受众 | 同人、二次元、轻小说 |

---

## 流程衔接

**流水线：** 长篇
**位置：** 扫榜（第 1/3 步）

| 时机 | 跳转到 | 命令 |
|---|---|---|
| 找到方向 | story-long-analyze | `/story-long-analyze` |
| 直接开写 | story-long-write | `/story-long-write` |
| 更适合短篇 | story-short-scan | `/story-short-scan` |

## 参考资料

按需加载以下文件：

| 文件 | 何时加载 |
|------|----------|
| [references/topic-decision.md](references/topic-decision.md) | 「选题决策」：选题四步 + 可行性判断 + 选题决策.md 模板 |
| [references/reader-profiling.md](references/reader-profiling.md) | 需要分析目标读者画像时 |
| [references/genre-trends.md](references/genre-trends.md) | 查看题材趋势候选、切入约束和样本校验规则时 |
| [references/publishing-guide.md](references/publishing-guide.md) | 平台适配+推荐机制校验+数据指标+简介设计 |
| 五份平台参考（链接见「脚本采集模式」第 1 步） | 「确定数据来源」：只读所选平台那份——榜单网址、命令、字段、故障排查、平台分析维度 |
| [scripts/aggregate-rank.js](scripts/aggregate-rank.js) | 把输出目录里的原始榜单聚合成短表（`--out` 落盘，`--sample` 抽原始条目，`--json` 机读），主会话先读聚合表 |
| [scripts/cdp-utils.js](scripts/cdp-utils.js) 与各平台采集脚本 | CDP 公共工具与各平台采集脚本（`{平台}-rank-scraper.js`），命令见所选平台参考 |


---

# SOURCE: skills/story-review/SKILL.md

---
name: story-review
version: 1.1.1
description: "多视角对抗式审查。full/lean 模式在已部署 reviewer agents 时并行 spawn；缺失/异常 agents 或 spawn 失败时自动降级 solo，参考文件不可读时使用内置 rubric fallback。触发方式：/story-review、/审查、「审查一下」「帮我审一下」。"
metadata: {"openclaw":{"source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# story-review：多视角对抗式审查

> Spawn 版本提示（不阻断 spawn）：先读取项目根 `.story-deployed` 的 `agents_version`。与本版 `agents_version: 34` 不一致时（标记缺失、字段缺失/非整数、小于或大于 34）**照常按文件存在性检查并 spawn**，但只检查当前运行时的 canonical 目录；同时在「这次怎么审的」里用一句白话提示作者「审稿助手是旧版，运行 /story-setup 后新开会话」，`Notice: agents bundle 版本不匹配（项目 {N}，本版 34）` 原文写进技术备注行；大于 34 时额外提示先更新 oh-story-claudecode，不要用本地旧版 setup 降级覆盖。版本提示本身不触发降级；文件缺失或异常、工具不可用、递归限制或调用失败按 Phase 0 处理，技术备注写 `Fallback: ... -> solo`。

你负责协调审查，找出小说的结构、角色、文字与设定问题，给出有原文依据的修改建议。

**执行铁律：审查是找问题，不是验证正确性。**

**文风裁决**：正文写作、改写或审稿前先读 [references/style-resolution.md](references/style-resolution.md)，加载本书文风并形成 `style_resolution`；无作者记忆也执行。当前请求、本书文风和 active 偏好按维度覆盖通用 references；同一裁决交给后续执行者。

## 作者习惯边界

若作者记忆 state 已存在，审查前用 `scripts/author_memory_commit.py query --workspace {工作区} --book-root {书目录} --kind delivery --kind interaction --kind prose_style [--genre {题材}] [--workflow 审稿]` 获取本次相关 active 条目（`--workspace`、`--kind` 必传；不传 `--book-root` 就拿不到本书级偏好；`--genre` 填本书题材类型）。它们只能帮助解释意图和组织报告，不能降低 rubric 严重度、把事实冲突判为无问题或跳过平台门禁；当前请求仍优先。完整规则见 [references/author-memory.md](references/author-memory.md)。

用户对报告格式或协作方式作出稳定声明时，在本轮审查完成后用 `record` 记录，并按 author-memory.md「回执怎么告诉作者」转告；只记作者明确说的，一次性要求不记录，不从反复修改推断。审查发现、工具告警和助手建议本身绝不自动学习。

---

## Review Mode 选择

- `/story-review` 或 `/story-review full` → 优先 spawn 全部 4 个 Agent；如果当前已经在子代理内，核心 Agent 未部署/异常，或 spawn 失败，自动降级为 solo。
- `/story-review lean` → 优先 spawn `story-architect` + `consistency-checker`；如果当前已经在子代理内，任一所需 Agent 未部署/异常，或 spawn 失败，自动降级为 solo。
- `/story-review solo` → 不 spawn Agent，由当前会话执行基础审查。

---

## Phase 0：预检与降级（必须先执行）

1. **确定请求模式**：解析用户输入中的 `full`、`lean`、`solo`；未指定时目标模式为 `full`。
2. **确认是否允许 spawn**：如果当前已经在子代理/Agent 内执行，不再递归 spawn，直接降级为 `solo`。
3. **识别 ZCode 能力边界**：如果当前运行于 ZCode 且项目使用 `.zcode/`，ZCode 3.3.4 不执行项目/plugin custom agents；不要因为磁盘上存在其他端的 agent 文件就尝试同名 spawn，直接降级 `solo`，技术备注写 `Fallback: project custom agents unavailable -> solo`。
4. **检查核心 Agent 部署状态**（只检查当前运行时的 canonical 目录，不因其他端文件存在而误判）：
   - Claude Code 检查 `.claude/agents/`，OpenCode 检查 `.opencode/agents/`，Codex 检查 `.codex/agents/`，Antigravity 检查 `.agents/agents/`
    - full 必需 agent：`story-architect`、`character-designer`、`narrative-writer`、`consistency-checker`
    - lean 必需 agent：`story-architect`、`consistency-checker`
    - 对每个必需 Agent 文件：
      - **Claude Code agent（`.claude/agents/`）**：读取 frontmatter，确认 `name:` 与 subagent_type 完全一致；frontmatter 缺失、不可解析或 name 不匹配时视为 malformed agent。
      - **OpenCode agent（`.opencode/agents/`）**：文件名即 agent 名（OpenCode 不要求在 frontmatter 中写 `name:`），读取 frontmatter 确认 `mode: subagent` 和 `permissions:` 规则列表存在且可解析即可（2.x 用复数 `permissions:`，旧版单数 `permission:` 视为待重新部署）；frontmatter 缺失或不可解析视为 malformed。
      - **Codex agent（`.codex/agents/`）**：文件名为 `{agent}.toml`，TOML 必须可解析，且包含 `name`、`description`、`developer_instructions`；`name` 必须与目标 agent 完全一致。
      - **Antigravity agent（`.agents/agents/`）**：路径为 `.agents/agents/agent-name/agent.md`（`agent-name` 为目标 agent 名），frontmatter 必须可解析，且 `name` 与目标 agent 一致、`mainAgent: false`、`subagent: true`、`tools` 非空；缺失或不匹配视为 malformed。
   - 如果目标模式所需任一文件缺失或 malformed，**不要尝试 spawn 缺失/异常 Agent**；自动降级为 `solo`，报告开头用一句话告诉作者「审稿助手缺失或损坏，这次由我一个人审；运行 `/story-setup` 后可多视角审」，降级原因 `missing agents -> solo` / `malformed agents -> solo` 与问题文件写进技术备注行的 Fallback、Files 两栏。
5. **确认 Agent 工具可用**：Claude/OpenCode/Codex 需要当前运行时的子 Agent/Task 调用能力，Antigravity 需要 `invoke_subagent`；不可用时直接降级为 `solo`，技术备注写 `Fallback: agent tool unavailable -> solo`。
6. **运行时失败降级**：如果任何 Agent spawn 返回失败、`subagent_type` / `agent` / `agent_type` / `TypeName` 不可用、frontmatter/TOML 运行时解析失败或子 Agent 无法启动，停止继续 spawn，改用 `solo` 重新审查，技术备注写 `Fallback: spawn failed -> solo` 与失败的 agent 名；不要把部分成功的 Agent 结果当成 full/lean 结论。
7. **确定实际模式**：请求模式与实际模式都写进报告末尾的技术备注行。

---

## 审查基准与参考资料规则（必须遵守）

参考文件补充审查标准；不可读时使用下方内置基准包。

### 报告面向作者（必须遵守）

报告写给作者：审了什么、哪里要改、为什么（用读者感受和故事后果说，附原文引用）、要作者拍板的事、下一步。reviewer 名、S1–S4、Gate、检测器类别名、脚本名、PASS/FAIL、文件字段名不进正文；位置写「第 N 章「引文」」或「第 N 章第 M 段」。优先级换成白话（小节标题照模板）：S1、S2 → **必须改**，S3 → **建议改**，S4 → **可以不改**。执行路径只写在报告最后一行，格式固定：

```text
技术备注：Mode {请求}→{实际} · Fallback {none | project custom agents unavailable -> solo | missing agents -> solo | malformed agents -> solo | agent tool unavailable -> solo | spawn failed -> solo | subagent recursion guard -> solo} · Rubric {fanqie | qidian | zhihu | generic} ({file | embedded})[ · Files {缺失或异常的 agent 文件}][ · Notice {版本不匹配原文}]
```

### 参考资料解析顺序

可读取参考文件时，按以下顺序尝试，第一个命中即用：
1. `{项目根}/.claude/skills/{规范路径}`（Claude Code 项目内安装）
2. `{项目根}/.opencode/skills/{规范路径}`（OpenCode 项目内安装）
3. `{项目根}/.codex/skills/{规范路径}`（Codex 项目内安装）
4. `{项目根}/.zcode/skills/{规范路径}`（ZCode 项目内安装）
5. `{项目根}/skills/{规范路径}`（OpenClaw / Reasonix / generic 部署，也是本仓库开发环境）
6. `{项目根}/.agents/skills/{规范路径}`（Antigravity 项目内真实 skill root；Codex / Reasonix 也可能扫描此目录或其 symlink）
7. 当前运行时加载本 skill 的目录，或其可访问的全局 skill 搜索路径中同名 `{skill-name}/...` 目录

> 靠前几层不存在是正常的，不是部署损坏。`/story-setup` 会为 Antigravity 把 13 个 skill 真实复制到 `.agents/skills/`，为 ZCode 复制到 `.zcode/skills/`，并为 OpenClaw / Reasonix / generic 复制到 `skills/`。Codex 项目部署不复制 skill 本体，本 skill 由 Codex 从 skill root 加载，references 通常命中第 6 或第 7 层。不要手工把 `references/` 复制进 `.codex/skills/`——手工副本不受 story-setup 管理，升级后会静默变旧。

规范路径如下；禁止只写裸文件名，禁止跨 skill 误读其他 skill 的 references：

| 用途 | 规范路径 |
|---|---|
| 通用质量清单 | `story-review/references/review-quality.md` |
| 通用内容评分 rubric | `story-review/references/quality-rubric.md` |
| 去 AI 味方法 | `story-review/references/anti-ai-writing.md` |
| 剧情循环/高潮公式 | `story-review/references/plot-core-methods.md` |
| 角色关系/好感度 | `story-review/references/character-relations.md` |
| 对话质量 | `story-review/references/dialogue-mastery.md` |
| 审查禁用词 | `story-review/references/banned-words.md` |
| 平台 rubric | `story-review/references/rubrics/{fanqie,qidian,zhihu}.md` |
| 标点预检脚本 | `story-review/scripts/normalize-punctuation.js` |
| AI句式预检脚本 | `story-review/scripts/check-ai-patterns.js` |
| 作者习惯协议 | `story-review/references/author-memory.md` |
| 作者习惯整理、超编与迁移 | `story-review/references/author-memory-maintenance.md` |
| 作者习惯事务脚本 | `story-review/scripts/author_memory_commit.py` |

### 内置审查基准包（路径不可读时必用）

如果上述参考文件在当前项目中不可读，**不要把审查降级为无 rubric，也不要在报告里说“无法加载具体 rubric”后停止使用标准**。必须使用本节内置基准包，技术备注行的 Rubric 来源写 `embedded`。

通用网文内容 rubric：
- 核心卖点：本章是否围绕明确卖点推进；看不出卖点至少 S2。
- 冲突推进：本章是否有阻碍、选择、代价或关系变化；只解释/闲聊/总结至少 S2。
- 任务卡点：角色办事被卡住时，是否卡出信息、关系、代价、选择或伏笔变化；卡点只剩流程细节、删掉不影响故事至少 S3。
- 情绪曲线：是否有铺垫、升温、释放或反转；情绪平直或突兀至少 S2/S3。
- 钩子与期待：开头或结尾是否制造后续问题；没有悬念或未完成期待至少 S2。
- 开头新鲜度（仅开篇/前 3 章）：开局有具体人物/处境切口，还是同题材默认套路（能整体换到任意同类书）？"有钩子/非天气开场"不豁免同质化；套路化开局即使有钩子也至少 S3，整体撞同题材模板 S2。
- 角色动机：行为是否符合目标、性格、处境和关系压力；为剧情服务而失真是 S1/S2。
- 对话质量：是否有潜台词、信息控制、角色差异；说明书式对话至少 S2。
- 设定一致性：不违背已写规则、时间线、角色属性；明确事实冲突通常 S1。
- 文字自然度：具体、可感、动作承载信息；AI 腔、陈词滥调、总结体按影响定 S2/S3。
- 句长节奏：叙述默认是逗号长句（一句用逗号串起 2-4 件事再落句号）；碎句和电报体（逗号之间连着都是 ≤5 字、通篇超短句像提纲）与 AI 腔同级，按影响定 S3/S2，不因「短=网文节奏」放行。
- 标点节奏：标点是否服务语气/人物声线；通篇句号化、随机堆砌问号/感叹号，或残留 `……`/`——` 硬造停顿，按影响定 S3/S2。
- 具体字数表达校验：正文用“这五个字 / 短短四字 / 三个字一落 / 八个字砸下去”等具体字数表达评价台词、题字、信件、念头或弹幕时，必须能确认统计口径、机器核对结果和叙事必要；不能确保字数计算正确时，按文字自然度问题处理，建议改成“这句话一落”“那几个字”“话音落下”等非具体数字表达。
- 格式可读性：段落短、对话独立、无多余空行；格式阻碍阅读按 S3，严重混乱按 S2。
- 剧情循环：目标 → 阻碍 → 行动 → 代价/反馈 → 新期待；缺少目标/阻碍/反馈通常至少 S2。
- 高潮构建：检查蓄能、情绪落差与兑现；强反转可用蓄能 → 假胜 → 崩解 → 反转/兑现，缺铺垫或兑现通常 S2/S3。
- 关系进展：互动尺度必须匹配当前关系阶段；越界亲密、突然信任、突然敌对都需要铺垫，否则按影响定 S1/S2。
- 伏笔状态：伏笔状态需可追踪；伏笔密度只作为结构风险提示，除非直接造成理解混乱，否则不升级到 S2+。

AI 味 / 禁用词 fallback 速查：
- 高频套话：`命运的齿轮开始转动`、`心猛地一沉`、`眼神复杂`、`深刻变化`、`踏上新的旅程`。
- 章末总结体：`这一切都说明...`、`他终于明白...`、`新的篇章开始了...`。
- 信息倾倒：角色直接说“我要解释世界观/规则/关系变化”。
- 论文体/万能结论：过度使用“然而、与此同时、不可否认、这意味着”。
- 处理原则：有原文证据才输出 finding；给出可执行替换方向，不只评价“AI 味重”。修法方向不默认「拆短 / 删虚词 / 剥标点」：把正常的逗号长句拆成碎句，与 AI 腔同样是问题。

平台 fallback 摘要：
- 番茄：强开局、强冲突、高频爽点/情绪反馈、低理解门槛。
- 起点：设定自洽、升级路径、长线期待、世界观承载力。
- 知乎盐言：短篇钩子、反转密度、情绪兑现、信息差推进。

---

## Phase 1：收集待审查内容

1. **确定审查范围**：
   - 用户指定了章节/文件 → 只审查指定内容。
   - 用户未指定 → 优先审查最近修改的正文文件（`git diff --name-only` 中的正文/设定/大纲相关文件），否则审查当前书的当前章节。
2. **范围传递策略**：
   - 优先把文件路径、章节名、行号范围传给 reviewer，不要把整本或大量章节完整复制进每个 prompt。
   - 单文件或短片段可附 300-1200 字关键摘录。
   - 多章/整卷/整本审查必须分批：按章节或文件组拆分，每批输出独立 findings，再综合；分批前先完整读 [references/batch-review.md](references/batch-review.md)（跨批状态、连续性、乱序提醒）。
3. **读取相关支撑材料**：正文、相关设定、角色档案、大纲、追踪/上下文、伏笔文件；缺失时在报告中标记证据不足。
4. **识别目标平台并加载 rubric**：
   - 优先使用用户显式指定的平台。
   - 其次读取项目文档里的 `目标平台` / `平台` 字段，例如 `设定/题材定位.md`、`大纲/`、`拆文报告` 等。
   - 不要把 `.active-book` 当作平台来源；它只能辅助定位当前书名目录。
   - 番茄小说 → 优先读取 `story-review/references/rubrics/fanqie.md`；不可读时使用内置番茄 fallback 摘要。
   - 起点 → 优先读取 `story-review/references/rubrics/qidian.md`；不可读时使用内置起点 fallback 摘要。
   - 知乎盐言 → 优先读取 `story-review/references/rubrics/zhihu.md`；不可读时使用内置知乎 fallback 摘要。
   - 未识别平台 → 优先读取 `story-review/references/quality-rubric.md`；不可读时使用内置通用网文内容 rubric；技术备注行写 `generic` 与 `file | embedded`。
5. **形成审查基准包摘要**：把已加载的文件内容或内置 fallback 摘要压缩为 5-12 条审查标准，后续 solo 和子 Agent 都必须使用这份摘要。摘要必须保留一条句长标准：叙述默认是逗号长句，碎句和电报体与 AI 腔同级处理，不因「短」放行。
6. **确定性预检（只报告，不修改）**：当审查范围包含本地正文文件路径时，运行本 skill 自带脚本：
   ```bash
   node scripts/normalize-punctuation.js --check <正文文件...>
   node scripts/check-ai-patterns.js --check --fail-on=blocking <正文文件...>
   node scripts/check-degeneration.js --check <正文文件...>
   ```
   - 将 `ellipsis`、`double-hyphen`、`markdown-divider` 结果作为 `format` findings 合并进报告。`em-dash` 破折号只采用 `check-ai-patterns.js` 的语义改写建议（见下条）；`normalize-punctuation.js` 报的同一位置 `em-dash` 在合并时去重丢弃，避免同处出现「机械替换」与「按功能改写」两条相互冲突的 finding。另外人工检查标点节奏是否通篇句号化或随机堆砌，脚本不替代语气判断。
   - `check-ai-patterns.js` 的 findings 合并进 `prose`：severity=blocking 的类别一律按 S2（当前为 `not-is-comparison` / `em-dash` / `voice-contrast` / `negation-parade` / `reverse-not-is` / `trailer-ending` / `trailer-summary`），修法直接采用检测器输出的建议（删否定铺垫/反差腔/排比否定/章尾预告腔/章尾状态总结句，直接写后项或具体动作；破折号按功能改成动作/短句/逗号/冒号）。
   - 其余 prose findings（advisory）统一按 S3：只指出读感风险，不替代人工判断；功能性写法标 `[需复核]` 并保留。完整类别和修法见 `anti-ai-writing.md`。
   - `check-degeneration.js` 报告模型退化（逐字复读/截断/占位符/工程词泄漏），每条带 `severity: blocking|advisory`：blocking（复读/截断/tier1 工程词）作为 S1/S2 `prose` findings，修复建议是「重新生成该段，不是改写」；advisory（tier2 章节/歧义词）作为 S3。
   - 这三个预检脚本只读；`story-review` **不修改正文、设定或大纲文件**，需要自动修复正文时建议转 `/story-deslop`。full / lean 模式只有下方「追踪文件维护」允许修改 `追踪/`；分批审查的所有模式都可按 batch-review.md 写 **.story-review/state.md**，solo 除该状态外不写项目内容。
   - 默认 `--quote-mode keep`，不把知乎盐言短篇的 `「」` 当作问题；只有项目明确指定引号风格时才检查对应转换建议。

---

## 统一 Findings Schema（所有模式必须使用）

所有 reviewer（包括 solo）先按统一结构整理问题，再按 Phase 4 或 solo 模板转写给作者；内部字段用于合并、排序，不原样贴进作者报告。`location` 必须使用工具读取结果显示的原始文件行号；不要删除空行后重新编号。

对 `consistency` / `factual` / `causal` / `rule_boundary` 类 finding，`fix` 字段只写事实统一方向（例如“统一为左臂旧伤，并同步正文/设定中冲突处”或“需在 A/B 时间线中裁定一个来源”），不要写文学创作建议。

```yaml
- severity: S1 | S2 | S3 | S4
  category: structure | character | prose | consistency | platform | factual | format | causal | rule_boundary
  location: 文件路径:行号 或 章节/段落描述
  evidence: "引用原文或具体证据"
  issue: "问题描述"
  fix: "可执行修改建议"
```

严重度定义（与长篇写作、检测器同一刻度：S1/S2＝必须修，S3＝建议看，S4＝仅提示）：
- **S1**：会破坏主线、角色动机、世界规则或读者信任，需优先修。
- **S2**：明显影响章节效果、留存、节奏、人物可信度，本轮要修。
- **S3**：局部质量问题，如措辞、轻微格式、局部节奏，可排期修。
- **S4**：建议项或风格微调，不阻塞发布。

---

## Phase 2：并行 Spawn Agent（full/lean 模式）

执行 Phase 0 后实际模式仍是 full/lean 时，读 [references/agent-prompts.md](references/agent-prompts.md) 按其中的调用规则与四个 prompt 并行 spawn，综合裁决与报告模板也在其中；不 spawn 缺失的 Agent。每个 Agent 不继承父对话上下文，prompt 自包含路径、范围与统一 Findings Schema。

## Phase 3：综合裁决（full / lean 模式）

收齐 reviewer 结果后按 agent-prompts.md「综合裁决」合并、去重、呈现分歧。

## Phase 4：输出报告（full / lean 模式）

实际模式确为 full/lean 时用 agent-prompts.md 的报告模板；降级 solo 时改用 solo.md 模板。

---

## solo 模式

降级或指定 solo 时读 [references/solo.md](references/solo.md)，按其中流程与输出格式执行。

## 追踪文件维护

长篇工程且 full/lean 审查收尾时读 [references/review-tracking.md](references/review-tracking.md)。

## 流程衔接

**流水线：** 通用
**位置：** 审查（写作之后）

| 时机 | 跳转到 | 命令 |
|---|---|---|
| 要修改查出的问题 | story-long-write / story-short-write | 返回对应写作 skill 修改 |
| 发现 AI 味需清理 | story-deslop | `/story-deslop` |
| 需要重新拆解对标书 | story-long-analyze / story-short-analyze | `/story-long-analyze` 或 `/story-short-analyze` |


---

# SOURCE: skills/story-setup/SKILL.md

---
name: story-setup
version: 1.3.2
description: "网文写作工具集基础设施部署与检查。为 Claude Code / OpenCode / Codex / Google Antigravity / ZCode / OpenClaw / Reasonix 提供内置适配；Web AI / 通用 Agent 可走 skills + AGENTS.md 文件模式。触发方式：/story-setup、$story-setup、「准备写书」「帮我搭一下环境」「配置写作项目」「检查写作环境」。"
metadata: {"openclaw":{"source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# story-setup：网文写作工具集基础设施部署

你负责把网文写作工具集部署到用户项目目录：已适配的 CLI 使用专用 hooks/agents/config；NarraFork、Web AI、自定义 Agent 等使用通用文件模式。

**保留用户配置；受管文件按清单更新，共同维护的文件按管理块合并。**

作者第一次部署的顺序：判断当前宿主 → 确认项目根 → 按宿主部署 → 验收 → 告诉作者下一步。本文件写公共流程；各宿主的部署清单、算法、校验和报告提示见 Phase 2 对应文件，**只读本次目标宿主的那一份**。

## 选择模式

- 参数为 `check`，或用户只要求检查部署、诊断环境、排查 agent 不可用时：完整读取 [references/diagnostics.md](references/diagnostics.md)，按其中流程仅检查并报告；不进入下面的部署流程。
- 用户要求安装、更新或修复时：执行下面的部署流程。检查后已明确授权的修复沿用本文件与宿主部署文件的部署与合并规则。

---

## Phase 1：判断宿主与项目

**先自检参考目录**：以正在执行的本 `SKILL.md` 所在目录为准，列出与它同级的 `references/` 下的子目录，核对下面 9 个名字是否都在**且都非空**——`agent-references`、`templates`、`opencode`、`codex`、`antigravity`、`zcode`、`openclaw`、`reasonix`、`generic`；同级 `references/deploy-*.md`（8 份宿主部署文件）、`scripts/merge-claude-settings.py`、`scripts/merge-codex-hooks.py`、`scripts/merge-antigravity-hooks.py`、`scripts/generate-antigravity-agents.mjs`、`scripts/deploy-antigravity-skills.py` 与 `scripts/copy-path-safety.py` 也必须存在（宿主部署步骤、Claude/Codex/Antigravity hooks 合并、Antigravity Skills 物化与 agent 生成、递归复制安全检查依赖它们）。有缺即 skill 包没装全，**立即停止，不写任何部署文件**，报告里区分「缺目录」「目录为空」和「缺脚本或部署文件」，并给修复指令：「story-setup 参考资料包不完整，缺 {路径}。按你的安装方式重装 oh-story-claudecode（命令行装的重跑 `npx skills add zenstory-ai/oh-story-claudecode -y -g`，marketplace / Plugin Management 装的在面板里重装），再执行 /story-setup。」

> 判据是「有没有 `SKILL.md`」：只看正在执行的 `SKILL.md` 同级的 `references/`。项目内 `.claude/skills/story-setup/`、`.codex/skills/story-setup/` 和 OpenCode 的 `skills/story-setup/` 只有 `references/agent-references/`、不含 `SKILL.md`，不会是执行目录，也不要拿它们核对。Antigravity / ZCode / OpenClaw / Reasonix / generic 的项目副本是整份 skill 拷贝、自带 `SKILL.md`，9 个子目录本就齐全，照常核对即可。

1. 检查当前目录是否已部署过（存在 `.story-deployed`）
   - `agents_version` 缺失、非整数或小于 `34` → 标记为待更新，继续执行当前部署
   - `agents_version: 34` → 使用 AskUserQuestion 确认是否重新部署；提示里写明重新部署只用**当前本地 skill 包**刷新项目文件，要拿 skill 本身的新版本得先更新 oh-story-claudecode（`npx skills add` 或 marketplace），再回来重跑
   - `agents_version` 大于 `34` → 当前 story-setup 比项目部署旧；停止以避免降级覆盖，提示先更新 oh-story-claudecode，不写任何部署文件
   - 同时读 `target_cli` 字段。**已部署项目以 sentinel 里的值为准**：非空时（逗号分隔的多端组合原样保留）这些端照常重新部署，不再让作者选；第 4 步仍判断当前宿主：判断出来且不在其中（作者换了软件）→ AskUserQuestion 问「这个文件夹之前是给 {已部署宿主名} 装的，你现在用的是 {当前宿主名}，要一起装上吗？」（「一起装上（推荐）」「只更新原来的」），选前者就加进 `target_cli`；判断不出不问。字段缺失或为空才走第 4-6 步。用户明确要求增删目标端时，用 AskUserQuestion 在现有值基础上改，改完的值写回 sentinel。
   - `target_cli` 不含 opencode、但项目里有 `.opencode/plugins/story-hooks.ts` 或 `.opencode/agents/`（多端部署时 OpenCode 曾被版本门拦下）→ 用 AskUserQuestion 问是否把 OpenCode 加回来；选加回则先过 [references/deploy-opencode.md](references/deploy-opencode.md) 的「部署前置」，通过后写回 `target_cli`
2. 检查是否有书名目录（包含 `追踪/` 子目录的目录，或用户自定义结构）
   - 有 → 识别为长篇项目，显示当前项目信息
   - 无 → 识别为新项目或短篇项目
3. 检查 `.active-book` 文件是否存在：存在 → 显示当前活跃书目；不存在 → 跳过
4. **判断当前宿主（能判断就不问作者）**。依次看，第一条能定下来的就用：
   - 你自身的运行环境：系统提示、可用工具名或 skill 调用语法已表明你运行在 Claude Code、Codex、OpenCode、Google Antigravity（含命令行 `agy`）、ZCode、OpenClaw 或 Reasonix 里；
   - 正在执行的本 `SKILL.md` 的安装位置带有宿主专属目录（如 `.claude/`、`.codex/`、`.zcode/`、`.gemini/`、`.openclaw/`、`.opencode/`）；
   - 判断不出（例如网页版 AI、自建 Agent，或以上信号互相矛盾）→ 第 5 步的项目标记只当候选，交第 6 步问作者。
5. 看项目里已有哪些宿主的标记：
   - `.claude/` 或 `CLAUDE.md` → `target_cli = claude-code`
   - `opencode.json`、`opencode.jsonc` 或 `.opencode/` → `target_cli = opencode`
   - `.codex/`、`.codex/config.toml`、`.codex/agents/`、`.codex/hooks.json`、`AGENTS.md` 中的 Codex 段 → `target_cli = codex`
   - `.agents/hooks.json`、`.agents/agents/`，或 `.agents/rules/oh-story.md` 中的 Antigravity 标记 → `target_cli = antigravity`
   - `.zcode/`、`.zcode/config.json`、`zcode.json`、`.zcode/skills/`、`.zcode/commands/`、`AGENTS.md` 中的 ZCode 段 → `target_cli = zcode`
   - `openclaw.json`、`.openclaw/`，或 `AGENTS.md` 中的 OpenClaw 段（标题行含 `网文写作工具集（OpenClaw）`）→ `target_cli = openclaw`
   - `.reasonix/`、`reasonix-plugin.json`、`REASONIX.md`，或 `AGENTS.md` 中的 Reasonix 段（标题行含 `网文写作工具集（Reasonix）`）→ `target_cli = reasonix`
   - `AGENTS.md` 中的通用段（标题行含 `网文写作工具集（通用 Agent / Web AI）`）→ `target_cli = generic`

   > 后三类只认各端**互斥**的标记：`skills/*/SKILL.md` 的 `metadata.openclaw` 不作 OpenClaw 信号（13 个 skill 都带，三条 skills-only 路径部署出的 `skills/` 一样）；`.agents/skills/` 由 Antigravity、Codex 与 Reasonix 共用，也不单独作准。
6. 定下 `target_cli`：
   - 第 4 步定出了当前宿主 → `target_cli` 就是它。项目里另有其他宿主的标记时，用 AskUserQuestion 问一句白话：「这个文件夹之前也给 {其他宿主名} 装过写作工具，这次要一起更新吗？」选项：「只装 {当前宿主名}（推荐）」「一起更新」。作者一开始就说要装多个时照办。
   - 定不出、项目标记恰好只有一个宿主 → AskUserQuestion 问「上次是给 {宿主名} 装的，这次还是它吗？」，是就用它，不是按下一条问。
   - 定不出、其余情况 → 用 AskUserQuestion 问：「你现在是在哪个软件里跟我对话？」选项用产品名加一句说明：Claude Code（Anthropic 的命令行 / 桌面版）、Codex（OpenAI 的命令行）、OpenCode、Google Antigravity（含命令行 agy）、ZCode、OpenClaw、Reasonix（DeepSeek 的命令行）、网页版 AI 或其他工具（NarraFork、自建 Agent 等）、好几个都要用。提问工具一次放不下这么多选项时，把项目标记里出现过的放前面，其余让作者在「其他」里直接写名字。
   - 作者的答案按「Claude Code → `claude-code`、网页版 AI 或其他工具 → `generic`、其余取小写产品名」换成 `target_cli`；多端为 `claude-code,opencode,codex,antigravity,zcode,openclaw,reasonix,generic` 中选中的端。
7. **确认项目根（通常不问）**：项目根就是当前工作目录。只有当前目录是用户主目录、磁盘根目录、系统目录，或就是本 skill 包自身的安装/源码目录时，才用一句白话问作者：「写作工具要装在哪个文件夹？一般就是放书稿的那个文件夹。」其他情况直接部署，在安装报告的「部署明细」里写明装在哪。

## Phase 2：部署基础设施

Phase 2 幂等：复制、写入与各宿主合并重复执行结果一致。工具、权限或网络问题中断后，从头重跑即可，不另清理半成品；`create only if absent` 的用户状态文件（见清单 Owner class）不会被覆盖。

**两列基准目录不同**：`Source path` 是包内来源，story-setup 内的路径以当前 `SKILL.md` 所在目录定位；`Target path` 相对用户项目根。执行每一行（以及各宿主部署算法里的每个递归复制步骤）之前，先把通配符具体化为单个源/目标，再用本 `SKILL.md` 同级的 `scripts/copy-path-safety.py` 检查。该脚本按 `Path.resolve` / `realpath` 语义跟随已有 symlink，并在两侧都存在时用 `samefile` 核对文件系统对象；**只转绝对路径或比较字符串不算检查完成**。读取其 JSON：`status: same` 时 no-op，禁止复制；仅 `copy_allowed: true` 时可以复制；`source_missing`、`unsafe_target_within_source` 或 `filesystem_identity_error` 必须停止该步骤并报告。无法运行脚本时只能用当前环境的文件系统 API 做完全相同的 canonical realpath、same-object 与 target-descendant 检查；无法确认就停止，不得尝试复制。OpenClaw / Reasonix / generic 的项目副本是整份 skill 拷贝，重跑时执行的就是项目里那份；Reasonix / Codex 还可能经 `.agents/skills → ../skills` symlink 加载，路径文本不同也可能指向同一目录，照字面复制会把目录嵌进自身并撑满磁盘。

**部署前清理自嵌套残留**：`{.claude,.codex,.zcode}/skills/story-setup/references/agent-references/` 与项目根 `skills/story-setup/references/agent-references/` 里若多出 `agent-references/` 层（可能嵌了多层），以及 `skills/story-setup/skills/`，整段删掉再部署，并在安装报告里列出删掉的路径。

### Step 1：按宿主部署

对 `target_cli` 里的每个宿主，**完整读取**对应部署文件，按其中的部署清单（机械可检查）与算法依次执行；不读其他宿主的文件。

| `target_cli` | 部署文件 |
|---|---|
| `claude-code` | [references/deploy-claude-code.md](references/deploy-claude-code.md) |
| `opencode` | [references/deploy-opencode.md](references/deploy-opencode.md)（先过其中「部署前置」版本门） |
| `codex` | [references/deploy-codex.md](references/deploy-codex.md) |
| `antigravity` | [references/deploy-antigravity.md](references/deploy-antigravity.md) |
| `zcode` | [references/deploy-zcode.md](references/deploy-zcode.md) |
| `openclaw` | [references/deploy-openclaw.md](references/deploy-openclaw.md) |
| `reasonix` | [references/deploy-reasonix.md](references/deploy-reasonix.md) |
| `generic` | [references/deploy-generic.md](references/deploy-generic.md) |

多端部署时几个宿主共用根 `AGENTS.md`，按下方「AGENTS.md 合并策略」合并成一份；某一端被自己的前置条件拦下（如 OpenCode 版本门、Antigravity 缺 Node）时，按该端部署文件的规定处理，其他端照常部署。

### Step 2：创建部署标记

- 仅为本次成功部署的目标创建或更新 `.story-deployed`（sentinel file）；全部目标停止时保留旧标记，不创建新标记。
- 写入以下字段（YAML `key: value` 格式，hook 用 `references/templates/hooks/lib/sentinel.sh` 读取）：
  ```
  deployed_at: <date -u +"%Y-%m-%dT%H:%M:%SZ">
  agents_version: 34
  setup_skill_version: 1.3.2
  target_cli: claude-code（或 opencode、codex、antigravity、zcode、openclaw、reasonix、generic，或其任意组合）
  resolver_strategy: project-local-skill-reference
  references_dir: .claude/skills/story-setup/references/agent-references（Codex 写 .codex/skills/...；Antigravity 写 .agents/skills/...；ZCode 写 .zcode/skills/...；OpenCode / OpenClaw / Reasonix / generic 写 skills/...；多端用逗号分隔）
  ```
- 此文件供 session-start.sh 和写作 skill 检测部署状态，避免重复提示
- 宿主部署文件里「部署标记补充」要求的额外标记一并创建（如 Claude Code 的重启确认标记）
- 如果 `.story-deployed` 已存在但 `agents_version` 缺失、非整数或小于 `34`，按本次流程更新 hooks/agents/rules/reference bundle（具体变更见 `UPGRADING.md`）；大于 `34` 时已在 Phase 1 停止，不得降级覆盖

## Phase 3：验证安装

仅检查模式复用第 1–2 项，跳过第 3 项，且其中要求实际执行 hook 或写入 fixture 的子项改为只做静态校验（文件存在、语法有效、注册项齐全），不运行会写入项目的 hook，也不创建部署标记。

1. 对 `target_cli` 里的每个宿主，执行其部署文件的「验证」一节。
2. 验证部署标记：
   - 检查 `.story-deployed` 是否存在且包含时间戳、`agents_version: 34`、`setup_skill_version: 1.3.2`、`target_cli`、`resolver_strategy`、`references_dir`
3. 输出安装报告。读者是不懂编程的作者，按这个顺序写：
   - **先写「现在可以做什么」**：用写书的话列本次部署后真正可用的事（如「可以开新书、续写：说 /story-long-write」「可以拆一本对标书」），端的限制如实翻译（如「这个工具里审稿由我一个人完成，没有分工助手」）。
   - **再写「你还需要做的事」**：逐条可照做，如「新开一个会话」「在 Codex 里打开 /hooks，把 oh-story 的几条信任一下」「先安装 Node」；没有就写「无需其他操作」。这两段不出现脚本名、字段名、状态名或文件路径；各宿主部署文件「安装报告必须提示」的内容先翻译进这两段。
   - **最后是简短的「部署明细」**：装在哪个文件夹、已部署文件、已合并的配置、删掉的残留路径、宿主部署文件要求的摘要（如 OpenCode 模型配置）和技术原因，放在报告末尾。

---

## 模板占位符

| 占位符 | 替换规则 | 示例 |
|--------|----------|------|
| `{项目名}` | 用户项目名称或目录名 | 《剑来》、《暗卫》 |
| `{书名}` | 书名目录名（与目录一致） | 与 `{项目名}` 相同，或用户自定义 |
| `{目标平台}` | 目标发布平台 | 起点、番茄、晋江、知乎盐言 |
| `{作者名}` | 用户笔名或昵称 | 未指定时用「作者」 |

替换时去掉花括号。未指定项目名用当前目录名；其余先按表中默认值处理，没有默认值的占位符保留原样。CLAUDE.md 的合并策略在 Claude Code 部署文件里。

## AGENTS.md 合并策略（OpenCode / Codex / ZCode / OpenClaw / Reasonix / generic）

用户已有 AGENTS.md 时，按 marker/section 合并：
1. 优先识别 story-setup 管理块标记（如果旧项目已有标记，只替换标记内内容）
2. 无标记时，读取用户现有 AGENTS.md，按 `##` 标题切分为 section map
3. OpenCode 使用 `skills/story-setup/references/opencode/AGENTS.md.tmpl`；Codex 使用 `skills/story-setup/references/codex/AGENTS.md.tmpl`；ZCode 使用 `skills/story-setup/references/zcode/AGENTS.md.tmpl`；OpenClaw 使用 `skills/story-setup/references/openclaw/AGENTS.md.tmpl`；Reasonix 使用 `skills/story-setup/references/reasonix/AGENTS.md.tmpl`；通用 Web AI / 其他 Agent 使用 `skills/story-setup/references/generic/AGENTS.md.tmpl`
4. 模板中的标准 section（Skill 路由表、文件结构、协作规则、与作者协作、Compact 后恢复上下文；模板有而用户文件没有的 section 直接补入）覆盖同名 section；用户独有 section 保留
5. 多端同时部署时，Codex/OpenCode/ZCode/OpenClaw/Reasonix/generic 共同可用的通用段落只保留一份；工具特有说明以小节区分，避免互相覆盖

## 重新部署

- `.story-deployed` 不存在 → 全新安装，Phase 2 全部执行
- `.story-deployed` 存在且 `agents_version: 34` → 提示已部署，AskUserQuestion 确认是否重新部署；提示里写明重新部署只用当前本地 skill 包刷新项目文件，skill 本身的更新走 `npx skills add` 或 marketplace
- `.story-deployed` 存在但 `agents_version` 缺失、非整数或小于 `34` → 提示需要更新，重新执行 Phase 2 覆盖 agents/hooks/rules/reference bundle，CLAUDE.md / AGENTS.md / settings.local.json / .codex/hooks.json / `.agents/hooks.json` / .zcode/config.json 走合并策略
- `.story-deployed` 存在且 `agents_version` 大于 `34` → 当前 skill 版本过旧，停止并提示先更新 oh-story-claudecode；不覆盖项目中的更新部署

---

## 参考资料

| 文件 | 用途 |
|------|------|
| references/deploy-*.md | 8 份宿主部署文件：各自的部署清单、算法、验证与安装报告提示，按 Phase 2 Step 1 只读目标宿主那份 |
| [references/diagnostics.md](references/diagnostics.md) | 仅检查模式 |
| UPGRADING.md | 各版本升级要点 |

---

## 流程衔接

**流水线：** 部署
**位置：** 初始化（最前置）

| 时机 | 跳转到 | 命令 |
|---|---|---|
| 部署完成，开始写作 | story-long-write / story-short-write | `/story-long-write` 或 `/story-short-write` |
| 导入已有小说做拆解 | story-import | `/story-import` |
| 需要浏览器登录态（扫榜/拆文取原文） | browser-cdp | `/browser-cdp`；generic 需平台允许本地脚本/浏览器控制 |

各端调用语法：Claude `/名`、Codex/ZCode `$名`、Antigravity 通过 `/skills` 浏览或直接点名、OpenClaw `/skill 名`、Reasonix / generic 直接点名 skill。


---

# SOURCE: skills/story-short-analyze/SKILL.md

---
name: story-short-analyze
version: 3.1.0
description: "短篇网文拆文。拆解爆款短篇小说（番茄短篇 / 故事会 / 知乎盐选 / 追妻 / 世情 / 重生 / 虐渣等通俗题材）的故事核、结构、情感线、反转设计、写作手法、共鸣层次。单一全量拆解管道：跑完 Stage 2-6 产出完整拆文报告，落盘到 拆文库/{书名}/，下游 story-short-write 同时读拆文报告 + 情节节点 + 写作手法 + 原文 + _meta.json 写下一篇。触发方式：/story-short-analyze、/短篇拆文、「拆短篇」「拆这篇短文」「短篇拆文」「精细拆解短篇」「8000 字短篇拆解」「番茄短篇拆文」「故事会拆解」「盐言故事拆解」「分析这篇短篇」——均进入同一管道。"
metadata: {"openclaw":{"source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# story-short-analyze：短篇网文拆文

你是短篇小说结构分析师。

**围绕故事核，分析源文如何铺垫、释放情绪并引发共鸣。分析写进 `拆文报告.md`，结构计数写进 `_meta.json`，供下一篇短篇参考。**

---

## 拆解边界声明（主会话同样适用）

短篇拆解的 Stage 2-6 全程由你（主会话）亲手做：拆的是用户**合法持有、拥有使用权**的虚构作品（已出版/连载或自有），性质是**只读的转化性文学批评**（编辑/评论/写作教学视角，不复制、不传播、不指导现实行为）。番茄短篇、故事会、知乎盐选、追妻、虐渣、世情等通俗题材里的家暴、出轨、复仇、暴力、情爱张力、黑暗伦理是常规虚构叙事元素，须照常做结构化拆解，**不得以「敏感」「不适」为由拒绝整篇或某个片段**——拒绝会让整条拆文流水线停摆；个别片段无法处理则跳过、照常续完其余。

---

## Phase 1：确认拆解对象 + 字数路由 + 续跑检查

### Step 1：拿到原文

对象尚未明确时问用户：**「你要拆哪篇？（标题+平台/来源）」**；已有明确原文时直接继续。

**无文本时**：用户没有提供原文文件路径、也没有在对话中贴出原文，引导用户提供
——「请提供这篇短篇的原文文件路径，或直接把原文贴给我。」

### Step 2：字数检查（长短篇路由）

拿到原文后立刻数字数：

```
word_count = 全文字数
  ├─ < 15,000          → 直接进入 short 管道
  ├─ 15,000 - 20,000   → 灰区：询问用户「字数 {N}，介于短/长之间，按短篇还是长篇拆？」
  └─ > 20,000          → 提示「此文字数 {N} 偏长，建议改用 /story-long-analyze。
                           仍要按短篇拆请明确回复『按短篇继续』」
```

### Step 3：题材识别

```
用户提到具体题材（追妻 / 重生 / 虐文 / ...）？
  ├─ 是 → 加载 analysis-short-genres.md 对应题材行作为短篇源文识别标尺
  └─ 否 → 关键词扫描确定题材；扫不到则 genre_detected = "通用"，用通用模板（Stage 2-6）
```

题材识别关键词参考：

- 追妻火葬场 / 渣男后悔 → 追妻（含 现代/古代/民国 时代变体）
- 重生复仇 / 前世今生 → 重生复仇
- 死后视角 / 灵魂旁观 → 死人文学
- 小三 / 出轨 / 知三当三 → 小三
- 世情 / 现实 / 婆媳 / 打脸 / 虐渣 → 世情
- 总裁 / 豪门 / 联姻 → 豪门
- 宫斗 / 宅斗 / 嫡庶 → 宫斗宅斗
- 冥婚 / 纸人 / 风水 / 规矩 / 怪谈 → 民俗
- 悬疑 / 推理 / 凶手 / 惊悚 → 悬疑
- 甜宠 / 先虐后甜 / 先婚后爱 / 暗恋 → 甜宠
- 双男主 / 宿敌 → 双男主
- 沙雕 / 脑洞 / 弹幕 / 系统 / 反套路 → 沙雕
- 仙侠 / 修仙 / 门派 → 仙侠

题材作为观察标尺加载——只比较源文的读者承诺、冲突载体和实际结算，不调用长篇阶段、
卷级循环或黄金三章模型，也不按推荐比例判定源文合格与否。

### Step 4：续跑检查（lightweight resume）

进入管道前检查 `拆文库/{书名}/_meta.json`：

```
存在 _meta.json？
  ├─ 否 → 直接进入新一轮拆解
  └─ 是 → 询问用户三选一（问法见下）：
       (a) 覆盖：归档旧产出到 拆文库/{书名}/_archive_{时间戳}/ 后从 Stage 2 重跑
       (b) 续跑：读 _meta.json.last_stage_in_progress（非空 → 从该 Stage 整段重跑）
                 或读 _meta.json.stages_completed[]（从 max+1 续跑）
       (c) 取消
```

问作者时不提文件名、字段名和 Stage 编号：

<!-- author-report -->
```md
《{书名}》之前拆过，{拆到一半，停在"{当前阶段的白话名，如反转与写作手法}" | 已经拆完}。怎么处理？
1. 接着上次往下拆（推荐，已拆的部分保留）
2. 旧结果存档，从头重拆
3. 先不拆了
```

完整 resume 契约见 [references/output-contract.md](references/output-contract.md)。

---

## 输出目录

输出到 `拆文库/{书名}/`（项目根目录下；用户指定了其他路径时按用户指定）：`原文/`、`拆文报告.md`、`情节节点.md`、`写作手法.md`、`_meta.json`。三个 markdown 由下游 `story-short-write` 硬编码读取，不可改名；文件树、Stage → 文件映射与 `_meta.json` 字段见 [references/output-contract.md](references/output-contract.md)。

### 原文备份（管道前置步骤）

**拆解开始前，必须先备份原文**：

1. 检查 `拆文库/{书名}/原文/` 目录是否已存在
2. 如果不存在，从用户提供的源路径复制原文文件到 `拆文库/{书名}/原文/`
3. 如果用户未提供源文件路径（直接在对话中贴文本），将原始文本保存到
   `拆文库/{书名}/原文/原文.md`
4. 备份完成后验证 `原文/` 目录下文件非空（>0 bytes）

备份完成后初始化 `_meta.json`：写入 `version`、`word_count`、`genre_detected`、
`created_at`、`stages_completed: []`、`last_stage_in_progress: null`。

---

## Stage 2-6：拆文流程

### 5 阶段管道

原文较短时只提取实际变化，不为凑节点数量重复拆分。

| 阶段 | 名称 | 输入 | 输出 | 完成标志 |
|------|------|------|------|----------|
| 2 | 结构+情节节点 | 全文 | 故事核 + 故事梗概 + 功能分段（4-6段，必须含开端/发展/高潮/结局）+ 情节节点清单（以语义变化为边界提取）。 | 结构划分 ≥4 段 + 故事核已提取 |
| 3 | 情感线+爆点 | 故事核+结构划分+情节节点数据 | 情感曲线（≥5节点）+ 爆点分析（6维度）+ 期待感分析。 | 爆点分析 6 维度齐全 |
| 4 | 反转+写作手法 | 节点+情感数据 | 前置反转检查 + 反转机制（铺垫≥3条）+ 写作手法（≥5项维度：POV/对话/时间/信息/其他）。 | 写作手法 ≥5 项 |
| 5 | 人物+开头结尾 | 情节节点+全文 | 所有人物（分类+功能标签+功能评估）+ 开头分析（前50/100字）+ 结尾分析（收束检查）。 | 人物功能评估完成 |
| 6 | 综合评估 + `_meta.json` 写计数 | 全部数据 | 五维评分 + 爆点性 + 话题性 + 共鸣分析（≥3层）+ 可复用结构（≥3条）+ 节奏速报 + **算出并写入 `_meta.json.structure_counts`**。 | 左列输出齐全 + `structure_counts` 各字段达「structure_counts 数值校验」阈值 |

> 管道执行顺序：2 → 3 → 4 → 5 → 6（严格串行，每阶段依赖前一阶段数据）。可选模块
> （同类对比、平台适配、详细节奏）可在 Stage 6 后执行，读 [references/optional-modules.md](references/optional-modules.md)。

### 按时刻读

管道分两个时刻，进入时刻只读该行的文件；两个时刻之间只靠落盘的 `拆文报告.md`、`情节节点.md`、`写作手法.md` 和 `_meta.json` 交接，续跑或换新对话都按 `_meta.json` 的进度接上。

| 时刻 | 读 | 交接 |
|---|---|---|
| Stage 2–3 结构与情感线 | [output-contract.md](references/output-contract.md)、[analysis-method.md](references/analysis-method.md)、[stage2-3-structure-emotion.md](references/stage2-3-structure-emotion.md)、[quality-checklist.md](references/quality-checklist.md)、[analysis-report-style.md](references/analysis-report-style.md) | `stages_completed` 含 3 |
| Stage 4–6 反转到综合评估、验收 | output-contract.md、analysis-method.md、[stage4-6-reversal-summary.md](references/stage4-6-reversal-summary.md)、quality-checklist.md、analysis-report-style.md；Stage 6 要判断源文本身好坏（毒点、虐爽节奏、证据链等）时加 [source-story-quality.md](references/source-story-quality.md) | 验收通过，`stages_completed` 含 6 |

对照标尺类参考按下方「参考资料」的条件在对应 Stage 读。

**Stage 写盘协议**（crash safety）：每个 Stage 开始前置 `_meta.json.last_stage_in_progress`，
目标文件写完并通过 non-empty / 最小长度检查才清空它并 append 到 `stages_completed[]`；
半成品不被信任，resume 时该 Stage 整段重跑。完整协议见 output-contract.md「写入顺序 (crash safety)」。

---

## 验收（Stage 6 内容写完后、将 6 加入 stages_completed 前）

Stage 6 内容写完后**不**立刻 append `6`，先按 output-contract.md「验收接入点」跑三道检查，全过才写：

- **拆文报告表达自检**：按 analysis-report-style.md 扫描 `拆文报告.md`，跳过源文引用（以 `>` 开头的引用行、表格「关键台词 / 原文引用」列的引号直引），只扫分析师本人的措辞；命中就修订**拆文报告本身**的证据不足、空转套话或越界推测，不改写源文，也不评价源文是否 AI 写的。
- **structure_counts 数值校验**：阈值以 output-contract.md 为准（单一权威），注意「无反转」是合法枚举，此时 `setup_clues` 跳过、不计入阻断。
- **BLOCK 项扫描**：扫 quality-checklist.md 全部 `[BLOCK]` 项；`[WARN]` 缺项不阻断，写入 `拆文报告.md` 末尾「待补」清单供用户决定。

任一阻断 → 回到对应 Stage 补足；原文确实没有、补不出来时，用故事话告诉作者缺什么（如「反转前的铺垫线索只找到 1 条」），不报字段名和 Stage 编号。全通过 → 清空 `_meta.json.last_stage_in_progress`，append `6` 到 `stages_completed[]`，按下方格式告诉作者：

<!-- author-report -->
```md
《{书名}》拆完了，结果在 `拆文库/{书名}/`。
- 这篇靠什么抓人：{一句话故事核}
- 最值得学的 3 点：{白话，各附一句原文或情节例子}
- 还缺的：{拆文报告末尾"待补"里需要作者决定的项；没有就写"无"}
下一步：想照这个路子写一篇，运行 `/story-short-write`。
```

---

## 流程衔接

**流水线：** 短篇
**位置：** 拆文（第 2/3 步）

| 时机 | 跳转到 | 命令 |
|---|---|---|
| 准备开写 | story-short-write（同时读 拆文报告.md + 情节节点.md + 写作手法.md + 原文/ + _meta.json） | `/story-short-write` |
| 需要市场数据 | story-short-scan | `/story-short-scan` |
| 字数 > 20k 更适合长篇 | story-long-analyze | `/story-long-analyze` |

---

## 参考资料

核心方法与模板按上方「按时刻读」加载；以下是对照标尺，按条件读。

### 按需加载（拆解对应题材 / 维度时作为对照标尺，一次只查一份）

| 文件 | 何时加载 |
|------|----------|
| [references/deconstruction-examples.md](references/deconstruction-examples.md) | 校准拆文方法：3 个完整案例 |
| [references/zhihu-style.md](references/zhihu-style.md) | 拆知乎盐言故事：平台特性对照 |
| [references/analysis-short-genres.md](references/analysis-short-genres.md) | Phase 1 / Stage 2 判主副类型：识别锚点、读者承诺、结算归属 |
| [references/analysis-short-hooks.md](references/analysis-short-hooks.md) | Stage 3 / 5：段落与小节边界、钩子链、候选付费断点 |
| [references/analysis-short-suspense.md](references/analysis-short-suspense.md) | Stage 3 / 4：主副问题、信息差、证据释放、阶段答案与回收 |
| [references/analysis-paragraph-hooks.md](references/analysis-paragraph-hooks.md) | Stage 3 / 5：11 种段落级钩子对照 |
| [references/analysis-character-basics.md](references/analysis-character-basics.md) | Stage 5：人设要素对照 |
| [references/analysis-character-design.md](references/analysis-character-design.md) | Stage 5 细拆反差手法：按标题查「三层标签反差人设法」（数反差人物用 stage4-6 的判定，不读本文件） |
| [references/analysis-character-relations.md](references/analysis-character-relations.md) | Stage 5：关系类型对照 |
| [references/analysis-short-mechanics.md](references/analysis-short-mechanics.md) | Stage 2 / 6：核心梗、有限复现、规则兑现、代价与主角代理权 |
| [references/analysis-reader-profile.md](references/analysis-reader-profile.md) | Stage 3 / 6：读者心理与期待管理 |

### 补充资料（拆 Stage 6「可复用结构」时按需对照）

> **短篇结构模式**：`references/analysis-short-patterns.md`（比较源文实际功能链、偏离方式
> 与失败条件；不按固定章位、百分比或线索数判“合标”）
> **通用写作技法**：`references/analysis-writing-techniques.md`（情绪操控 / 感情线 /
> 震惊场景 / 喜剧机制——拆 reusable_structures.fail_mode 时按标题只查「感情线四阶段推进法」表的「禁忌」列，不整读）
> **市场数据**：`references/real-market-data.md`（跨平台写作差异对照表）

所有 references 在 `story-short-analyze` 中都是**观察标尺**——先报告源文实际发生了什么，
再说明它接近、偏离或改造了哪种模式；不是按文件指引写新作品，也不从相邻长篇 Skill
加载题材、节奏或质量资料。


---

# SOURCE: skills/story-short-scan/SKILL.md

---
name: story-short-scan
version: 1.0.0
description: "短篇网文扫榜。分析知乎盐言、七猫、黑岩、点众等平台热门短篇数据，捕捉风口题材。触发方式：/story-short-scan、/短篇扫榜、「短篇什么火」「知乎故事排行」。"
metadata: {"openclaw":{"source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# story-short-scan：短篇网文扫榜

基于真实榜单样本分析短篇市场，给作者可写的情绪方向、题材候选和验证办法。

---

## 核心哲学

### 原则 1：短篇市场是情绪市场

扫榜从题材和简介中提取目标情绪、触发场景与情绪爆发点，说明这些内容如何吸引读者。仅凭题材名无法判断具体情绪体验。

### 原则 2：短篇的生命力在传播

榜单提供完读、分享、收藏或点赞数据时，按各自口径比较。排名和互动量只说明样本受到的关注，不能据此断定故事质量或情绪拉扯效果。

### 原则 3：短篇风口来得快去得快

报告写明样本日期、覆盖范围、结论可信度和复扫日期。题材信号可能在数周内失效，过期后只作候选参考。

---

## 扫榜流程

### Phase 1：确认平台和方向

用户已给出平台或方向时直接采用，只问缺项：**「想看哪个平台、哪类短篇？点众可直接采集，黑岩需要先登录作者后台；知乎盐言、番茄和七猫短篇请提供榜单截图、文字或链接。」**

关键判断：
- 用户已有方向 → 针对该方向做深度扫榜
- 用户没有方向 → 做全榜概览 + 找趋势
- 用户想跨平台比较 → 做平台对比分析

---

### Phase 2：确定数据来源

**扫榜需要真实数据支撑。** 根据当前环境选择数据来源：

| 优先级 | 模式 | 说明 | 何时用 |
|--------|------|------|--------|
| 1 | **脚本采集** | 点众、黑岩：直接抓取平台页面，产出结构化文件 | 有 Chrome 环境时（优先） |
| 2 | **作者提供** | 没有脚本的平台，或作者已有榜单 | 知乎盐言/番茄短篇/七猫短篇等 |
| 3 | **内置知识** | 用历史资料提出待验证的选题 | 无法联网、作者也没有数据时 |

1. 只读所选平台那一份：[点众](references/platform-dianzhong.md) / [黑岩](references/platform-heiyan.md) / [没有脚本的平台](references/manual-rank-input.md)。里面有网址、命令、字段、故障排查、平台分析维度，以及作者提供的榜单怎么整理成文件。
2. 每次扫榜新建输出目录 `扫榜/{YYYYMMDD}/`（同日再扫加 `-2`）存本次榜单，不往旧目录追加；文件名 `{平台}{类型}_{YYYYMMDD}.md`，某平台失败就跳过。对比读上个日期目录的 `扫榜聚合.md`。
3. 有榜单文件时运行聚合：`node scripts/aggregate-rank.js {输出目录} --out {输出目录}/扫榜聚合.md --sparse 10 --scale short`。**主会话只读这份聚合**，需要原始简介与人设信息时再抽样：`node scripts/aggregate-rank.js {输出目录} --sample {题材/标签/书名词} --n 5`。仅用内置知识时跳过聚合。

**内置知识：** 加载 `references/real-market-data.md`（跨平台写作差异对照），明确标注「以下分析基于历史趋势数据；未完成实时榜单校验前只能作为候选假设。」并列出需要复扫的平台页面。

---

### Phase 3：数据分析

有真实样本时，以聚合结果和平台参考的「分析维度」为准，提取下列信息。趋势需对比同口径的多期样本；仅用内置知识时只给待验证候选，不填写当前数量、占比或涨跌。

1. **情绪类型分布**：从题材和标签归并虐恋、反转、悬疑、治愈、打脸等类型，按样本数量比较
2. **题材热点**：具体什么设定/场景反复出现
3. **篇幅分布**：字数分布与各题材字数中位
4. **开头模式**：抽样内容含正文开头时分析首句；只有简介时只判断简介的写法
5. **结尾类型**：HE（好结局）/BE（坏结局）/开放式 的比例（抽样可见时）
6. **标题模式**：书名常见词 + 代表作标题
7. **人设模型**：反复出现的主角类型

---

### Phase 4：输出扫榜报告

报告讲市场结论和能写的方向。脚本名、命令和 SKIP 等采集状态不进报告；未采到的平台用一句话说明原因。模板中缺数据的项直接省略；单期样本不填涨跌，历史资料不填当前热度排行。

报告展示给作者，同时写进输出目录的 `短篇扫榜结论.md`：文件不存在就先按 [references/topic-match.md](references/topic-match.md) 的模板写文件头，再把报告作为「扫榜结论」一节写入（已存在就整节替换）。

<!-- author-report -->
```md
## 扫榜结论：{平台名称}

### 市场概况
- 扫榜时间：{日期}
- 核心发现：{一句话总结}
- 可信度：{样本多少篇、来自哪几个榜}；建议 {日期} 前后再扫一次

### 情绪热度排行
| 排名 | 情绪类型 | 榜上数量 | 趋势 | 代表作 |
|------|----------|----------|------|--------|
| 1 | {类型} | {N篇} | ↑/→/↓ | {标题} |

### 题材热点
| 题材 | 热度 | 竞争程度 | 门槛 | 代表作 |
|------|------|----------|------|--------|
| {题材} | 高/中/低 | 激烈/一般/蓝海 | 高/中/低 | {标题} |

### 关键数据洞察
- 篇幅区间：热门短篇集中在 {X}-{Y} 字
- 开头模式：{高频开头模式}
- 结尾偏好：{HE/BE/开放式的比例}
- 标题特征：{命名规律}
- 人设热词：{高频主角类型}

### 风口预警
- 🔥 正在爆发：{题材} — {依据}
- ⚡ 即将起风：{题材} — {依据}
- ⚠️ 即将饱和：{题材} — {依据}

### 值得写的方向
1. {方向 + 情绪拉扯方式 + 可行性}
2. {方向 + 情绪拉扯方式 + 可行性}
3. {方向 + 情绪拉扯方式 + 可行性}

### 一句话
{犀利总结}
```

---

### Phase 5：选题匹配

先读 `短篇扫榜结论.md` 的「扫榜结论」及同目录 `扫榜聚合.md`；内置知识模式没有聚合表，只读历史候选。结合项目素材与作者能力，按 [references/topic-match.md](references/topic-match.md) 写进同一文件的「选题匹配」一节：

- 低复杂度候选：反转类、打脸类（结构清晰、验证成本低）
- 高复杂度候选：悬疑类、虐恋类（技术壁垒高，需要伏笔、反转和情绪控制证据）
- 优先候选：样本信号明确，且项目素材与作者能力能够支撑的方向

**关键判断**：
- 先说明选题提供的情绪体验，再说明题材创新如何支持它
- 开头 3 句话是留存高风险区，必须建立冲突、身份差或情绪钩子
- 反转是短篇常见传播引擎；若不使用反转，必须用强共鸣、强话题或强余韵补足传播风险

---

## 平台特性速查

下表用于定位历史写法，当前题材分布与篇幅以本次样本为准；收费规则查平台说明。

| 平台 | 历史样本特点 | 可比较的类型与写法 |
|------|--------------|--------------------|
| 知乎盐言故事 | 情感与认知变化，表达较克制 | 虐恋、反转、悬疑、现实 |
| 七猫短篇 | 重生纠错、关系冲突，短章推进 | 总裁、现实、宅斗、年代、悬疑 |
| 黑岩短篇 | 强刺激、虐恋与快节奏对抗 | 虐恋、复仇、身份反转 |
| 点众短篇 | 事件集中，情绪兑现直接 | 家庭复仇、假千金、弹幕流 |

---

## 流程衔接

**流水线：** 短篇
**位置：** 扫榜（第 1/3 步）

| 时机 | 跳转到 | 命令 |
|---|---|---|
| 找到方向 | story-short-analyze | `/story-short-analyze` |
| 直接开写 | story-short-write | `/story-short-write` |
| 更适合长篇 | story-long-scan | `/story-long-scan` |

---

## 参考资料

按需加载以下文件：

| 文件 | 何时加载 |
|------|----------|
| 三份平台参考（链接见 Phase 2 第 1 步） | 「确定数据来源」：只读所选平台那份 |
| [references/topic-match.md](references/topic-match.md) | Phase 4/5：`短篇扫榜结论.md` 模板、可行性上限与交付 |
| [scripts/aggregate-rank.js](scripts/aggregate-rank.js) | 把输出目录里的原始榜单聚合成短表（`--out` 落盘，`--sample` 抽原始条目），主会话只读它 |
| [references/real-market-data.md](references/real-market-data.md) | **核心参考**：跨平台写作差异对照表、各平台简介公式速查、题材爆款公式速查表、各平台写作特征 |
| [scripts/cdp-utils.js](scripts/cdp-utils.js) | CDP 公共工具函数（ab/sleep/evalJSON/safeStr/scrollLoad/getArg），各采集脚本共用 |
| [scripts/dz-browse-scraper.js](scripts/dz-browse-scraper.js) | 点众短篇采集（男频/女频），用法见点众参考 |
| [scripts/heiyan-booklist-scraper.js](scripts/heiyan-booklist-scraper.js) | 黑岩书库列表采集（需登录），用法见黑岩参考 |


---

# SOURCE: skills/story-short-write/SKILL.md

---
name: story-short-write
version: 1.0.0
description: "短篇网文写作。辅助短篇小说创作，从构思到成稿，聚焦情绪拉扯与节奏把控。触发方式：/story-short-write、/写短篇、「帮我写一篇短篇」「写个盐言故事」。"
metadata: {"openclaw":{"source":"https://github.com/zenstory-ai/oh-story-claudecode"}}
---
# story-short-write：短篇网文写作

你负责从构思到成稿，完成一篇完整的短篇小说。

**执行规则：短篇以情绪为目标，所有内容为情绪服务。**

## 写前必读（强制，先读后写）

短篇按作者当前要做的事分阶段加载，阶段之间靠落盘文件交接。创建或修改故事文件前，先判断当前时刻，再完整读取该时刻的必读项；分块读取直到 EOF，`rg` 检索或局部摘读不算读完。**只读本 SKILL.md 不算完成门禁。**

| 时刻 | 作者确认什么 | 读什么 | 落盘 |
|---|---|---|---|
| 定情绪（Phase 1） | 读者读完的感觉、题材方向 | 本文件 | 进构思时写入 `设定.md` |
| 构思（Phase 2） | 故事核、人物、反转、付费点 | ① `references/workflow-design.md` + `references/writing-workflow.md`、`references/submission-craft.md`、`references/short-craft.md`、`references/short-reversal.md` ② 核心 10 题材读一个精确的 `references/genre-styles/{题材}.md`，冷门题材读 `references/genre-writing-formulas.md` ③ 有反派或真相揭露设计时读 `references/villain-and-reveal.md`，不适用时在设计校验区写明原因 | `设定.md`、`小节大纲.md` |
| 写正文（Phase 3–4） | 成稿 | Phase 3 写正文前完整读取 `references/workflow-draft.md`，按其「写前加载」读写作手法；Phase 4 精修前完整读取 `references/workflow-revision.md` | `正文.md` |

构思必读项须在首次写入 `设定.md` / `小节大纲.md` 前读完。任一必需路径不存在、不可读，或题材尚未对应到唯一 reference 时，立即停止，报告准确路径或待定项，**不得创建或修改故事产物**。故事文件只记录选出的题材招式、反转计算等设计，不写“已读 references”的回执。进入每个时刻都按当前任务完整回读。

**交接只靠落盘**：作者在对话里定下的字数、平台、人称、偏好、红线和否掉的方案，构思交付前写进 `设定.md`；写正文只读两份设计文件与本时刻的写作手法，不重读构思方法论，也不回翻对话。
**换上下文**：构思阶段加载最多，汇报末尾建议作者新开对话说「写正文」；作者选择在本对话接着写时照常执行。新对话中，两份设计文件通过构思完成门禁即可进入写正文。

---

> Agent 只查当前端 canonical 目录（Claude `.claude/agents`、OpenCode `.opencode/agents`、Codex `.codex/agents` TOML、Antigravity `.agents/agents`），不跨端误判。Claude 用 `subagent_type`，OpenCode 用 `subagent` 的 `agent`，Codex 用 `agent_type`，Antigravity 用 `invoke_subagent` + `TypeName`。主会话自己写正文、去味是常态，不报；作者明确要交给写作助手而能力/文件缺失、unknown agent 或 ZCode 3.3.4 时，由主会话接手并一句白话告诉作者（如「写作助手用不了，由我直接写」），`Fallback: project custom agents unavailable -> solo` 原文只写进汇报最后一行「技术备注：」。
>
> Spawn 版本提示（不阻断 spawn）：先读取项目根 `.story-deployed` 的 `agents_version`。与本版 `agents_version: 34` 不一致时（标记缺失、字段缺失/非整数、小于或大于 34）**照常按文件存在性检查并 spawn**，同时用一句白话提示作者「写作助手是旧版，运行 /story-setup 后新开对话」，`Notice: agents bundle 版本不匹配（项目 {N}，本版 34）` 原文写进技术备注行；大于 34 时额外提示先更新 oh-story-claudecode，不要用本地旧版 setup 降级覆盖。只有 agent 文件缺失、或运行时不暴露 custom agent 时才降级 solo/direct，`Fallback: ... -> solo` 同样只进技术备注行。

**文风裁决**：正文写作、改写或审稿前先读 [references/style-resolution.md](references/style-resolution.md)，加载本书文风并形成 `style_resolution`；无作者记忆也执行。当前请求、本书文风和 active 偏好按维度覆盖通用 references；同一裁决交给后续执行者。

## 执行规则

1. **先定情绪，再定故事**。动笔前必须确定目标情绪（意难平/反转震撼/爽感释放/治愈温暖/细思极恐/共鸣感动），所有内容为这个情绪服务。
2. **一个核心支点撑一篇**。反转型围绕一次主揭示蓄力；无反转型围绕报应兑现或甜度递进积累期待。不多线、不铺世界观。
3. **每句话必须有用**。不推动剧情、不铺垫反转、不推高情绪的句子 → 删。
4. **开头 3 句定生死，结尾定传播**。开头必须包含钩子，结尾必须有余韵。
5. **默认第一人称**，用亲历视角建立代入感。当前请求、本篇文风或题材需要第三人称时按其执行。

---

## 核心方法

- **按题材选写法**：确定题材后，按文风裁决选用题材包的腔调、开篇、钩子、情绪烈度、金句、招式与收尾；追妻按时代变体及小三/死人文学分支选择。冷门题材用公式安排结构，腔调按 `short-craft.md`
- **复用作者习惯**：有作者记忆时，正文前用 `scripts/author_memory_commit.py query --workspace {工作区} --book-root {项目目录} --kind prose_style --kind story_design [--genre {题材}] [--workflow 短篇]` 把输出的 `lines` 原样交正文/改写 agent 作自然倾向，不逐条追求命中，不牺牲连贯、节奏和字数；硬门禁、当前请求和本篇设定优先；没装下的交稿时用原话告诉作者。长期声明在收尾用 `record` 写入并回传回执，细则见 [references/author-memory.md](references/author-memory.md)。

---

## 写作流程

### Phase 1：确定目标情绪

从项目根及上一级往下 3 层找到 `短篇扫榜结论.md`（多份取最新）时先读其「选题匹配」，排第一的方向带着目标情绪当候选问作者；过了复扫日期就提醒可能过期。

问用户：**「你想让读者读完什么感觉？有没有想写的题材方向或灵感？」**

用户已说清读者读完的感觉 → 直接进入 Phase 2；只给了题材或梗、没说情绪 → 从下表带一个推荐情绪问一句，作者点头再进。

如果用户只有模糊想法 → 帮用户做情绪选择：

| 情绪类型 | 适合场景 | 难度 | 常配题材包 |
|----------|----------|------|------------|
| 意难平 | 虐恋、遗憾、错过 | 中 | 追妻火葬场 / 甜宠（先虐后甜） |
| 反转震撼 | 悬疑、身份错位 | 高 | 悬疑 / 沙雕脑洞（反套路） |
| 爽感释放 | 打脸、逆袭 | 低 | 世情打脸 / 复仇打脸 / 总裁豪门 / 宅斗宫斗（古代上位） |
| 治愈温暖 | 成长、亲情、友情 | 中 | 甜宠 / 双男主（救赎线） |
| 细思极恐 | 悬疑、心理 | 高 | 悬疑 / 民俗怪谈 |
| 共鸣感动 | 现实、职场、婚姻 | 中 | 世情打脸（共鸣模式） / 追妻火葬场（小三文学） |

---

### Phase 2：构思核心框架

#### 对标上下文加载

存在本篇 `对标/`、项目根 `拆文库/` 或用户提供参考小说时，先完整读取 [references/benchmark-recall.md](references/benchmark-recall.md)，执行对标发现、排除本书续写基线、题材匹配与召回。无外部对标时仍按原题材包执行。

#### 构思、设计与验收

完整步骤见 [references/workflow-design.md](references/workflow-design.md)。按首屏「写前必读」读完后执行；两份设计文件通过其中的 Phase 2 完成门禁，才可进入 Phase 3。

---

### Phase 3：逐场景写作

进入正文写作前，完整读取 [references/workflow-draft.md](references/workflow-draft.md)，执行交付参数锁定、写前验收与逐场景写作；只做构思或精修时不加载。

**小节完整性流程**：
1. **写作时**：每节围绕一个主问题推进；让风险、信息、关系、资源、决定、行动或读者理解至少发生一项可见变化。相关情节点可以由同一动作链或对话同时兑现，不为拆成多个“子事件”重复铺陈。
2. **写完后**：对照 `小节大纲.md` 检查批准内容是否落地、因果与下一步是否读得懂、感知/反应是否提供新信息、伏笔/物件是否按计划出现。
3. **发现缺口时**：只补回原计划中漏掉的动作、证据、选择或后果；若本节已经完成职责，即使很短也不加任务卡点、对话、回忆或环境来凑长度。
4. **发现冗余时**：删除不改变风险、信息、关系、资源、决定、行动或可信度的阻碍、复述与旁人反应；不把“有冲突”本身当成保留理由。

### Phase 3 完成门槛（进入 Phase 4 前必须通过）

- [ ] 总字数进入锁定的用户范围；未指定时进入 8000-20000 默认范围
- [ ] 每节完成其批准情节点或状态变化；没有为拉齐长度补冲突、对话、回忆或旁人反应
- [ ] 节数 = 小节大纲规划节数（不得合并/省略）
- [ ] 身体细节按叙事功能判断，不设次数上限；不对“手、眼、心”等单字计数改稿
- [ ] 「像/好像/仿佛/如同」不成片堆叠；超过 10 处需逐处复核功能，不机械全删
- [ ] `node scripts/check-ai-patterns.js --check --fail-on=blocking 正文.md` 无 blocking 命中；其余提示先通读，确属问题再改
- [ ] `node scripts/check-degeneration.js --check 正文.md` 无 blocking 退化命中（复读/截断/工程词泄漏）

**不通过 → 回退补足，不得进入精修。**

---

### Phase 4：精修打磨

精修或质量自检前，完整读取 [references/workflow-revision.md](references/workflow-revision.md)，按其职责分工去味、查一致性、做最终扫描与交付验收；只做构思时不加载。

---

## 流程衔接

**流水线：** 短篇
**位置：** 写作（第 3/3 步）

有参考小说想对标 → `/story-short-analyze`（存入 `拆文库/{书名}/`）；写完去 AI 味 → `/story-deslop`；想自检 → Phase 4 流程 + `references/short-prose-quality.md`；要市场方向 → `/story-short-scan`；设定太大适合长篇 → `/story-long-write`。

---

## 参考资料

阶段必读项按首屏「写前必读」执行；其他资料按 [参考索引](references/reference-index.md) 的加载条件选用。
