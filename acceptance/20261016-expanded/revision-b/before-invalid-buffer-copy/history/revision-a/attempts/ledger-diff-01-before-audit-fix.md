# 全账本语义差异与逐章证据核对

比较按字段和值进行，不使用对象键顺序判断差异。历史正文/输入/journal/review/报告均保留；新引文由真实 record 绑定最终正文哈希和行号。

|ID|类型|终态/到期|原/新证据数|授权语义变化|机械变化字段数|其他变化|
|---|---|---|---|---|---|---|
|O_CURRENT|observation|active/无|4/4|无|4|无|
|O_DECK|observation|active/无|2/2|无|2|无|
|O_INDEX_PAGE|observation|active/无|2/2|无|0|无|
|O_KEY|observation|active/无|2/2|character_known.沈禾；evidence.0.quote；statement；tags.1|4|无|
|O_MAP|observation|active/无|5/5|character_known.周砚；character_known.沈禾；evidence.0.quote；evidence.2.quote；statement|3|无|
|O_NOTICE|observation|active/无|6/6|evidence.0.quote；statement；tags.0|5|无|
|O_PLATE|observation|active/无|9/9|character_known.唐穗；character_known.顾遥；evidence.0.quote；evidence.4.quote；evidence.6.quote；evidence.8.quote；statement|9|无|
|P_BOX|object|active/无|13/13|无|16|无|
|P_KEY|object|active/无|3/3|custody.condition；evidence.1.quote；statement|6|无|
|P_MAP|object|active/无|4/4|无|3|无|
|P_NOTICE|object|active/无|7/7|无|6|无|
|P_TAPE|object|active/18|4/4|无|0|无|
|T_EAST|thread|partial/无|9/9|character_known.唐穗；character_known.沈禾；evidence.0.quote；evidence.2.quote；reader_known；statement；tags.1|8|无|
|T_HANDOVER|thread|active/无|9/9|无|5|无|
|T_INDEX|thread|partial/无|6/6|无|4|无|
|T_LAMP|thread|pending/9|5/5|无|2|无|
|T_MAP|thread|partial/无|7/7|无|6|无|
|T_PRIVATE|thread|intentional-open/无|4/4|无|8|无|
|T_SIGNAL|thread|partial/12|6/6|无|0|无|
|T_TAPE|thread|partial/18|6/6|无|2|无|

T_EAST 保留稳定 ID，现行含义为西埠地点接续的未证猜想。其 statement 删除“甚至位置相同”，改为沿现路牌问四号泊位；第6章的引文与人物所知同步；后续 reader_known 区分现六号寄存与旧四号泊位。这些属于授权后的因果同步。现行向东路牌、六号寄存、六处泊位示意数量与东侧发现标签均保留。

