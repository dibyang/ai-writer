# B65首合章接续证明调用参数纠正

根先成功生成assembly-b65-original-verification.json（真实CLI为b-resume-assemble65-first），随后误把该CLI label作为verify-stop-merge第四参数，导致寻找并不存在的assembly-b-resume-assemble65-first-verification.json，实际ENOENT/exit1。原失败已以同参数明确复现并完整留local-checks/b65-stop-merge-wrong-receipt-label。

正确第四参数是已存在的证明label b65-original。使用原辅助脚本/原状态/原正文重新核验成功（local-checks/b65-stop-merge-correct-receipt-label，actual exit0）。没有修改产品、正文、模板、哈希或校验要求来通过；首合章仍6段22081正文汉字，原两段各一次有序进入，原CAS/模板不变。
