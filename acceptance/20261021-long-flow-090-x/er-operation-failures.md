# X-ER续程操作失败与纠正

1. 读取cli-logs/er-replay28/argv.json返回不存在；工具提示真实文件argv.raw.json，随后实读该原件。未运行依赖，不影响产品/候选。
2. 30章首次apply_patch仅提供原段前半句作为整行，工具拒绝：`Failed to find expected lines`。原失败文本：`钟指到七点，老师将门虚掩，前头说今晚仍是八点半收针。` 文件未变。随后使用实读127/201/207完整原行纠正；未在失败后调用replay或登记。