|章|原/新正文汉字|本章账本更新ID与原字段|原/新新增证据数|上下文遗漏|
|---|---|---|---|---|
|1|1554/1554|T_SIGNAL: cast, character_known, due_unit, evidence, reader_known, statement, status, tags, type<br>T_HANDOVER: cast, character_known, evidence, reader_known, statement, status, tags, type|T_SIGNAL 2/2；T_HANDOVER 2/2|无|
|2|1550/1551|O_PLATE: cast, character_known, evidence, reader_known, statement, status, tags, type<br>P_BOX: cast, character_known, custody, evidence, reader_known, statement, status, tags, type|O_PLATE 4/4；P_BOX 4/4|无|
|3|1579/1579|P_BOX: character_known, custody, evidence, previous_holder, reader_known<br>O_KEY: cast, character_known, evidence, reader_known, statement, status, tags, type<br>P_KEY: cast, character_known, custody, evidence, reader_known, statement, status, tags, type<br>T_PRIVATE: cast, character_known, evidence, reader_known, statement, status, tags, type|P_BOX 3/3；O_KEY 2/2；P_KEY 3/3；T_PRIVATE 4/4|无|
|4|1573/1573|T_LAMP: cast, character_known, due_unit, evidence, reader_known, statement, status, tags, type<br>P_TAPE: cast, character_known, custody, due_unit, evidence, reader_known, statement, status, tags, type<br>T_TAPE: cast, character_known, due_unit, evidence, reader_known, statement, status, tags, type<br>T_SIGNAL: character_known, evidence|T_SIGNAL 1/1；T_LAMP 3/3；P_TAPE 4/4；T_TAPE 4/4|无|
|5|1627/1629|O_PLATE: character_known, evidence, reader_known<br>P_BOX: character_known, evidence<br>T_INDEX: cast, character_known, evidence, reader_known, statement, status, tags, type<br>T_HANDOVER: character_known, evidence|T_HANDOVER 1/1；O_PLATE 2/2；P_BOX 1/1；T_INDEX 2/2|无|
|6|1577/1606|O_NOTICE: cast, character_known, evidence, reader_known, statement, status, tags, type<br>P_NOTICE: cast, character_known, custody, evidence, statement, status, tags, type<br>T_EAST: cast, character_known, evidence, reader_known, statement, status, tags, type<br>T_HANDOVER: character_known, evidence|T_HANDOVER 1/1；O_NOTICE 1/1；P_NOTICE 2/2；T_EAST 2/2|无|
|7|1582/1584|O_PLATE: character_known, evidence, reader_known<br>P_BOX: character_known, evidence<br>P_NOTICE: character_known, custody, evidence<br>O_NOTICE: character_known, evidence<br>T_EAST: character_known, evidence<br>T_HANDOVER: character_known, evidence|T_HANDOVER 1/1；O_PLATE 2/2；P_BOX 2/2；O_NOTICE 1/1；P_NOTICE 2/2；T_EAST 2/2|无|
|8|1615/1626|O_CURRENT: cast, character_known, evidence, reader_known, statement, status, tags, type<br>T_EAST: character_known, evidence, reader_known, status<br>T_MAP: cast, character_known, evidence, reader_known, statement, status, tags, type<br>O_NOTICE: character_known, evidence<br>P_NOTICE: character_known, evidence<br>T_INDEX: character_known, evidence<br>T_HANDOVER: character_known, evidence|T_HANDOVER 1/1；T_INDEX 1/1；O_NOTICE 2/2；P_NOTICE 1/1；T_EAST 1/1；O_CURRENT 3/3；T_MAP 2/2|无|
|9|1544/1553|T_HANDOVER: character_known, evidence, reader_known<br>T_LAMP: character_known, due_unit, evidence, reader_known, status<br>O_CURRENT: character_known, evidence, reader_known<br>T_EAST: character_known, evidence<br>T_MAP: character_known, evidence, reader_known<br>P_NOTICE: character_known, evidence<br>P_BOX: character_known, evidence|T_HANDOVER 1/1；P_BOX 1/1；T_LAMP 2/2；P_NOTICE 1/1；T_EAST 1/1；O_CURRENT 1/1；T_MAP 1/1|无|
|10|1642/1642|T_MAP: character_known, evidence, reader_known, status<br>O_MAP: cast, character_known, evidence, reader_known, statement, status, tags, type<br>P_MAP: cast, character_known, custody, evidence, statement, status, tags, type<br>O_NOTICE: character_known, evidence<br>T_EAST: character_known, evidence, reader_known|O_NOTICE 1/1；T_EAST 2/2；T_MAP 2/2；O_MAP 2/2；P_MAP 2/2|无|
|11|1590/1591|O_PLATE: character_known, evidence, reader_known<br>P_BOX: character_known, evidence, reader_known<br>T_TAPE: character_known, evidence, reader_known<br>O_DECK: cast, character_known, evidence, reader_known, statement, status, tags, type<br>T_INDEX: character_known, evidence<br>O_MAP: character_known, evidence, reader_known<br>P_MAP: character_known, evidence<br>T_MAP: character_known, evidence|O_PLATE 1/1；P_BOX 2/2；T_TAPE 2/2；T_INDEX 1/1；T_MAP 1/1；O_MAP 1/1；P_MAP 1/1；O_DECK 2/2|无|
|12|1650/1650|T_SIGNAL: character_known, due_unit, evidence, reader_known, status<br>T_INDEX: character_known, evidence, reader_known, status<br>O_INDEX_PAGE: cast, character_known, evidence, reader_known, statement, status, tags, type<br>O_MAP: character_known, evidence, reader_known<br>P_MAP: character_known, evidence<br>O_NOTICE: character_known, evidence<br>P_NOTICE: character_known, evidence<br>T_HANDOVER: character_known, evidence, reader_known<br>T_EAST: character_known, evidence<br>T_MAP: character_known, evidence|T_SIGNAL 3/3；T_HANDOVER 2/2；T_INDEX 2/2；O_NOTICE 1/1；P_NOTICE 1/1；T_EAST 1/1；T_MAP 1/1；O_MAP 2/2；P_MAP 1/1；O_INDEX_PAGE 2/2|无|

