# 根侧事务核验脚本纠正

2026-10-25，均为只读核验或辅助文件生成失败，未改产品、正文或状态。

1. 元数据检查最初对事务目录调用readFileSync，EISDIR；随后读取其中transaction.json。
2. 新辅助核验脚本原断言published.revision===328失败，实际327。核对原成功fr2-distance-commit回执及原before/after字节：326→327，after SHA909fef0524e7e3b313d5519227611a0ad4416394e005a8b24f87f4794dc6c640，与事务new/168.bin一致。328属于后续元数据，不能当作发布瞬间修订号。
3. 尝试Node -e保存前版与处置时，末尾多出一个}导致SyntaxError，整段未执行，**没有生成前版备份**。根编排未因该返回码停止，随后已修改辅助脚本，不能宣称原版已备份；原失败代码/输出保留于根工具记录，差异为第4行published.revision 328→327，并新增与原CLI前后状态字节比较。此文件明确记录失误，不重建虚假的“修改前文件”。
4. 修后实际核验通过：169份new归档字节、2份old备份字节一致；168个当前非state目标与发布after一致，当前units/snapshot与发布时归档一致。主state允许之后合法元数据推进，当前339；原第21章备份与fr-distance-before21.md字节相同。

正式通过回执：f-transaction-retention-verification.json；辅助脚本为verify-f-transaction-retention.mjs。以上均不计新增产品缺陷。
