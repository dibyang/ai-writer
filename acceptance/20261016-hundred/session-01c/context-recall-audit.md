# Context遗漏项逐项相关性复核

每章实际运行context并保留完整原始回包、revision和source_hashes。巨大CLI JSON在工具显示中截断，未伪称这些合并显示全段已读；创作来源、当前43项语义字段及新章全文均实际读取，新增知识逐章核对。以下是每个omitted ID的人工语义判定，脚本只整理索引，不替代正文阅读。

- 第25章：revision 67；omitted T_KEY_CABINET, I_KEY_USE, I_DECK_REPAIR, T_INDEX, T_LAMP, T_MESSAGE_VERIFY, T_SERVICE_VISIT, T_TAPE, T_PRIVATE, I_AUDIO_ALIGN, O_INDEX_CONT, O_KEY, O_LAMP_RECORD, O_LAMP_PANEL, O_MAP, O_NOTICE, P_MAP, T_EAST, T_MAP, O_CURRENT；完整来源哈希见unit-25-before.json。
- 第26章：revision 68；omitted T_KEY_CABINET, I_KEY_USE, I_DECK_REPAIR, O_QIU_ACCOUNT, O_TAPE_18, P_SERVICE_BAG, R_SHEN_TANG, T_CONTACT, T_HANDOVER, T_INDEX, T_LAMP, T_MESSAGE_VERIFY, T_SERVICE_VISIT, T_TAPE, I_AUDIO_ALIGN, O_INDEX_CONT, O_KEY, O_LAMP_RECORD, O_LAMP_PANEL, O_MAP, O_NOTICE, P_MAP, T_EAST, T_MAP, O_CURRENT；完整来源哈希见unit-26-before.json。
- 第27章：revision 69；omitted I_DECK_REPAIR, O_TAPE_18, P_AUDIO_COPY, P_SERVICE_BAG, R_SHEN_TANG, T_CONTACT, T_HANDOVER, T_INDEX, T_SERVICE_VISIT, T_TAPE, I_AUDIO_ALIGN, O_INDEX_CONT, O_KEY, O_LAMP_RECORD, O_LAMP_PANEL, O_MAP, O_NOTICE, P_MAP, T_EAST, T_MAP, O_CURRENT；完整来源哈希见unit-27-before.json。
- 第28章：revision 70；omitted T_HANDOVER, T_TAPE, T_KEY_CABINET, I_KEY_USE, I_DECK_REPAIR, T_SERVICE_VISIT, T_CONTACT, T_MESSAGE_VERIFY, O_PLATE, O_QIU_ACCOUNT, O_TAPE_18, P_AUDIO_COPY, P_SERVICE_BAG, T_INDEX, I_AUDIO_ALIGN, O_INDEX_CONT, O_KEY, O_LAMP_RECORD, O_LAMP_PANEL, O_MAP, O_NOTICE, P_MAP, T_EAST, T_MAP, O_CURRENT；完整来源哈希见unit-28-before.json。
- 第29章：revision 71；omitted T_HANDOVER, T_TAPE, T_KEY_CABINET, I_KEY_USE, I_DECK_REPAIR, T_SERVICE_VISIT, T_CONTACT, T_MESSAGE_VERIFY, O_DECK, O_DISPATCH_RETURN, O_INDEX_PAGE, O_MESSAGE_ROW, O_MESSAGE_SIGN, O_PLATE, O_QIU_ACCOUNT, O_TAPE_18, P_SERVICE_BAG, T_INDEX, I_AUDIO_ALIGN, O_INDEX_CONT, O_KEY, O_LAMP_RECORD, O_LAMP_PANEL, O_MAP, O_NOTICE, P_MAP, T_EAST, T_MAP, O_CURRENT；完整来源哈希见unit-29-before.json。
- 第30章：revision 74；omitted T_HANDOVER, T_TAPE, T_KEY_CABINET, I_KEY_USE, I_DECK_REPAIR, T_SERVICE_VISIT, T_CONTACT, T_MESSAGE_VERIFY, P_SERVICE_BAG, T_INDEX, I_AUDIO_ALIGN, O_INDEX_CONT, O_KEY, O_LAMP_RECORD, O_LAMP_PANEL, O_MAP, O_NOTICE, P_MAP, T_EAST, T_MAP, O_CURRENT；完整来源哈希见unit-30-before.json。

|ID|本批处理|
|---|---|
|T_KEY_CABINET|已实查现柜；27只问公开工作稿，未改旧历史|
|I_KEY_USE|只证现锁可开；27/28不再试钥，不补原配|
|I_DECK_REPAIR|29用新课件与耳机，不调用卡座原带验证|
|T_INDEX|partial保留，2013完整历史接收链未强结|
|T_LAMP|灯义回收有效，28公共使用问题另建T_ROUTE_COMMON|
|T_MESSAGE_VERIFY|24回签调度已核，只保持送门口限度|
|T_SERVICE_VISIT|旧到访完成；26新到访问公开请求非补旧证|
|T_TAPE|已完成听取；本批不新增原带播放，30新录另物|
|T_PRIVATE|intentional-open保持；25未调用，27再问公开范围仍无私因|
|I_AUDIO_ALIGN|只局部比较，不因新讲述证明全带同日|
|O_INDEX_CONT|续表工作照旧观察保持，本批不重查原册|
|O_KEY|初始三角磨痕蓝绳观察保留，现保管另P_KEY|
|O_LAMP_RECORD|16可展页已全文读，不揭前粘页、不新增签名|
|O_LAMP_PANEL|13/15已实读，28只外看不触门、不逆改用法片|
|O_MAP|10/12全文已读，不拿2011图作当前路线|
|O_NOTICE|无日期残通知保持，不强配2012日|
|P_MAP|许成仍持单张复印纸，本批不借|
|T_EAST|旧今地理partial保持；28/30仅谈当前通行|
|T_MAP|整套图来源未明保持，不强结|
|O_CURRENT|现厅寄存与接驳观察保持，不和旧泊位混|
|O_QIU_ACCOUNT|22/24已实读，27改稿30有限口述不新增历史证词|
|O_TAPE_18|18全文已读；不将新试读作旧带再试听|
|P_SERVICE_BAG|宋继续锁存，26不展袋、不担保历史齐|
|R_SHEN_TANG|有效旧迟告后果保持；28新拒出席并不翻旧账|
|T_CONTACT|邱已实际访过；27/30是新试稿约|
|T_HANDOVER|24已交完；不重开移交，25/27只补通知|
|P_AUDIO_COPY|分文件自持，27不播放，30新录另建P_TRIAL_VOICE|
|O_PLATE|第2/14/24已实读，不改独见两线无日期；不凭箱推牌知识|
|O_DECK|第11章试机观察保持，29没有原卡座操作|
|O_DISPATCH_RETURN|24已读，30只有限口述不证人人登船|
|O_INDEX_PAGE|旧清点年月不能套声音；本批未再消费原目录|
|O_MESSAGE_ROW|旧初见空夹观察不逆改，24全文已核另签|
|O_MESSAGE_SIGN|24原签已读，本批不展示原签图|