## 非机械差异原值与新值

- 授权标识修改：`characters.客运厅问讯员`
  - 原："第3日上午现客运厅工作；看沈禾手机通知工作照片，听说原页旧站散页、缺日期且留旧站；不认定旧东埠位置，只知自己在现厅业务和接驳安排，建议问原场地经手人找年份。未见原通知、原铜牌，未获牌字刻线、广播录音钥匙或私人信息。"
  - 新："第3日上午现客运厅工作；看沈禾手机通知工作照片，听说原页旧站散页、缺日期且留旧站；不认定旧西埠位置，只知自己在现厅业务和接驳安排，建议问原场地经手人找年份。未见原通知、原铜牌，未获牌字刻线、广播录音钥匙或私人信息。"
- 授权标识修改：`ledger.O_KEY.character_known.沈禾`
  - 原："亲见三角磨痕红棉绳；听罗敬说清旧站桌时混入工具，未核出处、未认锁。"
  - 新："亲见三角磨痕蓝棉绳；听罗敬说清旧站桌时混入工具，未核出处、未认锁。"
- 授权标识修改：`ledger.O_KEY.evidence.0.quote`
  - 原："钥匙柄有一处三角磨痕，柄孔里系着红棉绳，绳尾已经毛了。"
  - 新："钥匙柄有一处三角磨痕，柄孔里系着蓝棉绳，绳尾已经毛了。"
- 授权标识修改：`ledger.O_KEY.statement`
  - 原："第3章罗敬从工具袋的小布口袋取出一把原铜钥匙，柄有三角磨痕，柄孔系红棉绳，绳尾起毛；未试任何锁，具体用途待核。"
  - 新："第3章罗敬从工具袋的小布口袋取出一把原铜钥匙，柄有三角磨痕，柄孔系蓝棉绳，绳尾起毛；未试任何锁，具体用途待核。"
- 授权标识修改：`ledger.O_KEY.tags.1`
  - 原："红棉绳"
  - 新："蓝棉绳"
- 授权标识修改：`ledger.O_MAP.character_known.周砚`
  - 原："第11章仅电话获述，第12章首次看沈维修图工作照并收到：2011年11月、候船室与东埠泊位及虚线，无今厅无挂牌；未看原复印纸或到河街，不能由此定广播/通知年代。"
  - 新："第11章仅电话获述，第12章首次看沈维修图工作照并收到：2011年11月、候船室与西埠泊位及虚线，无今厅无挂牌；未看原复印纸或到河街，不能由此定广播/通知年代。"
- 授权标识修改：`ledger.O_MAP.character_known.沈禾`
  - 原："亲见单张复印图的标题日期候船室与东埠一至六泊位及步行线；亲拍工作照，未找到挂牌或现厅，不能套通知年份。"
  - 新："亲见单张复印图的标题日期候船室与西埠一至六泊位及步行线；亲拍工作照，未找到挂牌或现厅，不能套通知年份。"
- 授权标识修改：`ledger.O_MAP.evidence.0.quote`
  - 原："中间画了长方形的候船室，往海的一侧另画一排短线，旁边标“东埠泊位一至六”，两处之间用虚线连着，注明步行通道。"
  - 新："中间画了长方形的候船室，往海的一侧另画一排短线，旁边标“西埠泊位一至六”，两处之间用虚线连着，注明步行通道。"
- 授权标识修改：`ledger.O_MAP.evidence.2.quote`
  - 原："图中候船室和东埠泊位分开，没画现厅，不能给通知定年。"
  - 新："图中候船室和西埠泊位分开，没画现厅，不能给通知定年。"
- 授权标识修改：`ledger.O_MAP.statement`
  - 原："第10章许成在河街五金铺取出的单张发灰复印图，印旧渡口场地维修附图、2011年11月，画候船室、东埠泊位一至六，虚线注明步行通道；未绘现客运厅或挂牌位置。"
  - 新："第10章许成在河街五金铺取出的单张发灰复印图，印旧渡口场地维修附图、2011年11月，画候船室、西埠泊位一至六，虚线注明步行通道；未绘现客运厅或挂牌位置。"
