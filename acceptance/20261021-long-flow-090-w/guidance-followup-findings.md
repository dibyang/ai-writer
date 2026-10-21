# 连续两个新会话暴露的规划引用顺序问题（原始发现记录）

当前状态：指引已修复，最终候选源码与ZIP解压包的完整回归、doctor均通过；D正式提交后已安装至P的generation3，并在独立新用户零正文场景R实际验证规划→真实细纲→有限授权→取上下文/登记模板→暂停的顺序。当前证据为planning-build-verification.json、planning-guidance-update-verification.json和parent-bootstrap-verification.json。下文“拟补充”“待停点”等表述保留发现时的历史判断，不代表当前尚未实现。

证据为cli-logs/c-authorize与cli-logs/d-authorize-draft：两次workflow都引用尚未由plan创建的单元纲，分别为0019和0022，实际子码2/ENOENT，前后state同SHA。两会话均改用已有真实来源完成有限授权，再正式plan建立新章纲；原输入、拒绝与纠正收据完整保留。不是正文问题，也没有放宽引用真实性保护。

现有快速入门讲有限范围和恢复，使用手册讲planning与权限，但没有明确新章节引用尚不存在时的启动顺序。两个新会话重复犯同类错误，值得把顺序直接写入帮助、快速入门和手册。

拟补充：planning.refs只能指向真实可读文件，adopted还必须有真实采用依据；先以outline阶段和discuss/plan、两正文范围null登记规划任务，outline状态可为draft、refs可空；通过plan建立真实细纲后，再用当前revision登记已采用引用和有限trial/drafting正文范围。已有合法滚动细纲可用为真实来源，但不要把不存在的未来单元路径标成已采用，也不建空文件或改state/hash来压过拒绝。

已核源码lib/governance.mjs：合法planning.status为missing/draft/adopted/deferred，阶段outline合法；规划阶段不能同时允许draft，adopted必须有可读来源。不要在说明中发明pending状态或review阶段/动作。

D当前运行中的根产品冻结基线为e980，且将进入修订会话占用。为保持实际验证和更新保护，当前先保留复现，不在运行中换源或覆盖冻结清单；在D正式修订提交并恢复暂停后，补入lib/help.mjs、docs/quickstart.md、docs/user-guide.md、docs/workflow.md及开发说明，构建新候选，对最终源码与实际解压包重新运行npm test/doctor，正式更新隔离样本，再由新鲜F回读最终交付下的24章。旧e980及其回归、更新和运行记录保留为历史，不能覆盖成新构建结果。预计相应增加约半小时。

本文件仅记录已发现问题和后续顺序，不表示补充已实现或新构建已通过。产品修复完成后另存实际收据并在最终README/verification中统一当前状态，本复现原件保留。

执行时序细化：D首停正常退出、主区24章且独立候选仅重登13后，可以先在根仓库完善文档并构建下一候选，将源码/解压包回归与D同ID恢复并行。D继续使用已经验过的P内generation2/e980工具和同一修订owner/token，根新源码不得被当作已安装工具；D续程提示须明确两套身份和新根冻结清单。修订提交完成且新候选测试全部通过后，才正式更新P至下一代，再新鲜F验证最终交付。旧delivery-current/product-frozen-current及旧更新收据不覆盖，新候选使用delivery-final/product-frozen-final及新的构建/更新收据，最终入口显式指向新文件。此安排减少纯等待，同时保留修订会话对旧工具字节的绑定。
