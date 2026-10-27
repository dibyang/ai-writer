# AD E 首停证据定位勘误

四份当前AD-E-replay-0048至0051报告的通用段中，read-logs字样应定位为外层AD/read-pages。本项目没有read-logs目录。实际逐页证据均由AD/read.mjs写入read-pages，完整路径、页数、正文SHA、页面输出SHA详见ef-formal-reading-coverage.json与ef-final-audit.json。此处仅更正证据目录名称；不改变已绑定报告字节或哈希，不以勘误代替未读页面。

workflow/freeze时间顺序偏差另见交接-E首停.md及e-first.json，不作为通过项隐去。
