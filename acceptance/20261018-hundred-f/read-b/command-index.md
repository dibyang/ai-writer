# F-B 命令索引

全部产品调用经F capture，JSON产品结果见对应stdout.raw.txt，不把capture元信息当产品结果。输入均为CLI参数，无 --input JSON；前后state在每次产品目录。

|标签|调用|退出|毫秒|前后state|
|---|---|---|---|---|
|f-b-001-status|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/work/.writer/tool/bin/ai-writer.mjs status --project D:/work/other/ai-writer/acceptance/20261018-hundred-f/work|0|225|字节一致|
|f-b-002-workflow|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/work/.writer/tool/bin/ai-writer.mjs workflow show --project D:/work/other/ai-writer/acceptance/20261018-hundred-f/work|0|136|字节一致|
|f-b-003-discussion|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/work/.writer/tool/bin/ai-writer.mjs context --purpose discussion --project D:/work/other/ai-writer/acceptance/20261018-hundred-f/work|0|243|字节一致|
|f-b-004-identify|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/work/.writer/tool/bin/ai-writer.mjs tool identify --project D:/work/other/ai-writer/acceptance/20261018-hundred-f/work|0|135|字节一致|
|f-b-005-check|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/work/.writer/tool/bin/ai-writer.mjs check --project D:/work/other/ai-writer/acceptance/20261018-hundred-f/work|0|586|字节一致|
|f-b-006-helper-path-failure|node acceptance/20261018-hundred-f/evidence-placeholder.mjs|1|90|非产品helper/git，无state|
|f-b-007-readings-quote-failure|node acceptance/20261018-hundred-f/read-b/evidence.mjs readings|1|219|非产品helper/git，无state|
|f-b-008-readings-verified|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/read-b/evidence.mjs readings|0|98|非产品helper/git，无state|
|f-b-009-final-status|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/work/.writer/tool/bin/ai-writer.mjs status --project D:/work/other/ai-writer/acceptance/20261018-hundred-f/work|0|245|字节一致|
|f-b-010-final-check|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/work/.writer/tool/bin/ai-writer.mjs check --project D:/work/other/ai-writer/acceptance/20261018-hundred-f/work|0|609|字节一致|
|f-b-011-final-doctor|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/work/.writer/tool/bin/ai-writer.mjs doctor --project D:/work/other/ai-writer/acceptance/20261018-hundred-f/work|0|154|字节一致|
|f-b-012-final-git-diff|git diff --exit-code|0|409|非产品helper/git，无state|
|f-b-013-final-git-status|git status --short|0|551|非产品helper/git，无state|
|f-b-014-final-compare|node D:/work/other/ai-writer/acceptance/20261018-hundred-f/work/.writer/tool/bin/ai-writer.mjs tool compare --other D:/work/other/ai-writer/acceptance/20261018-hundred-f/sources/package --project D:/work/other/ai-writer/acceptance/20261018-hundred-f/work|0|766|字节一致|

006/007为保留的记录helper失败，008为纠正后的引句/阅读资料核验；不是产品失败。其余直接运行的盘点、覆盖核验与封存helper及全部编辑事件保存在events.jsonl。完整参数/构建观测/原始stdout和stderr在../commands/各标签，命令元数据另见command-index-final.json。