- 授权标识修改：`ledger.O_NOTICE.evidence.0.quote`
  - 原："第一行尚清楚：“东埠线乘客请至客运码头候船。”下面被撕去大半，只剩“另行通知”四个字。没有日期，也没有告诉人怎么走的图。"
  - 新："第一行尚清楚：“西埠线乘客请至客运码头候船。”下面被撕去大半，只剩“另行通知”四个字。没有日期，也没有告诉人怎么走的图。"
- 授权标识修改：`ledger.O_NOTICE.statement`
  - 原："第6章沈禾与唐穗在旧站散页筐发现半张油印通知，第一行东埠线乘客请至客运码头候船，下部只余另行通知，无日期无路线图。"
  - 新："第6章沈禾与唐穗在旧站散页筐发现半张油印通知，第一行西埠线乘客请至客运码头候船，下部只余另行通知，无日期无路线图。"
- 授权标识修改：`ledger.O_NOTICE.tags.0`
  - 原："东埠线"
  - 新："西埠线"
- 授权标识修改：`ledger.O_PLATE.character_known.唐穗`
  - 原："第7章首次当面听沈禾完整口述东埠六码头、右下两短线、正反无日期、首日独开未拍照抄字；听说昨午已告周砚，原牌仍箱内店后；自己未亲见。"
  - 新："第7章首次当面听沈禾完整口述西埠四号泊位、右下两短线、正反无日期、首日独开未拍照抄字；听说昨午已告周砚，原牌仍箱内店后；自己未亲见。"
- 授权标识修改：`ledger.O_PLATE.character_known.顾遥`
  - 原："第11章首次听沈完整说浅棉布与窄铜牌、东埠六码头、右下两短线、正反未找到日期、首日独开未拍抄，封后未再开，周唐仅听说；自己未见牌。"
  - 新："第11章首次听沈完整说浅棉布与窄铜牌、西埠四号泊位、右下两短线、正反未找到日期、首日独开未拍抄，封后未再开，周唐仅听说；自己未见牌。"
- 授权标识修改：`ledger.O_PLATE.evidence.0.quote`
  - 原："铜牌上写着“东埠六码头”，右下角有两条短刻线。"
  - 新："铜牌上写着“西埠四号泊位”，右下角有两条短刻线。"
- 授权标识修改：`ledger.O_PLATE.evidence.4.quote`
  - 原："浅色棉布包着一块窄铜牌，上面是‘东埠六码头’。右下角有两条短刻线。我翻过正反，没有找到日期。"
  - 新："浅色棉布包着一块窄铜牌，上面是‘西埠四号泊位’。右下角有两条短刻线。我翻过正反，没有找到日期。"
- 授权标识修改：`ledger.O_PLATE.evidence.6.quote`
  - 原："铁箱里不是纸，是浅色棉布包的一块窄铜牌。写着‘东埠六码头’，右下角两条短刻线，正反都没找到日期。"
  - 新："铁箱里不是纸，是浅色棉布包的一块窄铜牌。写着‘西埠四号泊位’，右下角两条短刻线，正反都没找到日期。"
- 授权标识修改：`ledger.O_PLATE.evidence.8.quote`
  - 原："牌上是‘东埠六码头’，右下角两条短刻线，正反没找到日期。"
  - 新："牌上是‘西埠四号泊位’，右下角两条短刻线，正反没找到日期。"
- 授权标识修改：`ledger.O_PLATE.statement`
  - 原："第2章沈禾独自打开旧铁箱，见内有窄铜牌，字为东埠六码头，右下角两条短刻线，正反无日期；周砚唐穗不在场，未拍照未抄字。"
  - 新："第2章沈禾独自打开旧铁箱，见内有窄铜牌，字为西埠四号泊位，右下角两条短刻线，正反无日期；周砚唐穗不在场，未拍照未抄字。"
- 授权标识修改：`ledger.P_KEY.custody.condition`
  - 原："新纸套包住钥匙齿，连原红棉绳入小封袋，记收取时间和罗敬名；与铁箱分开，未试锁"
  - 新："新纸套包住钥匙齿，连原蓝棉绳入小封袋，记收取时间和罗敬名；与铁箱分开，未试锁"
- 授权标识修改：`ledger.P_KEY.evidence.1.quote`
  - 原："隔着新纸套收住钥匙齿，连红棉绳一起装进小封袋，写上收取时间与罗敬的名字。"
  - 新："隔着新纸套收住钥匙齿，连蓝棉绳一起装进小封袋，写上收取时间与罗敬的名字。"
