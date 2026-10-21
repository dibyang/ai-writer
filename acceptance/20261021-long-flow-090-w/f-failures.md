# F实际失败与恢复

- f-bootstrap-outline：AUTHOR_EVIDENCE_MISMATCH，实际子码2，原输入/双流/前后state见cli-logs同名目录。辅助脚本把Buffer序列化为数字数组；保留错误副本，读help后v2原样复制prompt，outline-v2成功。非产品缺陷。
- f-build-review.mjs两次辅助断言退出1：11章“手腕又碰桌沿”应“腕子又碰桌沿”；14章“你这张凳到底给谁坐”应原叙述中的“这张凳到底给谁坐”。初版字段文件保留f-model-fields-before-quote-fix.mjs，按已实读原句纠正并核全部120引文和比较引文存在后才正式review。辅助断言只在本会话exec返回中，未冒称w-log产品双流。
- f-negative-context-25 / f-negative-template-25：均预期ACTION_OUT_OF_SCOPE，实际子码2，state不变，均无out，无25文件。与意外失败分开。
- 本轮没有网络工具调用或网络中断，不编恢复故事。所有产品调用使用w-writer，唯一例外为按指令init经w-log；所有写/out串行，未在拒绝后继续其依赖操作。
- 阅读完成后第19章标题数字高置信问题登记open并报根，未修；不是CLI故障。