- 授权标识修改：`ledger.P_KEY.statement`
  - 原："唯一原铜钥匙，柄三角磨痕、红棉绳；罗敬从工具袋取出交沈禾暂存，未试锁。"
  - 新："唯一原铜钥匙，柄三角磨痕、蓝棉绳；罗敬从工具袋取出交沈禾暂存，未试锁。"
- 授权标识修改：`ledger.T_EAST.character_known.唐穗`
  - 原："第9章获沈述现厅；第12章看维修图工作照并问虚线是否搬筐路，沈说不能认，知道图无今厅挂牌，不认旧东埠精确位置。"
  - 新："第9章获沈述现厅；第12章看维修图工作照并问虚线是否搬筐路，沈说不能认，知道图无今厅挂牌，不认旧西埠精确位置。"
- 授权标识修改：`ledger.T_EAST.character_known.沈禾`
  - 原："撤回现箭头直定位法，亲见2011维修复印图候船室与东埠泊位分开有步行线；图无今厅、无挂牌、通知无日期，不能确定旧今沿革或铜牌挂处。"
  - 新："撤回现箭头直定位法，亲见2011维修复印图候船室与西埠泊位分开有步行线；图无今厅、无挂牌、通知无日期，不能确定旧今沿革或铜牌挂处。"
- 授权地点因果同步：`ledger.T_EAST.evidence.0.quote`
  - 原："她开始相信，今天的客运码头至少接住了旧东埠的一部分，也许地方都不用另找。"
  - 新："她开始相信，今天的客运码头至少接住了旧西埠的一部分，顺着路牌就能问到四号泊位。"
- 授权标识修改：`ledger.T_EAST.evidence.2.quote`
  - 原："你问我旧东埠，我认不准，别跟着我走错。"
  - 新："你问我旧西埠，我认不准，别跟着我走错。"
- 授权地点因果同步：`ledger.T_EAST.reader_known`
  - 原："第8章现厅六号与旧牌不能数字直配；第10章2011复印图将当年候船室和东埠泊位分画，仍无今厅/挂牌/通知年代，部分排除空间混同，旧今沿革和旧六码头精确位置仍未证。"
  - 新："第8章现厅六号是寄存编号，不能用来定位旧牌四号泊位；第10章2011复印图将当年候船室和西埠泊位分画，仍无今厅/挂牌/通知年代，部分排除空间混同，旧今沿革和旧四号泊位精确位置仍未证。"
- 授权地点因果同步：`ledger.T_EAST.statement`
  - 原："沈禾根据无日期改候船通知和现行蓝箭头，暂猜今天客运码头可能接续旧东埠、甚至位置相同；只是待实地核对的初始解释。"
  - 新："沈禾根据无日期改候船通知和现行蓝箭头，暂猜今天客运码头可能接续旧西埠，顺着现路牌能问到四号泊位；只是待实地核对的初始解释。"
- 授权标识修改：`ledger.T_EAST.tags.1`
  - 原："东埠"
  - 新："西埠"
- 授权标识修改：`timeline.9`
  - 原："第2日下午四点后：旧站同见东埠线改候船通知残页，夹硬衬与其他未辨年代页留窗边筐；沈禾放弃搭车追查，和唐穗完成当日留存单，五点半前收工。"
  - 新："第2日下午四点后：旧站同见西埠线改候船通知残页，夹硬衬与其他未辨年代页留窗边筐；沈禾放弃搭车追查，和唐穗完成当日留存单，五点半前收工。"
- 授权标识修改：`timeline.19`
  - 原："第3日下午至四点零五：沈亲见2011年11月维修图的候船室、东埠一至六泊位及步行线，获准只拍单张；许收回原复印纸。沈只消息告唐见图边界和许次日看墙说法，离铺。"
  - 新："第3日下午至四点零五：沈亲见2011年11月维修图的候船室、西埠一至六泊位及步行线，获准只拍单张；许收回原复印纸。沈只消息告唐见图边界和许次日看墙说法，离铺。"

## 核验

来源 119 项，引文 113 条；原备份685文件重新核哈希。state来源按消费时前一状态重建字节核验其SHA-256，其余来源核对当前文件。T_PRIVATE 全字段和4条证据保留，第4章以后罗敬与顾遥的私因未知边界沿原登记延续；没有添加author_truth。

异常：T_PRIVATE full semantic and all evidence preservation。详细机械差异及逐章快照比较见 audit.json。
