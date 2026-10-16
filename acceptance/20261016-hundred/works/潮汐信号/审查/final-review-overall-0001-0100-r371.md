# 《潮汐信号》当前1—100章总体模型报告（r371）

模型实读记录时间：2026-10-16T15:26:21.596Z。登记前版本 r371，state SHA256 414cd9b1c04a9d5923de41e8f51ce848612bed63985d557daf22d9e38f91a606。范围 1—100，当前原生模型已实际完整阅读所绑定的正文；行覆盖脚本只检查记录完整。非真人盲读、市场测试或正式发布验收。

## 结论与真实范围

本轮同一默认Codex原生模型已实际完整阅读当前1—100章正文。开场绑定为100章r350，state SHA256 c3ab9e7d347d720c41480441ee6996f3ed012998c292aa6d5d5bbd4c390ce6b9；最终正文状态r371。先读91—100核实定点反馈，随后逐章读1—90；正文均真实返回当前模型，每章40行分段，非脚本代读。1—90正文未变，91—96修后完整补读；97—100再次完整读过。当前版共7822行，逐章路径、SHA、实际范围和原始返回记录在文末及阶段reading.jsonl，脚本覆盖只能证明记录完整。没有遗留未补读的正文范围。17份每六章笔记（末组97—100四章）保存原实际时间，另有修后88—93、91—96、94—99及97—100报告；第二次重登只补首锚，正文SHA不再变，新报告明确沿用真实阅读日期，旧报告不删也不重新标有效。

当前设定、人物、114条时间线、141条在用ledger及13份有效卷契约均已完整读取；按当前有效journal逐单元重放1—100，逐单元读了实际语义变化，与正文核对。未读取其他阶段请求、结果或旧状态补剧情。本报告是模型复查和草稿质量判断，不是真人盲读、市场测试或正式发布验收。

## 已处理的确认项

|范围|原问题与最小处理|保留事实|
|---|---|---|
|91:41|删耳朵全登记到同一行的多余审核口吻|葛找零、陶背向，听到多少未知；只有老人明确获完整告知|
|91:69|把主语因果不清的怕回家不在等语改为怕再去扑空、多跑一趟|只是老人当下说去问没带回，沈没有亲见，不增修好、交还、店主新行动或新约|
|92:89、95:19|人物本子/口述中的第三十一章两页改为后来新印的缺名两页|27单页与31新印两页仍分物；报告与ledger正常章号索引保留|
|93:37|删当下这句沿无形线自动回何邱的解释|仅陈父女本次获告，何邱未获这次新回话|
|94:85|删借听见了结全镇已告尾句的审核式收束|只留答应、机针、收电话、蛋与橘皮动作；回告范围与不取私纸不变|
|94:77|楼下分路改门外分路，人物/时间线/引文同步|4章27行明确堤后平房，27/36后续同屋没有搬家；不改固定旧章，不编迁居|
|96:17|删无具体前文支持的椅脚薄片类比|81四元垫片是桌脚，84/88/95继续桌稳；不挪桌垫到椅，不改旧带拖椅似声，不模拟认源|
|93起罗知识|纠正唐何读后结果一并未获的登记及后续历史，T_RO_VISIT_93同改|40:11已告罗唐37读完还沈无拷，何40完成结果到94才告；94再报告唐不等首次获知|
|94起归宿纸总线|T_VOICE_CONSENT.statement明分92时待核与94本次取认归票夹内层原抽屉、仍罗管|沈未带走，此前翻票日期与以后流转未知；37还沈的自页仍不同物|
|97起唐时间|人物/时间线的16前通话收窄为60日午后沈回家后|正文只写回家四点前，随后换碟消息与六分多电话未给结束分钟；99明确15:46消息照留|
|98起素姐知识|无旧纸音知情改本场未谈、未新增相关登记|保留两份取餐、自带空盒布套、母亲及晚餐选择；不反向编知情|

正文实际改6章、8个定点操作，没有为字数加同义审核段。25—100全部仍在2400—3200 Han；91—96分别2455、2550、2467、2456、2469、2450 Han（去标题计正文）。固定1—24按原约保留，正文和原登记链都未改；实际1—90整条原登记链也未变。没有确认固定对照自身必须修的硬问题，不把94新穿帮归咎于4章。

## 修订链及引文保留

r350冻结完整作品833文件与原91—100登记数据/真实journal后，正式rewind91到r351，逐章重登91—100到r361。终检发现阶段辅助changesBetween对新建物件只取本章锚，漏继承P_QIU_SINGLE_27和P_RO_LOCATION_NOTE_27各自27章原首锚。此为本阶段辅助重建遗漏，不是产品CLI哈希或语义规则bug。r361完整候选另冻结869文件，保留首次输入与失败stderr；回读27:61—97原场景，正式rewind92到r362，逐章重登92—100到r371，未手改state/journal，未删正文绕保护。最终141个有效ID、introduced/due、原初观察与全部1155条旧引文保留，94总线另有两条本次实际取收引文，总1157条。27旧首锚与94同一41行的两个不同引文均保留，不按unit+line去重。所有受变正文引文实际SHA/行/原句已核。

每次context原返包、完整实际指引、fresh record-template、实际record输入与SHA、CLI真实argv/退出码/分流原输出都保存于阶段inputs和inputs-pass2。主与内置longform源码SHA均为b8dc2143bfbef82beaabf8362a0c8ddee554f81f9506ec12c24b84966eac497d；指引实际包含追踪章节号/账本ID不自动成为正文事实。提示存在只证明运行时来源，不证明语言自动正确。

## 贯穿全书的事实与回调核对

1—24的证据推进由猜测到有来源的有限结论：2章沈独见铜牌西埠四号、两刻线、无日期、不拍不抄；5才口述周，7才口述唐，14唐才亲见原牌/当次照片，唐离后顾才获完整口述，不能从最终记录倒推人人最初在场。4罗未参加短听；23罗才完整听工作转录。13黄灯两短原片支持岸端留人暂停放行，15罗保首说同时改口，年月仍不可见。16原铜钥只证现柜能开，2010例检不替无日声音定年；20口信册行与24原签/回记/调度页、邱独立认范围才接到2012/9/17班次，不能扩大为全带同日、所有人已登船或男钟来源已明。19/21补录与旧片近似边界留原，96回听仍无新增答案。24交存后原箱/带/钥/纸簿/原灯各有不同接管人，罗周24电话不是完整归宿告知，25/27后续实际传递没有倒填。

纸页主线严格分物：27邱当面改单页留邱，92才实际核到上柜私册且过去入册日不明；27罗另收归宿纸，94才亲见取认收回，37沈自页不替它。31原缺名两页初见不补名；35退原页、48细夹松第二页滑出、53沈口述邱、54原袋两页两夹实交邱柜上盒、60何仅知归还、72才口述知滑页/两夹、83扣盒入下柜但不看内页、95何仅获单页区别、97才重新开盒实核两页两夹、98才新告何、100才回邱收到。35使用两页、38大字四页实样、标改试样与电子旧稿不混；89三袋/本机退出说明、90这只盘对应旧稿、95旧90秒/纸自页/本机、96盘对应旧自述逐处处理，不把一次找到或一张外说明说成世界载体全清。

声音劳动有真实钱与时段后果：29八分钟600及顾另40、34两日1600、43另一次240、51两小样100与后来的三日2700/勘看180/两小时480分笔。72的3360仅后三笔合计，交通128不是收入，58准备80不抹掉；81—84新12分版480不与前次480混。陆旧椅押金与57—64新场地360/退240/项目担120分开，票据在64实际交梁。程第三、第四遍都在62正文，选择第三有依据；69温按原组记录留回等待，未以新声伪旧余带，也不把局部小样核对升级整课验收。

管房与费用：何常用钥、严备用钥、公夹及何私四折纸分物。35旧17:10安排在37才口述已交样，46是另一套孟三页90，49新项误时不是旧90没交。42顾调门90已实收，50是返严垫90不重付顾；29/31/33三轮各60含准备收尾，总180在52/55/56逐轮实结，不冲何旧款。56旧已核240与两段未清分开，98仍只何当前口述旧两段未清，不能凭due56到期结掉。陈一次无偿值守真实结束、锁钥交还各有现场/口述限度；何或严消息收到不变成亲见全部值守、陈到家或交付已完成。

雨水/有货车/临时坐处：36原两红砖、半月缺口朝围挡、水先砖后沟、细泥的初观保留；42沈雨未停先离，48仅邹回顾后来才过。54范才收斜撑、宽筐干天过，短放菜袋非有靠背坐处。71雨纸堵清扫后本次宽车真过，73才识经办乔，75原筐转弯要停卸收尾板且邹先离；46/48两次试安排不能先给已离邹知道，79乔才实际告。77小件/79换丁板车各真做，85缓发当批后续88只乔回述52未送53减量，眼前55是另一车。66原木椅归葛，76老人自己试角度/反光，77/80三晨、86旧末晨/新周约、88首晨、91局部、98末晨分别有现场和回顾来源；陶不被添下班清位，老人不被消费或坐满绑住。98收期纸只结束这段有限承诺，不是公共阅览间重开或永久全路雨通。due88按审查章号阶段回收，不是第88故事日。

私人关系亦按实际发生推进：23先留一月，74第44日起未来一月镇家选择不在87/99重起；接车、饭盒清洗到64实际还周、鞋由周自付、84杯画交沈/87碗画留周、各钥各家逐项保留。62如约电话仍漏听有后果，78雨备见面确实没看球，81沈独处和周球场仅消息，96周想休是真实选择，99才实际共饭亲吻/当前家选择。100念的是59新半页，不将61新私话倒填成59原稿已有。

三轮旧章修改后的原事实与回调按当前journal逐单元重放核对，没有用history标签保留已改掉的旧世界事实；真实过去尚未完成的欠款、未知来源、未核中途日则保留。48曾怀疑范收斜撑被提前，但实际当章登记只有干路观察，54才有收撑，未将该候选制造成缺陷。

## 人物、语言与读者体验

沈的急于配出答案逐步转为肯付工时、肯承认漏听、肯留自己的饭；顾先处理真实客户/机器保护与工位费用，唐有搬迁日单和下班，罗要自己存纸、修眼镜、择菜且不必交代私因，邱先做补衣生意也可撤回、拒橘、补自己枕套，何既管屋又接排版、记小票镜布且可自己决定来听，周有班与球场、买鞋和想休息。这些具体利益与语气能在对话和动作中辨认，不只在人物表上成立。菜车、搬板、门钥、平放纸页、盒夹和窄厨房相让都有空间动作支持。

节奏的强项在小事产生后果：原夹松使纸真滑出，补袋要倒物解结，休息不够会漏听伴侣，按一次服务付费才能让人退出无偿常班。中后段仍明显反复先问范围、记下、回告、回家做饭的场景骨架，否定式解释较多，读者的发现感与推进速度会降低；这是本稿尚有的阅读代价，不能从全部机械绿灯推出商业追读成立。本轮按作者要求只修已定位的受阻句及实质冲突，保留有具体后果的场景，不将正常记事/没有等词机械禁用，也不为个人审美全书重写。未以词频扫描替代逐句实读，未为证明有修复而凑缺陷；未做外部读者验证或评分保证。

## 仍然未解决的作品问题与有效边界

旧余带钟/拖椅似声具体来源、男声身份、各段是否同日、剪者及目录命名人的用意仍未知；24已确认的通知用途和班次不因此翻案。原物归属/罗私人失约原因、陆旧椅扣款及其出资最终责任、何旧两段款、52后续余货价格仍无足够正文闭环，不编出资人或归属答案。27邱页首次入册日和罗中途翻票日仍不明；未来其他载体/未知受话者不宣全同步。阅览间没有新固定开放时段，葛椅约到期不自动常设；长期收入、永久住处/同居也没有被一次收款或亲密行为保证。上述未知或未完与已确认的错句/错登记不同，继续保留其原status和due；T_VOICE_CONSENT、T_PAGE_PAIR、T_SOUND_CONTEXT等partial不为100到期强改resolved。

本轮已确认且在25—100授权范围内的问题均已正式修复；没有把已确认项留作用户后续待办。产品源码未修改，未确认需主会话修的产品bug；本阶段辅助重建漏首锚已按真实失败与第二次正式链修复。最终status/check/doctor及独立导出逐字结果由阶段final-review.md/result.json另行记录，本报告的实读结论不借这些机械检查代替。

## 正文版本与返回记录

```json
[
  {
    "unit": 1,
    "path": "正文/0001-六天的空位.md",
    "sha256": "3b7caf64e475d1e34dd812133a10b122335992c8389482202b0e82401f0a71f6",
    "total_lines": 81,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:41:35.065Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-34-983Z-6963839a-dcc8-4576-a7b7-6ef46bc859d1-inner-read-1-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-34-983Z-6963839a-dcc8-4576-a7b7-6ef46bc859d1-inner-read-1-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:41:35.150Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-35-080Z-32f0b45e-f088-4fcb-8eb5-1ee67a31aaa3-inner-read-1-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-35-080Z-32f0b45e-f088-4fcb-8eb5-1ee67a31aaa3-inner-read-1-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 81,
        "date": "2026-10-16T14:41:35.237Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-35-164Z-2d724f9d-abda-497b-bd72-6d66228d7f9b-inner-read-1-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-35-164Z-2d724f9d-abda-497b-bd72-6d66228d7f9b-inner-read-1-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 2,
    "path": "正文/0002-箱子里面.md",
    "sha256": "7d09099dd8a2e257583d7b1ba465a6793c55b459e1676569ed9713b86ac8cf3e",
    "total_lines": 65,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:41:40.520Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-40-433Z-08390058-c93d-4f11-8f71-738f7e591bd3-inner-read-2-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-40-433Z-08390058-c93d-4f11-8f71-738f7e591bd3-inner-read-2-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 65,
        "date": "2026-10-16T14:41:40.611Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-40-533Z-9d5e1d4f-d17a-489f-91b7-07fe353e496d-inner-read-2-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-40-533Z-9d5e1d4f-d17a-489f-91b7-07fe353e496d-inner-read-2-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 3,
    "path": "正文/0003-蓝棉绳.md",
    "sha256": "682ef2845eec5cefe1f793c8b58d11983bd472341d0965f1cc8c685a9ace15df",
    "total_lines": 77,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:41:44.610Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-44-534Z-33d56436-529f-4ab2-aee1-012658ce227a-inner-read-3-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-44-534Z-33d56436-529f-4ab2-aee1-012658ce227a-inner-read-3-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 77,
        "date": "2026-10-16T14:41:44.715Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-44-626Z-e273aebe-4a9b-4873-9ef2-85a7023c875a-inner-read-3-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-44-626Z-e273aebe-4a9b-4873-9ef2-85a7023c875a-inner-read-3-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 4,
    "path": "正文/0004-先停在这里.md",
    "sha256": "c441029c91862cdc9a1b3d8d630854af8fbc6ec1df4a0d5cf3af92458d1429bd",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:41:48.885Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-48-807Z-20fd76a4-b2f8-4e36-a64a-0c6322e868fa-inner-read-4-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-48-807Z-20fd76a4-b2f8-4e36-a64a-0c6322e868fa-inner-read-4-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T14:41:48.971Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-48-898Z-fc50282c-478b-4ed5-83b4-47574a9d7f70-inner-read-4-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-48-898Z-fc50282c-478b-4ed5-83b4-47574a9d7f70-inner-read-4-41.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:13:02.325Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-13-02-229Z-8716eedd-019b-472a-86cb-fb4df7c3dbbc-outer-recheck4.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-13-02-229Z-8716eedd-019b-472a-86cb-fb4df7c3dbbc-outer-recheck4.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 5,
    "path": "正文/0005-说给一个人听.md",
    "sha256": "14c9f62a68d08a59fcfa18d191b8fdd9c369308fba72900b8d2d5d1387149df2",
    "total_lines": 87,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:41:59.585Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-59-505Z-ec7b3bf4-d21a-4d02-91de-699ec3445768-inner-read-5-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-59-505Z-ec7b3bf4-d21a-4d02-91de-699ec3445768-inner-read-5-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:41:59.680Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-59-599Z-192fa4a5-3000-4e5f-b149-85e1fde72371-inner-read-5-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-59-599Z-192fa4a5-3000-4e5f-b149-85e1fde72371-inner-read-5-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 87,
        "date": "2026-10-16T14:41:59.778Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-59-693Z-9f0e51b9-d062-482b-8bd9-4a30cb3c9e15-inner-read-5-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-59-693Z-9f0e51b9-d062-482b-8bd9-4a30cb3c9e15-inner-read-5-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 6,
    "path": "正文/0006-箭头朝东.md",
    "sha256": "83d3084e8f510235fc980b8bd0bb899b1310f4a6b97ae1a93832a95b2a10e78e",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:42:03.996Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-42-03-897Z-0514fdf9-b9c5-4bcc-a8c8-8e9bffb3ae69-inner-read-6-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-42-03-897Z-0514fdf9-b9c5-4bcc-a8c8-8e9bffb3ae69-inner-read-6-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T14:42:04.083Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-42-04-009Z-5b529435-80de-45df-b747-b34881fb471e-inner-read-6-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-42-04-009Z-5b529435-80de-45df-b747-b34881fb471e-inner-read-6-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 7,
    "path": "正文/0007-先走出去.md",
    "sha256": "41d3a2bdfae2cd7ec4404e05680a8c9a708cc470efc5c518edeec54ba60b80fa",
    "total_lines": 77,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:43:10.243Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-10-167Z-f4945e40-0618-41e3-9cf5-5c8f0d97e3fe-inner-read-7-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-10-167Z-f4945e40-0618-41e3-9cf5-5c8f0d97e3fe-inner-read-7-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 77,
        "date": "2026-10-16T14:43:10.327Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-10-257Z-63f577ae-d8d6-4d4a-93f0-1dada657f086-inner-read-7-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-10-257Z-63f577ae-d8d6-4d4a-93f0-1dada657f086-inner-read-7-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 8,
    "path": "正文/0008-六号窗口.md",
    "sha256": "90167655e747e966bfaa19355f816ca06386729674c123909fd09746bee36445",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:43:14.921Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-14-828Z-fe2feedd-bbe4-45fc-91ef-5c951f7d1f35-inner-read-8-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-14-828Z-fe2feedd-bbe4-45fc-91ef-5c951f7d1f35-inner-read-8-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T14:43:15.026Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-14-938Z-43304326-71a1-4693-93fd-8ed3afd1318a-inner-read-8-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-14-938Z-43304326-71a1-4693-93fd-8ed3afd1318a-inner-read-8-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 9,
    "path": "正文/0009-灯还留着.md",
    "sha256": "a60c2e14dda21e97f3292c71a63ea2b5b7a9d22ae712c4afc1f66dbfa1c7106e",
    "total_lines": 79,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:43:19.256Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-19-181Z-3c9f4cc7-dad4-4d09-9938-f9cd6777ae97-inner-read-9-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-19-181Z-3c9f4cc7-dad4-4d09-9938-f9cd6777ae97-inner-read-9-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 79,
        "date": "2026-10-16T14:43:19.340Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-19-270Z-6b3efa07-bea1-4f74-99a4-ec8d925ee766-inner-read-9-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-19-270Z-6b3efa07-bea1-4f74-99a4-ec8d925ee766-inner-read-9-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 10,
    "path": "正文/0010-图纸的折口.md",
    "sha256": "0a3f2507444f8afe16d680b3e33a65f139941763fc9d185e139f8ea2aafa949e",
    "total_lines": 73,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:43:23.856Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-23-784Z-86bfda68-b5ac-4867-8897-607d1a3814db-inner-read-10-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-23-784Z-86bfda68-b5ac-4867-8897-607d1a3814db-inner-read-10-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 73,
        "date": "2026-10-16T14:43:23.944Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-23-870Z-62a8a442-3f1a-4e48-a591-e205b54c697e-inner-read-10-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-23-870Z-62a8a442-3f1a-4e48-a591-e205b54c697e-inner-read-10-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 11,
    "path": "正文/0011-空出来的半小时.md",
    "sha256": "b0cbd3c74cbfd713843f9c5dd66df5ae16fabf46073de9845a6041261edbfa31",
    "total_lines": 75,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:43:28.161Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-28-085Z-ccc30685-bfba-475a-b77d-0a4d5fc4efe2-inner-read-11-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-28-085Z-ccc30685-bfba-475a-b77d-0a4d5fc4efe2-inner-read-11-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T14:43:28.248Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-28-175Z-0a1a84df-9989-453e-8d62-169ba99487d9-inner-read-11-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-28-175Z-0a1a84df-9989-453e-8d62-169ba99487d9-inner-read-11-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 12,
    "path": "正文/0012-留下空行.md",
    "sha256": "6d1dd0ac58781f88250bbc9e31eb0ef61e201fa7b84db5226f0324560a4176e4",
    "total_lines": 71,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:43:33.576Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-33-502Z-11d232db-ef49-4817-aaec-62a2aa4ec35d-inner-read-12-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-33-502Z-11d232db-ef49-4817-aaec-62a2aa4ec35d-inner-read-12-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 71,
        "date": "2026-10-16T14:43:33.664Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-33-589Z-aba5fcf7-983e-4451-a26b-0313b1ddd665-inner-read-12-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-33-589Z-aba5fcf7-983e-4451-a26b-0313b1ddd665-inner-read-12-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 13,
    "path": "正文/0013-铁门背面.md",
    "sha256": "92e586a06ddb4925a65e69b700e3bcf8f08f0b0088e8d4395653042b61680456",
    "total_lines": 65,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:43:56.096Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-56-019Z-aa8c14be-3c81-4da6-8e47-3f8431e48590-inner-read-13-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-56-019Z-aa8c14be-3c81-4da6-8e47-3f8431e48590-inner-read-13-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 65,
        "date": "2026-10-16T14:43:56.183Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-56-110Z-f58732e7-fc6f-4d57-a933-21bc62fbc202-inner-read-13-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-43-56-110Z-f58732e7-fc6f-4d57-a933-21bc62fbc202-inner-read-13-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 14,
    "path": "正文/0014-让她看见.md",
    "sha256": "b18387aa1c6a78b9cad0fce07d12f35848a04964c447b2b0ac2fa711fba28724",
    "total_lines": 83,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:44:06.488Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-06-417Z-5f7d2980-6462-4389-9d4e-a84423285d8a-inner-read-14-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-06-417Z-5f7d2980-6462-4389-9d4e-a84423285d8a-inner-read-14-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:44:06.569Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-06-501Z-e9db7f34-e66f-4881-ab47-dca2f44611d1-inner-read-14-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-06-501Z-e9db7f34-e66f-4881-ab47-dca2f44611d1-inner-read-14-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 83,
        "date": "2026-10-16T14:44:06.649Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-06-581Z-df7f94aa-4da7-4646-9dc6-d69a3d8630de-inner-read-14-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-06-581Z-df7f94aa-4da7-4646-9dc6-d69a3d8630de-inner-read-14-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 15,
    "path": "正文/0015-他说多的那一句.md",
    "sha256": "2600a03d13d7c6004a5b6fa671162486b19f77518303d3ad2ed0fbd07df86bdb",
    "total_lines": 89,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:44:11.083Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-11-001Z-6c268736-9496-400a-87c9-5e9620ec7825-inner-read-15-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-11-001Z-6c268736-9496-400a-87c9-5e9620ec7825-inner-read-15-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:44:11.175Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-11-096Z-e8efb60a-6db5-4320-bd79-25c6f26a62e5-inner-read-15-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-11-096Z-e8efb60a-6db5-4320-bd79-25c6f26a62e5-inner-read-15-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 89,
        "date": "2026-10-16T14:44:11.258Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-11-188Z-c11fc05b-8626-4495-9d4e-fde68a558645-inner-read-15-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-11-188Z-c11fc05b-8626-4495-9d4e-fde68a558645-inner-read-15-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 16,
    "path": "正文/0016-开得动的锁.md",
    "sha256": "91db5857351b88db52624f9f4856a2f0131f29ad3a28495a7a257e76c9ff2e11",
    "total_lines": 59,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:44:15.221Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-15-129Z-591f0a4b-5012-45c2-9895-ce92757b5a0d-inner-read-16-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-15-129Z-591f0a4b-5012-45c2-9895-ce92757b5a0d-inner-read-16-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 59,
        "date": "2026-10-16T14:44:15.319Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-15-235Z-fc1c77d2-c177-46fd-89a5-b8f676dd7d9a-inner-read-16-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-15-235Z-fc1c77d2-c177-46fd-89a5-b8f676dd7d9a-inner-read-16-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 17,
    "path": "正文/0017-听之前的工钱.md",
    "sha256": "a57f36b642d6a32973fb70d49d3a7e523175369c3bb0511b4db72dc41bdc8fe7",
    "total_lines": 79,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:44:20.736Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-20-656Z-e0e3bb9c-3fea-4180-988f-305ed23fa160-inner-read-17-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-20-656Z-e0e3bb9c-3fea-4180-988f-305ed23fa160-inner-read-17-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 79,
        "date": "2026-10-16T14:44:20.836Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-20-753Z-dd9fa9af-d46c-495a-99f0-093192ee49c8-inner-read-17-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-20-753Z-dd9fa9af-d46c-495a-99f0-093192ee49c8-inner-read-17-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 18,
    "path": "正文/0018-没有报出的名字.md",
    "sha256": "69c847e4210377eab6163199f8cba6c0197edd1e04bbf7edb8326b6f20481b6a",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:44:25.329Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-25-251Z-9aa27242-8572-44b8-bb33-f001f894ab46-inner-read-18-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-25-251Z-9aa27242-8572-44b8-bb33-f001f894ab46-inner-read-18-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T14:44:25.416Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-25-341Z-fcf572da-91ce-4910-ad79-28786d6f1f6d-inner-read-18-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-25-341Z-fcf572da-91ce-4910-ad79-28786d6f1f6d-inner-read-18-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 19,
    "path": "正文/0019-两张照片之间.md",
    "sha256": "896590146f4ef7a69812c857215b6ebc27a28f5f91f439c6905877c8534a3d3e",
    "total_lines": 67,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:44:57.182Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-57-105Z-726ef1e4-0d63-41a4-b052-30b43a3fd8f5-inner-read-19-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-57-105Z-726ef1e4-0d63-41a4-b052-30b43a3fd8f5-inner-read-19-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 67,
        "date": "2026-10-16T14:44:57.273Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-57-196Z-e31886bd-9433-4a65-a0fb-3a63591c001d-inner-read-19-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-44-57-196Z-e31886bd-9433-4a65-a0fb-3a63591c001d-inner-read-19-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 20,
    "path": "正文/0020-接话的人.md",
    "sha256": "bf22ebf63322a09ae97b00efd77101538202e6c958530a7033a342c651071bc0",
    "total_lines": 57,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:45:01.464Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-01-389Z-3052885c-7dc0-4437-b8f0-bda4baa89e71-inner-read-20-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-01-389Z-3052885c-7dc0-4437-b8f0-bda4baa89e71-inner-read-20-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 57,
        "date": "2026-10-16T14:45:01.550Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-01-478Z-4aa3480a-3642-466a-a6a8-743dfcdc8bea-inner-read-20-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-01-478Z-4aa3480a-3642-466a-a6a8-743dfcdc8bea-inner-read-20-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 21,
    "path": "正文/0021-补上的开头.md",
    "sha256": "87a504ba036f2df2b1266bd4aebd5908bc17f0cb6498c095ea4c4149bd7812ee",
    "total_lines": 65,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:45:05.937Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-05-856Z-2f5f30ac-fa49-4817-89b2-0205ff2bfc1c-inner-read-21-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-05-856Z-2f5f30ac-fa49-4817-89b2-0205ff2bfc1c-inner-read-21-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 65,
        "date": "2026-10-16T14:45:06.024Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-05-952Z-e8b89ed0-6d76-43ef-8170-bd86557b67a8-inner-read-21-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-05-952Z-e8b89ed0-6d76-43ef-8170-bd86557b67a8-inner-read-21-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 22,
    "path": "正文/0022-她跑过的路.md",
    "sha256": "e5349b39d7e7a827df65fa4e918cbe30b3f83a2bd875bfaf6a3305c22440a517",
    "total_lines": 75,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:45:10.952Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-10-878Z-639b5f8e-4e04-42bf-9248-cd6428565818-inner-read-22-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-10-878Z-639b5f8e-4e04-42bf-9248-cd6428565818-inner-read-22-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T14:45:11.038Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-10-965Z-2ca515db-e608-4b8c-b0a8-489b3c1998b4-inner-read-22-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-10-965Z-2ca515db-e608-4b8c-b0a8-489b3c1998b4-inner-read-22-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 23,
    "path": "正文/0023-留一顿饭的时间.md",
    "sha256": "6055a8774339c7dc512f27b9f8de6ed7c5aa2a8cb0ad08bebc87737e0cda0253",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:45:15.333Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-15-244Z-6fc9e8f9-e790-493a-adaf-f7783d7d222f-inner-read-23-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-15-244Z-6fc9e8f9-e790-493a-adaf-f7783d7d222f-inner-read-23-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T14:45:15.436Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-15-347Z-fe68318a-5e49-4e58-a934-48090eaf719f-inner-read-23-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-15-347Z-fe68318a-5e49-4e58-a934-48090eaf719f-inner-read-23-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 24,
    "path": "正文/0024-接下去的人.md",
    "sha256": "9285cbde3bc6bec030c90ef3eb0bd27ca6c9816ba0bc2d2f9435397841428a53",
    "total_lines": 47,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:45:19.862Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-19-791Z-297718b7-7de3-4b85-97af-dbee3dd05ea9-inner-read-24-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-19-791Z-297718b7-7de3-4b85-97af-dbee3dd05ea9-inner-read-24-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 47,
        "date": "2026-10-16T14:45:19.944Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-19-876Z-06990ba6-ff96-433b-b89e-9624daaeaf8e-inner-read-24-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-45-19-876Z-06990ba6-ff96-433b-b89e-9624daaeaf8e-inner-read-24-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 25,
    "path": "正文/0025-两个人的菜.md",
    "sha256": "9ef7dddde34c9c7c2d9f7da3015f2c680965f8beef93ad97606850ee378002b3",
    "total_lines": 111,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:46:00.733Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-00-649Z-3278b35d-fe15-4d8a-91e4-47f79f37ff8b-inner-read-25-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-00-649Z-3278b35d-fe15-4d8a-91e4-47f79f37ff8b-inner-read-25-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:46:00.825Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-00-747Z-39bc71a9-cb0f-477b-945a-caec5a65f1cf-inner-read-25-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-00-747Z-39bc71a9-cb0f-477b-945a-caec5a65f1cf-inner-read-25-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 111,
        "date": "2026-10-16T14:46:00.912Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-00-837Z-5d995760-595e-49de-8cfb-fa8e3ac5492d-inner-read-25-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-00-837Z-5d995760-595e-49de-8cfb-fa8e3ac5492d-inner-read-25-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 26,
    "path": "正文/0026-下午两点半的房间.md",
    "sha256": "fe8f3e39efd777f7cba573728dc2dfcd34293e5af6a402afb7eb583b46f8ed74",
    "total_lines": 105,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:46:05.229Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-05-154Z-c3f68f14-4837-4597-84de-e3579552e397-inner-read-26-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-05-154Z-c3f68f14-4837-4597-84de-e3579552e397-inner-read-26-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:46:05.313Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-05-243Z-e4a1dbb6-356b-45fe-b794-462e9da1b5fb-inner-read-26-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-05-243Z-e4a1dbb6-356b-45fe-b794-462e9da1b5fb-inner-read-26-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 105,
        "date": "2026-10-16T14:46:05.393Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-05-325Z-f6fae077-513c-4e3f-af13-13cade4ded6f-inner-read-26-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-05-325Z-f6fae077-513c-4e3f-af13-13cade4ded6f-inner-read-26-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 27,
    "path": "正文/0027-他愿意留下的那一段.md",
    "sha256": "c7b9105e0b8ee7589ae4db62c1707228dedc6f13d91c351c47b8d05cc2a81755",
    "total_lines": 97,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:46:10.654Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-10-577Z-1b7fd543-80db-457b-a56f-ceb75973537a-inner-read-27-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-10-577Z-1b7fd543-80db-457b-a56f-ceb75973537a-inner-read-27-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:46:10.738Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-10-667Z-9b34c145-6bae-4d01-b24b-c30dbb0061ce-inner-read-27-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-10-667Z-9b34c145-6bae-4d01-b24b-c30dbb0061ce-inner-read-27-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 97,
        "date": "2026-10-16T14:46:10.819Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-10-751Z-8c1ecade-2027-42a6-855d-79e2cf9d8043-inner-read-27-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-10-751Z-8c1ecade-2027-42a6-855d-79e2cf9d8043-inner-read-27-81.stdout.raw.txt"
      },
      {
        "from": 61,
        "to": 97,
        "date": "2026-10-16T15:21:05.939Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-21-05-840Z-37a74e3e-d9ea-4473-a9e4-4326827ec200-outer-origin27-reanchor.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-21-05-840Z-37a74e3e-d9ea-4473-a9e4-4326827ec200-outer-origin27-reanchor.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 28,
    "path": "正文/0028-围挡外的一条路.md",
    "sha256": "c8835b6dc636b2dc53bb3f62c3b684f21a320041904e58e0ac420ed6ae25ab8c",
    "total_lines": 91,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:46:15.530Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-15-437Z-c2f6ed17-eba6-4f99-93ad-a56bf149651a-inner-read-28-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-15-437Z-c2f6ed17-eba6-4f99-93ad-a56bf149651a-inner-read-28-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:46:15.622Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-15-544Z-772e954f-eddc-4963-b8c6-06e58298018f-inner-read-28-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-15-544Z-772e954f-eddc-4963-b8c6-06e58298018f-inner-read-28-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 91,
        "date": "2026-10-16T14:46:15.713Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-15-635Z-9a26dc5b-078f-46e2-8338-fb47f941d815-inner-read-28-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-15-635Z-9a26dc5b-078f-46e2-8338-fb47f941d815-inner-read-28-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 29,
    "path": "正文/0029-收得到的工钱.md",
    "sha256": "77576bcf7c1e14710edf4d2545296943762673684ddce7e6eb010001bfee7f03",
    "total_lines": 103,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:46:21.212Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-21-135Z-8f526ba2-4bc0-4a00-ae56-fdd01fa3b6f9-inner-read-29-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-21-135Z-8f526ba2-4bc0-4a00-ae56-fdd01fa3b6f9-inner-read-29-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:46:21.297Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-21-226Z-2ab6166a-0d3e-4921-9390-8f965a928fe5-inner-read-29-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-21-226Z-2ab6166a-0d3e-4921-9390-8f965a928fe5-inner-read-29-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 103,
        "date": "2026-10-16T14:46:21.384Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-21-310Z-294e84e7-adda-4316-aac4-68ee806b92ec-inner-read-29-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-21-310Z-294e84e7-adda-4316-aac4-68ee806b92ec-inner-read-29-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 30,
    "path": "正文/0030-桌子这一头.md",
    "sha256": "1c1c87aa5a98e47b741f479180291eb30693d4c88a864598677c9b96c8e23a6a",
    "total_lines": 83,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:46:26.656Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-26-573Z-3eb71938-8f5f-4f24-861b-4cf88e6dce8d-inner-read-30-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-26-573Z-3eb71938-8f5f-4f24-861b-4cf88e6dce8d-inner-read-30-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:46:26.739Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-26-670Z-2bff5150-48ff-4916-b1a1-a80c1adc73c1-inner-read-30-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-26-670Z-2bff5150-48ff-4916-b1a1-a80c1adc73c1-inner-read-30-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 83,
        "date": "2026-10-16T14:46:26.824Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-26-751Z-9dd42bf5-7915-423c-ab17-c4fb915c8e4d-inner-read-30-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-26-751Z-9dd42bf5-7915-423c-ab17-c4fb915c8e4d-inner-read-30-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 31,
    "path": "正文/0031-午前的答复.md",
    "sha256": "8c00bb6dc2ed57fbd2183990ea01b41ccb5a3656eb22a118c19c724d75eb76d4",
    "total_lines": 87,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:46:55.377Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-55-296Z-d46adc10-15f2-45cc-b3de-8effcd7ca8d3-inner-read-31-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-55-296Z-d46adc10-15f2-45cc-b3de-8effcd7ca8d3-inner-read-31-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:46:55.464Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-55-391Z-78ac9588-671c-4b32-a63d-7b36ebc03bf3-inner-read-31-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-55-391Z-78ac9588-671c-4b32-a63d-7b36ebc03bf3-inner-read-31-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 87,
        "date": "2026-10-16T14:46:55.547Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-55-477Z-c26cf338-4b92-4d20-9e3d-ceb5c46fd687-inner-read-31-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-46-55-477Z-c26cf338-4b92-4d20-9e3d-ceb5c46fd687-inner-read-31-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 32,
    "path": "正文/0032-椅子挪开以后.md",
    "sha256": "ff070fb332deac367595acc1f134a3557f872261341b519332cb878ddae03b64",
    "total_lines": 85,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:47:02.539Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-02-464Z-fa23bb21-d188-4fb0-a2ec-d446400be056-inner-read-32-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-02-464Z-fa23bb21-d188-4fb0-a2ec-d446400be056-inner-read-32-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:47:02.628Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-02-553Z-277316e3-885a-4462-b141-bdba48ae5ab1-inner-read-32-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-02-553Z-277316e3-885a-4462-b141-bdba48ae5ab1-inner-read-32-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 85,
        "date": "2026-10-16T14:47:02.713Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-02-641Z-8621676a-5598-4cf1-8cf7-cc769dbaed30-inner-read-32-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-02-641Z-8621676a-5598-4cf1-8cf7-cc769dbaed30-inner-read-32-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 33,
    "path": "正文/0033-关机以前.md",
    "sha256": "42af1f2e7ae30cacbbd34992e2b3b798bc79b52074954a3952e30298faeed323",
    "total_lines": 83,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:47:07.126Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-07-052Z-a1f0e24c-ac15-49d7-ae12-c36116feb712-inner-read-33-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-07-052Z-a1f0e24c-ac15-49d7-ae12-c36116feb712-inner-read-33-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:47:07.213Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-07-139Z-56ecf548-8d88-423e-a01b-5aa5e1dad1ec-inner-read-33-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-07-139Z-56ecf548-8d88-423e-a01b-5aa5e1dad1ec-inner-read-33-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 83,
        "date": "2026-10-16T14:47:07.296Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-07-226Z-935f5305-bc32-4562-94e6-2a95fffd4522-inner-read-33-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-07-226Z-935f5305-bc32-4562-94e6-2a95fffd4522-inner-read-33-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 34,
    "path": "正文/0034-回来时还有人醒着.md",
    "sha256": "f74d670ca9b86db21839c5645a4a27e2c50ed7a75e3436aeafba926032c48331",
    "total_lines": 79,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:47:12.798Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-12-719Z-2ebb5777-3431-43b3-8742-cf362d24da72-inner-read-34-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-12-719Z-2ebb5777-3431-43b3-8742-cf362d24da72-inner-read-34-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 79,
        "date": "2026-10-16T14:47:12.887Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-12-813Z-5ee0bf52-88eb-4375-b67f-b54743faa899-inner-read-34-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-12-813Z-5ee0bf52-88eb-4375-b67f-b54743faa899-inner-read-34-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 35,
    "path": "正文/0035-放在桌上的两页纸.md",
    "sha256": "6ae580da4f9edf8ac80868812ccc87a1635d72dbfd537368debc42980bc3c08c",
    "total_lines": 77,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:47:18.731Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-18-649Z-9cfa5fa4-9cbd-4b7a-a804-d615c4965ad0-inner-read-35-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-18-649Z-9cfa5fa4-9cbd-4b7a-a804-d615c4965ad0-inner-read-35-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 77,
        "date": "2026-10-16T14:47:18.815Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-18-744Z-b896a532-f40a-40a2-b658-230e9c7d06c9-inner-read-35-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-18-744Z-b896a532-f40a-40a2-b658-230e9c7d06c9-inner-read-35-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 36,
    "path": "正文/0036-雨水经过的地方.md",
    "sha256": "62cf78914a3afd5b167f16235d3c50ef0dea64a188f8d00594cba2d24c04f400",
    "total_lines": 79,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:47:23.091Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-23-018Z-4930401a-4b23-4687-a0b3-2ad80738758a-inner-read-36-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-23-018Z-4930401a-4b23-4687-a0b3-2ad80738758a-inner-read-36-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 79,
        "date": "2026-10-16T14:47:23.183Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-23-106Z-3b6cf3b0-4ac0-40b4-8154-f50ab1f0b743-inner-read-36-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-23-106Z-3b6cf3b0-4ac0-40b4-8154-f50ab1f0b743-inner-read-36-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 37,
    "path": "正文/0037-只能先给她看.md",
    "sha256": "567ce09b4d038339feda6641503c98b52adedba9432b6c85b4f5cf36eff18307",
    "total_lines": 81,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:47:57.151Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-57-073Z-62947c8e-0bae-49e9-a55c-10c8d3694a3c-inner-read-37-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-57-073Z-62947c8e-0bae-49e9-a55c-10c8d3694a3c-inner-read-37-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:47:57.240Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-57-166Z-7194e962-3dde-47a5-812e-389873585350-inner-read-37-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-57-166Z-7194e962-3dde-47a5-812e-389873585350-inner-read-37-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 81,
        "date": "2026-10-16T14:47:57.322Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-57-253Z-798099d5-a426-4290-838b-18e528f3ac2e-inner-read-37-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-47-57-253Z-798099d5-a426-4290-838b-18e528f3ac2e-inner-read-37-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 38,
    "path": "正文/0038-纸铺不到的地方.md",
    "sha256": "364f256ed53548f4c8a5af99fd0e2d69a476cc99f5ead4440dda938fc7b98130",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:48:01.834Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-01-754Z-889941e4-987e-4790-bcac-f67c05d1e4c9-inner-read-38-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-01-754Z-889941e4-987e-4790-bcac-f67c05d1e4c9-inner-read-38-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T14:48:01.922Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-01-849Z-7600039b-9c2c-43ca-b2b6-4d796d3010bc-inner-read-38-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-01-849Z-7600039b-9c2c-43ca-b2b6-4d796d3010bc-inner-read-38-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 39,
    "path": "正文/0039-窗边坐两个人.md",
    "sha256": "8f6634bc9546740d064de6b3f886cfbc46a40c25874c7e4568b5585cea3e9304",
    "total_lines": 79,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:48:06.338Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-06-260Z-4410ce9d-dff8-4f04-9c0f-00fea013a579-inner-read-39-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-06-260Z-4410ce9d-dff8-4f04-9c0f-00fea013a579-inner-read-39-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 79,
        "date": "2026-10-16T14:48:06.424Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-06-351Z-99c7fb3b-b39a-464a-82e1-9908830543bb-inner-read-39-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-06-351Z-99c7fb3b-b39a-464a-82e1-9908830543bb-inner-read-39-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 40,
    "path": "正文/0040-没读完也可以走.md",
    "sha256": "66b1cd9b02e3ecf0e6ae47fac2bb6099dbb87115dfde8a21381ac546ea3b129e",
    "total_lines": 75,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:48:11.943Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-11-864Z-51ba5a8c-e965-44d1-ac38-b1b6853208c3-inner-read-40-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-11-864Z-51ba5a8c-e965-44d1-ac38-b1b6853208c3-inner-read-40-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T14:48:12.031Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-11-958Z-8b87e7d1-4735-4fa9-8e22-5cac749557e1-inner-read-40-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-11-958Z-8b87e7d1-4735-4fa9-8e22-5cac749557e1-inner-read-40-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 41,
    "path": "正文/0041-钥匙不能替人站着.md",
    "sha256": "4f4343f22074dc53ccbceb7d27e4a3dc0e9d8a84623fe01f765ec2be83358287",
    "total_lines": 71,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:48:16.925Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-16-845Z-423befae-143f-4c66-a7db-0b0bcd529d0b-inner-read-41-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-16-845Z-423befae-143f-4c66-a7db-0b0bcd529d0b-inner-read-41-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 71,
        "date": "2026-10-16T14:48:17.010Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-16-938Z-af6d1ff3-e9ba-49e1-937e-80e3e09aee3b-inner-read-41-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-16-938Z-af6d1ff3-e9ba-49e1-937e-80e3e09aee3b-inner-read-41-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 42,
    "path": "正文/0042-雨还没下完.md",
    "sha256": "18d2f96cc4bc5550930669456971670b2526b762c22b890000b8493ae617882f",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:48:21.758Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-21-685Z-75f91cd5-82ec-4e89-a1d4-2e8f78c0a61e-inner-read-42-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-21-685Z-75f91cd5-82ec-4e89-a1d4-2e8f78c0a61e-inner-read-42-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T14:48:21.851Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-21-772Z-bee2548f-1867-471e-8f52-65187bc2714d-inner-read-42-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-48-21-772Z-bee2548f-1867-471e-8f52-65187bc2714d-inner-read-42-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 43,
    "path": "正文/0043-晾不干的一小时.md",
    "sha256": "f3f3358e32258be6e2e410f0c786dc6ac7a752927e47f2f769fe56929f1d1be3",
    "total_lines": 67,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:49:01.344Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-01-259Z-05955579-845b-4987-bdb9-583b416d26d4-inner-read-43-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-01-259Z-05955579-845b-4987-bdb9-583b416d26d4-inner-read-43-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 67,
        "date": "2026-10-16T14:49:01.430Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-01-358Z-63b94377-4ab9-4a26-b1ac-ae070cceb8a2-inner-read-43-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-01-358Z-63b94377-4ab9-4a26-b1ac-ae070cceb8a2-inner-read-43-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 44,
    "path": "正文/0044-纸的两面不是同一天.md",
    "sha256": "d8bdbc7f45a8c28a21d1a7203ab6b91da9153557927e7f6bc3a3e56c451bec8a",
    "total_lines": 81,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:49:08.029Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-07-949Z-fd547702-5ae1-4226-bc75-aebf0bb4e4b9-inner-read-44-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-07-949Z-fd547702-5ae1-4226-bc75-aebf0bb4e4b9-inner-read-44-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:49:08.118Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-08-047Z-2315d826-3158-4eaf-b388-e2df39ec52b6-inner-read-44-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-08-047Z-2315d826-3158-4eaf-b388-e2df39ec52b6-inner-read-44-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 81,
        "date": "2026-10-16T14:49:08.200Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-08-131Z-6521360d-0643-4409-862e-b610ad1b0287-inner-read-44-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-08-131Z-6521360d-0643-4409-862e-b610ad1b0287-inner-read-44-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 45,
    "path": "正文/0045-借一本自己要的书.md",
    "sha256": "e900cc8875f350fc372d9069173accde05e2b74d3b013d6f9f0c7b8710efd85c",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:49:12.821Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-12-745Z-0f627a01-2fac-45f2-a7f0-cbfdc4fdfa3d-inner-read-45-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-12-745Z-0f627a01-2fac-45f2-a7f0-cbfdc4fdfa3d-inner-read-45-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T14:49:12.910Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-12-835Z-e8cf1a67-b5bb-496c-9823-e8fb0fbcc786-inner-read-45-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-12-835Z-e8cf1a67-b5bb-496c-9823-e8fb0fbcc786-inner-read-45-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 46,
    "path": "正文/0046-十点以后她走了.md",
    "sha256": "5a6af90aa7bd153e95b7296362195424cd512baa4e58eccb2d759195bc735091",
    "total_lines": 83,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:49:17.750Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-17-672Z-c79b2347-824f-4262-adc0-18c5163d5f9e-inner-read-46-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-17-672Z-c79b2347-824f-4262-adc0-18c5163d5f9e-inner-read-46-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:49:17.834Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-17-764Z-70cedfc7-514a-4a66-b805-1853a82c4c40-inner-read-46-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-17-764Z-70cedfc7-514a-4a66-b805-1853a82c4c40-inner-read-46-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 83,
        "date": "2026-10-16T14:49:17.920Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-17-848Z-a8eb5841-73e2-426b-b4c2-81750808fca9-inner-read-46-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-17-848Z-a8eb5841-73e2-426b-b4c2-81750808fca9-inner-read-46-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 47,
    "path": "正文/0047-十一点的门外.md",
    "sha256": "9457a286636e2faf2dff769036d3be3914dd6f4cbba178ef1c82b52dfdad10d9",
    "total_lines": 85,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:49:22.333Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-22-255Z-7e2bf29f-42fd-4b83-ae54-ecd514beadb2-inner-read-47-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-22-255Z-7e2bf29f-42fd-4b83-ae54-ecd514beadb2-inner-read-47-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:49:22.421Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-22-346Z-a73d4577-85d9-4f46-87b4-d9f3b7947b06-inner-read-47-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-22-346Z-a73d4577-85d9-4f46-87b4-d9f3b7947b06-inner-read-47-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 85,
        "date": "2026-10-16T14:49:22.506Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-22-433Z-ac5db0cb-e92e-4da4-878e-8960852b89f8-inner-read-47-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-22-433Z-ac5db0cb-e92e-4da4-878e-8960852b89f8-inner-read-47-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 48,
    "path": "正文/0048-还回去的和留下来的.md",
    "sha256": "e5e6f9687a25dfd701402bdbc3fa064ee8bca9ab06396258ade0506ac232154d",
    "total_lines": 71,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:49:26.576Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-26-499Z-94a1a43f-60a6-4415-8870-1a11c2898ef8-inner-read-48-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-26-499Z-94a1a43f-60a6-4415-8870-1a11c2898ef8-inner-read-48-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 71,
        "date": "2026-10-16T14:49:26.661Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-26-590Z-8162968c-1175-4f43-9bff-96fc6e1d4b84-inner-read-48-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-49-26-590Z-8162968c-1175-4f43-9bff-96fc6e1d4b84-inner-read-48-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 49,
    "path": "正文/0049-门还没有开.md",
    "sha256": "2a0d4e8632c6828f780fca85de22aff35958ac1eb90dc3ccfb0bec2150962557",
    "total_lines": 79,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:50:02.762Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-02-680Z-957f8d57-8be4-48f3-be6b-6e51dfd0858c-inner-read-49-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-02-680Z-957f8d57-8be4-48f3-be6b-6e51dfd0858c-inner-read-49-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 79,
        "date": "2026-10-16T14:50:02.850Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-02-777Z-28f27b4e-2125-47bd-8a62-d61cf0660fa7-inner-read-49-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-02-777Z-28f27b4e-2125-47bd-8a62-d61cf0660fa7-inner-read-49-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 50,
    "path": "正文/0050-六十块里的一早上.md",
    "sha256": "32ba875789af5ae405fd38de3341c7b403058020a512acb5d7af2f2615bd784f",
    "total_lines": 75,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:50:07.405Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-07-329Z-01db4bf0-62e4-423b-876c-cded932a6dad-inner-read-50-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-07-329Z-01db4bf0-62e4-423b-876c-cded932a6dad-inner-read-50-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T14:50:07.491Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-07-419Z-3cdb189b-c323-42a8-9ead-28cfc7925524-inner-read-50-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-07-419Z-3cdb189b-c323-42a8-9ead-28cfc7925524-inner-read-50-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 51,
    "path": "正文/0051-给那一口气留地方.md",
    "sha256": "7b5049108bcc44ccac29a64b92cbff6cd5d905817729f89367b37d391d985a7f",
    "total_lines": 65,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:50:11.774Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-11-701Z-51e4d119-c76a-478d-ae70-45a8a10d8b4d-inner-read-51-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-11-701Z-51e4d119-c76a-478d-ae70-45a8a10d8b4d-inner-read-51-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 65,
        "date": "2026-10-16T14:50:11.860Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-11-788Z-b7de984b-65de-49d7-a5f2-37de612cd22b-inner-read-51-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-11-788Z-b7de984b-65de-49d7-a5f2-37de612cd22b-inner-read-51-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 52,
    "path": "正文/0052-棋盘不能占整张桌.md",
    "sha256": "d8c7962c3d8bfdb245a2cb2c5a73d84b83ce784c92a9791c0975eeb9bbdf5b4a",
    "total_lines": 75,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:50:16.136Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-16-052Z-dbc92539-f861-4390-a33c-c6fbd9081726-inner-read-52-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-16-052Z-dbc92539-f861-4390-a33c-c6fbd9081726-inner-read-52-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T14:50:16.236Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-16-149Z-8ef05b7a-004b-4973-9e02-57cec8d27089-inner-read-52-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-16-149Z-8ef05b7a-004b-4973-9e02-57cec8d27089-inner-read-52-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 53,
    "path": "正文/0053-先把袖子放下来.md",
    "sha256": "08edfa7281d9f639621e43e4cd4dd720e5e257980e6ff320aac894bad6753768",
    "total_lines": 89,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:50:21.749Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-21-674Z-59ac7cc6-1efd-476c-83e0-c7e47f1b878f-inner-read-53-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-21-674Z-59ac7cc6-1efd-476c-83e0-c7e47f1b878f-inner-read-53-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:50:21.833Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-21-763Z-95a156f5-c3a4-453d-a16b-73d8aa7efb68-inner-read-53-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-21-763Z-95a156f5-c3a4-453d-a16b-73d8aa7efb68-inner-read-53-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 89,
        "date": "2026-10-16T14:50:21.925Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-21-849Z-593d5982-8761-46c8-bc05-d3afb2292384-inner-read-53-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-21-849Z-593d5982-8761-46c8-bc05-d3afb2292384-inner-read-53-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 54,
    "path": "正文/0054-放得下菜袋的地方.md",
    "sha256": "badfd6927b047e7bffd636f24f5d305ae9c1862eacd3055c826d5d37f0f52943",
    "total_lines": 73,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:50:26.950Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-26-871Z-ac859398-085b-4aca-8fea-b4bbd25f7d22-inner-read-54-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-26-871Z-ac859398-085b-4aca-8fea-b4bbd25f7d22-inner-read-54-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 73,
        "date": "2026-10-16T14:50:27.034Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-26-964Z-563ee04b-0369-49b9-8db0-8a302409ff5d-inner-read-54-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-26-964Z-563ee04b-0369-49b9-8db0-8a302409ff5d-inner-read-54-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 55,
    "path": "正文/0055-先把早饭吃完.md",
    "sha256": "ca9b6307cf61a9455d6d90e73e66abbe1c2cf7598a1830033fd3cf12a077dad1",
    "total_lines": 91,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:50:57.597Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-57-522Z-8aadb7f9-4f43-46b8-8340-3b055bc1d28b-inner-read-55-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-57-522Z-8aadb7f9-4f43-46b8-8340-3b055bc1d28b-inner-read-55-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:50:57.684Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-57-611Z-76e0d359-5396-4749-9c0f-eb46ea2a44ae-inner-read-55-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-57-611Z-76e0d359-5396-4749-9c0f-eb46ea2a44ae-inner-read-55-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 91,
        "date": "2026-10-16T14:50:57.773Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-57-697Z-083b7049-b1d3-4a4e-ba75-708c93c934a8-inner-read-55-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-50-57-697Z-083b7049-b1d3-4a4e-ba75-708c93c934a8-inner-read-55-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 56,
    "path": "正文/0056-不再往后填.md",
    "sha256": "d647e4c8f45ec8725e5039eb66c1c2ddf8871dbead9a311e36f627394d8640ea",
    "total_lines": 83,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:51:03.773Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-03-691Z-b111ba9c-9b41-43d8-b698-c34eca9769d8-inner-read-56-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-03-691Z-b111ba9c-9b41-43d8-b698-c34eca9769d8-inner-read-56-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:51:03.860Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-03-786Z-ab217d55-7295-455f-bc05-613419b9163e-inner-read-56-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-03-786Z-ab217d55-7295-455f-bc05-613419b9163e-inner-read-56-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 83,
        "date": "2026-10-16T14:51:03.944Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-03-872Z-1da17543-e507-434e-9acc-d59db77b21ff-inner-read-56-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-03-872Z-1da17543-e507-434e-9acc-d59db77b21ff-inner-read-56-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 57,
    "path": "正文/0057-两间房之间.md",
    "sha256": "565d27ef9dac69b138528d5d91f97f8bb8c99cffa78f0b9e39a857424f63b3e1",
    "total_lines": 93,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:51:08.689Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-08-613Z-fa73a93c-9acf-4df6-99e8-0710350ecf2d-inner-read-57-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-08-613Z-fa73a93c-9acf-4df6-99e8-0710350ecf2d-inner-read-57-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:51:08.779Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-08-705Z-8cfb5939-3494-4ed4-b1b8-bcf187b38518-inner-read-57-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-08-705Z-8cfb5939-3494-4ed4-b1b8-bcf187b38518-inner-read-57-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 93,
        "date": "2026-10-16T14:51:08.868Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-08-792Z-b83698bb-201e-4b52-9425-a6e6a6c35880-inner-read-57-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-08-792Z-b83698bb-201e-4b52-9425-a6e6a6c35880-inner-read-57-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 58,
    "path": "正文/0058-先试自己的线.md",
    "sha256": "53f53d4ecb1a4a6ac1d7728fce1957614f1e07e58ccf3769607e0a58a902a521",
    "total_lines": 77,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:51:13.274Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-13-189Z-ff895a55-7078-42d9-a748-57dfb260664f-inner-read-58-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-13-189Z-ff895a55-7078-42d9-a748-57dfb260664f-inner-read-58-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 77,
        "date": "2026-10-16T14:51:13.366Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-13-289Z-cef6b98e-000a-45b3-ba59-785bca03868c-inner-read-58-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-13-289Z-cef6b98e-000a-45b3-ba59-785bca03868c-inner-read-58-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 59,
    "path": "正文/0059-鱼放得下的盘子.md",
    "sha256": "da933f7b33edfebfa33016e376563b8e5185b5c5db8577ce3054249b0bf9224d",
    "total_lines": 81,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:51:17.956Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-17-880Z-8f366f95-60d1-4778-b227-9e7bb37f00a7-inner-read-59-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-17-880Z-8f366f95-60d1-4778-b227-9e7bb37f00a7-inner-read-59-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:51:18.039Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-17-969Z-86553acf-c429-40d6-b174-1674e692c4d4-inner-read-59-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-17-969Z-86553acf-c429-40d6-b174-1674e692c4d4-inner-read-59-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 81,
        "date": "2026-10-16T14:51:18.123Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-18-052Z-5e2e9d8b-10aa-4de2-af37-2d0d346682db-inner-read-59-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-18-052Z-5e2e9d8b-10aa-4de2-af37-2d0d346682db-inner-read-59-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 60,
    "path": "正文/0060-带走的那只袋子.md",
    "sha256": "f6c9b3642d133ef88c91e1b514fa92f4c23a2cba363f45c95f2e95bc09da8a6c",
    "total_lines": 71,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:51:24.649Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-24-574Z-65bd31e1-ba0f-4fa9-bb92-bc77fbae2ab7-inner-read-60-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-24-574Z-65bd31e1-ba0f-4fa9-bb92-bc77fbae2ab7-inner-read-60-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 71,
        "date": "2026-10-16T14:51:24.737Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-24-663Z-50df0bde-d01f-4598-a582-3f12074ecb83-inner-read-60-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-24-663Z-50df0bde-d01f-4598-a582-3f12074ecb83-inner-read-60-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 61,
    "path": "正文/0061-先在这里吃一顿.md",
    "sha256": "2c2a59b004cea360244a25622b8f367917d5bde6bcf7e4415e0ed1d4e3fbe207",
    "total_lines": 91,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:51:56.011Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-55-937Z-a2395bb4-5700-43e9-b5a2-2f12d17aa1ad-inner-read-61-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-55-937Z-a2395bb4-5700-43e9-b5a2-2f12d17aa1ad-inner-read-61-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:51:56.097Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-56-027Z-c89128ce-d54c-4fb1-bd70-3cc80b8b2c75-inner-read-61-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-56-027Z-c89128ce-d54c-4fb1-bd70-3cc80b8b2c75-inner-read-61-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 91,
        "date": "2026-10-16T14:51:56.185Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-56-112Z-e789ace9-9465-44fe-8313-6be48e40e78c-inner-read-61-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-51-56-112Z-e789ace9-9465-44fe-8313-6be48e40e78c-inner-read-61-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 62,
    "path": "正文/0062-等那张照片出来.md",
    "sha256": "4e29f8de09be28371418f21d9f32295674b02b3c2728efdaccaeba2dee5a6e90",
    "total_lines": 73,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:52:00.527Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-00-452Z-5afc15b4-758a-40e0-830a-9c19898ef32c-inner-read-62-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-00-452Z-5afc15b4-758a-40e0-830a-9c19898ef32c-inner-read-62-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 73,
        "date": "2026-10-16T14:52:00.621Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-00-542Z-00f9ebf3-dd15-49f1-a757-157373e42afa-inner-read-62-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-00-542Z-00f9ebf3-dd15-49f1-a757-157373e42afa-inner-read-62-41.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 73,
        "date": "2026-10-16T15:11:54.896Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-11-54-809Z-10334485-96c6-45f9-8790-7865c6286236-outer-recheck62.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-11-54-809Z-10334485-96c6-45f9-8790-7865c6286236-outer-recheck62.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 63,
    "path": "正文/0063-腾出来的那把椅子.md",
    "sha256": "5d6d65c8d7e7cd2ed48cbec1d9f7fe72a97453e9f072a500350e6868a2f27801",
    "total_lines": 71,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:52:04.932Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-04-858Z-6d101cc7-0b28-4c15-be71-b35ce9635a57-inner-read-63-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-04-858Z-6d101cc7-0b28-4c15-be71-b35ce9635a57-inner-read-63-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 71,
        "date": "2026-10-16T14:52:05.021Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-04-946Z-a25c74c7-73c8-4c37-8b33-83234ce98dbd-inner-read-63-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-04-946Z-a25c74c7-73c8-4c37-8b33-83234ce98dbd-inner-read-63-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 64,
    "path": "正文/0064-盒子回到谁手里.md",
    "sha256": "93ae46be7f52d7846d6cfb2c42191d89de434408871b9d38a523c6cc600021be",
    "total_lines": 65,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:52:10.872Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-10-797Z-f9b3ea95-2ffd-4795-a5ce-5505ac4819c7-inner-read-64-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-10-797Z-f9b3ea95-2ffd-4795-a5ce-5505ac4819c7-inner-read-64-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 65,
        "date": "2026-10-16T14:52:10.957Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-10-889Z-34f8758b-a34a-4815-91bc-4058be7b1121-inner-read-64-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-10-889Z-34f8758b-a34a-4815-91bc-4058be7b1121-inner-read-64-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 65,
    "path": "正文/0065-两只都走一遍.md",
    "sha256": "cb0f37b85d4e4160d276bc3833e44f46cf4dd89102edb035c51a33784771e3f3",
    "total_lines": 73,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:52:16.519Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-16-425Z-c074b518-399a-4f08-b6fb-9c2ba84a0c47-inner-read-65-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-16-425Z-c074b518-399a-4f08-b6fb-9c2ba84a0c47-inner-read-65-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 73,
        "date": "2026-10-16T14:52:16.637Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-16-535Z-c6d3ddc5-8afe-4569-a2ae-f608d25d8053-inner-read-65-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-16-535Z-c6d3ddc5-8afe-4569-a2ae-f608d25d8053-inner-read-65-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 66,
    "path": "正文/0066-这把椅子先给人坐.md",
    "sha256": "d5d0b18dbc2090695210c638395b1ca6c63ef887fe8140c34b5095b542c5637f",
    "total_lines": 71,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:52:20.861Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-20-777Z-cf61aa65-5108-4674-ac48-b8fe4cf7d461-inner-read-66-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-20-777Z-cf61aa65-5108-4674-ac48-b8fe4cf7d461-inner-read-66-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 71,
        "date": "2026-10-16T14:52:20.960Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-20-876Z-617aa008-cce6-4c6b-b281-abb22a8a6fd0-inner-read-66-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-20-876Z-617aa008-cce6-4c6b-b281-abb22a8a6fd0-inner-read-66-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 67,
    "path": "正文/0067-晚饭以前的两小时.md",
    "sha256": "4445b91f02b2b505cbdbf933a328d490c93416575103ef14dd7b6124cd29ea53",
    "total_lines": 85,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:52:55.862Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-55-788Z-81a781b9-ec33-4858-8e6f-b799051cc487-inner-read-67-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-55-788Z-81a781b9-ec33-4858-8e6f-b799051cc487-inner-read-67-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:52:55.955Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-55-878Z-697d7f96-514d-4b1d-a61a-1902fe431d87-inner-read-67-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-55-878Z-697d7f96-514d-4b1d-a61a-1902fe431d87-inner-read-67-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 85,
        "date": "2026-10-16T14:52:56.043Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-55-968Z-cf52ea6b-56f0-43c8-9ea7-d028014f3949-inner-read-67-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-52-55-968Z-cf52ea6b-56f0-43c8-9ea7-d028014f3949-inner-read-67-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 68,
    "path": "正文/0068-不用点开的菜单.md",
    "sha256": "40922ca763847253ae9f7c3a92dcc8807a6af6b837bdd2bcbe01336819db2ca9",
    "total_lines": 83,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:53:00.262Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-00-186Z-47de2f5c-3727-4768-a924-8ee208d1ec10-inner-read-68-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-00-186Z-47de2f5c-3727-4768-a924-8ee208d1ec10-inner-read-68-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:53:00.347Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-00-276Z-da28bb7d-7f3c-4b71-a77a-463d3112206c-inner-read-68-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-00-276Z-da28bb7d-7f3c-4b71-a77a-463d3112206c-inner-read-68-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 83,
        "date": "2026-10-16T14:53:00.430Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-00-360Z-dcd94e30-1433-44ac-9230-18b6008f0c34-inner-read-68-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-00-360Z-dcd94e30-1433-44ac-9230-18b6008f0c34-inner-read-68-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 69,
    "path": "正文/0069-照片出来的那一刻.md",
    "sha256": "eeabf2dc6472c861275f432e939a36f344fc6cc1c20721492a88abde5c76646e",
    "total_lines": 71,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:53:04.957Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-04-882Z-89a2d819-173a-4ea6-8a62-e52815323d39-inner-read-69-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-04-882Z-89a2d819-173a-4ea6-8a62-e52815323d39-inner-read-69-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 71,
        "date": "2026-10-16T14:53:05.039Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-04-970Z-bc3e837c-d0dd-47a8-8235-d65dabd438d1-inner-read-69-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-04-970Z-bc3e837c-d0dd-47a8-8235-d65dabd438d1-inner-read-69-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 70,
    "path": "正文/0070-这一顿有两个人做.md",
    "sha256": "007df7f0684078e9759b72d2dbf7daaec4a55a5e7a2f1478e83e9f216879ef12",
    "total_lines": 85,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:53:09.516Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-09-441Z-3d3aff9a-4c6c-4644-be46-3932d922a3eb-inner-read-70-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-09-441Z-3d3aff9a-4c6c-4644-be46-3932d922a3eb-inner-read-70-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:53:09.601Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-09-530Z-236312d5-014e-4447-962a-a6b07f31753b-inner-read-70-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-09-530Z-236312d5-014e-4447-962a-a6b07f31753b-inner-read-70-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 85,
        "date": "2026-10-16T14:53:09.683Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-09-613Z-4e528eef-a904-4f42-afbe-28d5d7bf464b-inner-read-70-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-09-613Z-4e528eef-a904-4f42-afbe-28d5d7bf464b-inner-read-70-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 71,
    "path": "正文/0071-雨还没走到沟口.md",
    "sha256": "e9274767be6021cbc028ac31e40c2469a39dfb4dee50f6f2c2330434ae1d234f",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:53:14.049Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-13-975Z-cc4e28b0-30a9-49b1-a1c9-ae33b87c8e89-inner-read-71-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-13-975Z-cc4e28b0-30a9-49b1-a1c9-ae33b87c8e89-inner-read-71-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T14:53:14.141Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-14-063Z-4ec7bbf2-a1d0-48ad-b825-a9272d5f4ac1-inner-read-71-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-14-063Z-4ec7bbf2-a1d0-48ad-b825-a9272d5f4ac1-inner-read-71-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 72,
    "path": "正文/0072-把空出来的地方留着.md",
    "sha256": "8ed63a27af31a8c329b55e7d1d65439001b63d4038adc076bb44794426011185",
    "total_lines": 75,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:53:18.500Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-18-426Z-f60bcc76-cf16-4f32-a4f3-f30e3ace3672-inner-read-72-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-18-426Z-f60bcc76-cf16-4f32-a4f3-f30e3ace3672-inner-read-72-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T14:53:18.589Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-18-513Z-19746150-ff1a-435b-9fef-0dfdea224bd4-inner-read-72-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-18-513Z-19746150-ff1a-435b-9fef-0dfdea224bd4-inner-read-72-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 73,
    "path": "正文/0073-先把车停下来.md",
    "sha256": "276cdef13f58dfa9113bb7abdb30565bde806409eb6140a546857c526a0ba7b6",
    "total_lines": 89,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:53:47.666Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-47-592Z-57f93564-9181-44bb-ac8f-e809f92cb858-inner-read-73-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-47-592Z-57f93564-9181-44bb-ac8f-e809f92cb858-inner-read-73-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:53:47.752Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-47-680Z-5cf051f9-d153-42e3-9993-a1d8c5f0ef32-inner-read-73-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-47-680Z-5cf051f9-d153-42e3-9993-a1d8c5f0ef32-inner-read-73-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 89,
        "date": "2026-10-16T14:53:47.838Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-47-765Z-5b8cf3ef-a24e-4fa2-8015-fb2ff0fa8aac-inner-read-73-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-47-765Z-5b8cf3ef-a24e-4fa2-8015-fb2ff0fa8aac-inner-read-73-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 74,
    "path": "正文/0074-空着的晚上也算数.md",
    "sha256": "2ad51d273d7b3d017d0b298b06353ee6d739777823aba530b3cc000fabd1fad3",
    "total_lines": 85,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:53:56.954Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-56-877Z-0855eb97-de2b-44e3-9d62-1d151181b6d4-inner-read-74-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-56-877Z-0855eb97-de2b-44e3-9d62-1d151181b6d4-inner-read-74-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:53:57.035Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-56-967Z-801e50c3-cf70-4019-8ee2-58c35ddf8c1f-inner-read-74-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-56-967Z-801e50c3-cf70-4019-8ee2-58c35ddf8c1f-inner-read-74-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 85,
        "date": "2026-10-16T14:53:57.121Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-57-051Z-1b1e625e-4f23-486a-8422-a7a00ef6fa34-inner-read-74-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-53-57-051Z-1b1e625e-4f23-486a-8422-a7a00ef6fa34-inner-read-74-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 75,
    "path": "正文/0075-车筐转过来以后.md",
    "sha256": "a4e77ef0b2e383ef03069d84cf88c0eaa29ce31f43323a227532d0dad1af7df0",
    "total_lines": 77,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:54:01.465Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-01-368Z-0482ed54-d991-47df-82c9-a99b5c27d3a7-inner-read-75-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-01-368Z-0482ed54-d991-47df-82c9-a99b5c27d3a7-inner-read-75-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 77,
        "date": "2026-10-16T14:54:01.566Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-01-481Z-8e64628a-97c3-47df-9644-c844d3b0f139-inner-read-75-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-01-481Z-8e64628a-97c3-47df-9644-c844d3b0f139-inner-read-75-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 76,
    "path": "正文/0076-不必买那壶茶.md",
    "sha256": "b26bc25092bb1877ef7b769e0a9a07e47c207b7dc353b62d7deba9ec6c510f2c",
    "total_lines": 83,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:54:05.967Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-05-892Z-f3f13ddd-bbd1-4b50-bcd0-20071951e9b9-inner-read-76-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-05-892Z-f3f13ddd-bbd1-4b50-bcd0-20071951e9b9-inner-read-76-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:54:06.054Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-05-981Z-ef5639c1-15b9-48c4-9e33-c730216fd5e0-inner-read-76-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-05-981Z-ef5639c1-15b9-48c4-9e33-c730216fd5e0-inner-read-76-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 83,
        "date": "2026-10-16T14:54:06.144Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-06-068Z-3d6cba1c-44b8-40a3-b558-ec13fd33ce2b-inner-read-76-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-06-068Z-3d6cba1c-44b8-40a3-b558-ec13fd33ce2b-inner-read-76-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 77,
    "path": "正文/0077-这回不是等她来.md",
    "sha256": "45b58b60f494be209a7fc01000c14a5e15ec8ae78b604a4906dee9817f837498",
    "total_lines": 73,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:54:12.385Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-12-306Z-1ed8eba9-5f1e-495e-b9ef-665697dc9967-inner-read-77-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-12-306Z-1ed8eba9-5f1e-495e-b9ef-665697dc9967-inner-read-77-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 73,
        "date": "2026-10-16T14:54:12.473Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-12-399Z-48a8d3ed-1075-4330-9940-99cef6d27188-inner-read-77-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-12-399Z-48a8d3ed-1075-4330-9940-99cef6d27188-inner-read-77-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 78,
    "path": "正文/0078-下雨也出门.md",
    "sha256": "3898434e4969adc001c66662a9f16b042c8d646f89e0af76878c49bc63022d4a",
    "total_lines": 79,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:54:16.840Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-16-752Z-956c03bf-0b8b-464d-b574-105492d8c5e2-inner-read-78-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-16-752Z-956c03bf-0b8b-464d-b574-105492d8c5e2-inner-read-78-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 79,
        "date": "2026-10-16T14:54:16.938Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-16-855Z-c55f91e8-a3c5-43ab-a2b1-48a5130b1d69-inner-read-78-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-16-855Z-c55f91e8-a3c5-43ab-a2b1-48a5130b1d69-inner-read-78-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 79,
    "path": "正文/0079-换了一个开车的人.md",
    "sha256": "dc03ad4f85b27e2b2ca2c46a3548a20c653fd4fd7319da08d0ab5b7780474125",
    "total_lines": 81,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:54:43.196Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-43-117Z-13fa1d36-8350-4fd4-8f6d-335c4ecc7f59-inner-read-79-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-43-117Z-13fa1d36-8350-4fd4-8f6d-335c4ecc7f59-inner-read-79-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:54:43.281Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-43-210Z-21291c55-03ef-4a5c-8033-c925e38ea3a1-inner-read-79-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-43-210Z-21291c55-03ef-4a5c-8033-c925e38ea3a1-inner-read-79-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 81,
        "date": "2026-10-16T14:54:43.365Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-43-295Z-cdf41b61-d89c-41b9-a34e-9881afb5429c-inner-read-79-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-43-295Z-cdf41b61-d89c-41b9-a34e-9881afb5429c-inner-read-79-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 80,
    "path": "正文/0080-十点半以后.md",
    "sha256": "da486b8bfeb6e1bec0ed2866db16df8dafec6a14764aae9a68d40a6139b967ee",
    "total_lines": 83,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:54:48.925Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-48-846Z-7f0b54ad-e2df-4aeb-a359-fc335d79978a-inner-read-80-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-48-846Z-7f0b54ad-e2df-4aeb-a359-fc335d79978a-inner-read-80-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:54:49.014Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-48-940Z-59035dc5-e827-46bd-9b98-d55c06014835-inner-read-80-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-48-940Z-59035dc5-e827-46bd-9b98-d55c06014835-inner-read-80-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 83,
        "date": "2026-10-16T14:54:49.101Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-49-028Z-f35a9f07-7a03-44b3-ae1c-51be678581a4-inner-read-80-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-49-028Z-f35a9f07-7a03-44b3-ae1c-51be678581a4-inner-read-80-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 81,
    "path": "正文/0081-先把桌子放稳.md",
    "sha256": "655c6247850732a67d16febccc2661709a509498be8bcef66fb4976c02614c7b",
    "total_lines": 67,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:54:54.758Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-54-686Z-d1cc0b76-047e-4e68-90ed-e5c7c12aeebc-inner-read-81-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-54-686Z-d1cc0b76-047e-4e68-90ed-e5c7c12aeebc-inner-read-81-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 67,
        "date": "2026-10-16T14:54:54.850Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-54-773Z-fc93ab10-b485-4c25-89da-629fc3e64b7f-inner-read-81-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-54-54-773Z-fc93ab10-b485-4c25-89da-629fc3e64b7f-inner-read-81-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 82,
    "path": "正文/0082-这一声不是从窗外来.md",
    "sha256": "be2d385e1e680914051cdd08977384b8ff6d800236bacdde99970173d5436b91",
    "total_lines": 61,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:55:03.794Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-03-714Z-e98bc61f-e179-4432-b9a0-16b880a41809-inner-read-82-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-03-714Z-e98bc61f-e179-4432-b9a0-16b880a41809-inner-read-82-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 61,
        "date": "2026-10-16T14:55:03.888Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-03-809Z-b9942325-0b47-43a2-9466-e0b94f9bb119-inner-read-82-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-03-809Z-b9942325-0b47-43a2-9466-e0b94f9bb119-inner-read-82-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 83,
    "path": "正文/0083-柜里那一格.md",
    "sha256": "3deb5cacd08b749372ecaacffba7babb2bb5a49fad51033d9fda4511deea7a71",
    "total_lines": 93,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:55:08.713Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-08-633Z-09f40f1e-8561-4a97-aca4-4903b44efef6-inner-read-83-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-08-633Z-09f40f1e-8561-4a97-aca4-4903b44efef6-inner-read-83-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:55:08.796Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-08-727Z-04ec2667-6924-480e-90e6-c4a193761055-inner-read-83-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-08-727Z-04ec2667-6924-480e-90e6-c4a193761055-inner-read-83-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 93,
        "date": "2026-10-16T14:55:08.884Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-08-809Z-82aff4e1-8c8b-414b-8e3a-a99392b6162d-inner-read-83-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-08-809Z-82aff4e1-8c8b-414b-8e3a-a99392b6162d-inner-read-83-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 84,
    "path": "正文/0084-杯子画歪了也能喝水.md",
    "sha256": "d6f8cd88e78b6ecbc6b9c0eb08327c0028f5e4771e3a59e02b41409db838a2eb",
    "total_lines": 91,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:55:13.289Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-13-214Z-8bbd6188-1cff-48e6-849d-d12cb74cf1da-inner-read-84-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-13-214Z-8bbd6188-1cff-48e6-849d-d12cb74cf1da-inner-read-84-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:55:13.378Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-13-303Z-1a87afff-f7c6-4fc7-a05e-66b58e46b9da-inner-read-84-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-13-303Z-1a87afff-f7c6-4fc7-a05e-66b58e46b9da-inner-read-84-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 91,
        "date": "2026-10-16T14:55:13.465Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-13-392Z-69929dc6-ca99-46af-9ec6-88b4be2cf1e6-inner-read-84-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-13-392Z-69929dc6-ca99-46af-9ec6-88b4be2cf1e6-inner-read-84-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 85,
    "path": "正文/0085-先别把架子抬出去.md",
    "sha256": "68137d2e9db71412905b5828fed5fc6f8c38f064bfb8ccbf4835d2b981f966a5",
    "total_lines": 83,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:55:43.767Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-43-691Z-3fadb31e-470a-4206-9679-4e2a569b8f2d-inner-read-85-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-43-691Z-3fadb31e-470a-4206-9679-4e2a569b8f2d-inner-read-85-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:55:43.853Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-43-780Z-41084867-6887-4482-829b-b4b377e1063f-inner-read-85-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-43-780Z-41084867-6887-4482-829b-b4b377e1063f-inner-read-85-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 83,
        "date": "2026-10-16T14:55:43.936Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-43-865Z-12d3fcfd-a58a-4a52-b85b-d03dadb29fd4-inner-read-85-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-43-865Z-12d3fcfd-a58a-4a52-b85b-d03dadb29fd4-inner-read-85-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 86,
    "path": "正文/0086-椅子上不放篮子.md",
    "sha256": "69c3841a17e2a90a5b7c2ece9f033fc3caeb2e6c3886b15dc4d41583d6f8f4d0",
    "total_lines": 77,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:55:50.420Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-50-337Z-b86f2692-afc8-4396-9937-d423dd80afa0-inner-read-86-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-50-337Z-b86f2692-afc8-4396-9937-d423dd80afa0-inner-read-86-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 77,
        "date": "2026-10-16T14:55:50.505Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-50-434Z-c4aba962-a4a1-464b-8a53-363ec29dce8d-inner-read-86-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-55-50-434Z-c4aba962-a4a1-464b-8a53-363ec29dce8d-inner-read-86-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 87,
    "path": "正文/0087-八点半以前.md",
    "sha256": "15987f44ad52df66d777ebba16e9b101ddeb5b952cced4dc1ea9ef17e04d9d0e",
    "total_lines": 99,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:58:56.292Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-58-56-218Z-f72ba60e-bb76-4d02-90b8-1055ccebe5df-inner-read-87-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-58-56-218Z-f72ba60e-bb76-4d02-90b8-1055ccebe5df-inner-read-87-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:58:56.380Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-58-56-307Z-696a7e37-1324-4acd-9753-89510ce36bd5-inner-read-87-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-58-56-307Z-696a7e37-1324-4acd-9753-89510ce36bd5-inner-read-87-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 99,
        "date": "2026-10-16T14:58:56.465Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-58-56-392Z-bc127ec2-fc41-465d-b26a-c87d818e56f1-inner-read-87-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-58-56-392Z-bc127ec2-fc41-465d-b26a-c87d818e56f1-inner-read-87-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 88,
    "path": "正文/0088-走过去再坐一会儿.md",
    "sha256": "28e398f220bda2c2a7031517a5ee3d90e98f5785f5c2d72f1ad8389115766073",
    "total_lines": 75,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:59:00.309Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-00-231Z-bf747021-9195-409e-b7a5-3fe2d831efb7-inner-read-88-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-00-231Z-bf747021-9195-409e-b7a5-3fe2d831efb7-inner-read-88-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T14:59:00.396Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-00-323Z-f922ec0a-fd85-49bc-9bb6-fab433ef1380-inner-read-88-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-00-323Z-f922ec0a-fd85-49bc-9bb6-fab433ef1380-inner-read-88-41.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:15:40.996Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-40-906Z-98f5a5fc-c9b0-4b05-a5e3-16078599840c-inner-read-88-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-40-906Z-98f5a5fc-c9b0-4b05-a5e3-16078599840c-inner-read-88-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T15:15:41.094Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-41-011Z-a48d80dd-236a-4737-926e-d8d7a334fb33-inner-read-88-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-41-011Z-a48d80dd-236a-4737-926e-d8d7a334fb33-inner-read-88-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 89,
    "path": "正文/0089-这回不留下一次.md",
    "sha256": "bdbd06718ff54821574d01e43d97f776f28b118ade9e2c914f347b10ef47c160",
    "total_lines": 75,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:59:07.175Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-07-099Z-860f250d-2161-4fff-82a8-d3629155aedd-inner-read-89-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-07-099Z-860f250d-2161-4fff-82a8-d3629155aedd-inner-read-89-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T14:59:07.267Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-07-189Z-db1e2f20-5ca5-408b-9949-15ecd5df47dc-inner-read-89-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-07-189Z-db1e2f20-5ca5-408b-9949-15ecd5df47dc-inner-read-89-41.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:15:40.996Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-40-907Z-828766c5-18b2-44cd-a7a6-ee0c1feb4d44-inner-read-89-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-40-907Z-828766c5-18b2-44cd-a7a6-ee0c1feb4d44-inner-read-89-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 75,
        "date": "2026-10-16T15:15:41.098Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-41-012Z-258ccc3b-db98-4591-a82b-1a3e0a47590c-inner-read-89-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-41-012Z-258ccc3b-db98-4591-a82b-1a3e0a47590c-inner-read-89-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 90,
    "path": "正文/0090-把话带到以后.md",
    "sha256": "b28d09e947878cfcbcbc0405cc23dc174fb23514da69de5fd2f166bfb1a7006f",
    "total_lines": 65,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:59:10.979Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-10-905Z-70fab4f7-a342-49d5-810f-7eb7d6e43d8c-inner-read-90-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-10-905Z-70fab4f7-a342-49d5-810f-7eb7d6e43d8c-inner-read-90-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 65,
        "date": "2026-10-16T14:59:11.063Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-10-995Z-40aba181-0ea0-475b-a5ff-419afc0dc3d8-inner-read-90-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-59-10-995Z-40aba181-0ea0-475b-a5ff-419afc0dc3d8-inner-read-90-41.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:15:46.590Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-506Z-a1f017b0-f2db-46bd-bc1f-89425d8c49ae-inner-read-90-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-506Z-a1f017b0-f2db-46bd-bc1f-89425d8c49ae-inner-read-90-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 65,
        "date": "2026-10-16T15:15:46.685Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-605Z-c7298c6a-b177-43fc-bbeb-ae45fcb02235-inner-read-90-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-605Z-c7298c6a-b177-43fc-bbeb-ae45fcb02235-inner-read-90-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 91,
    "path": "正文/0091-报纸翻到另一面.md",
    "sha256": "326bdf0c79bd1ea82f6aecd00d3211491680788bf82867c8e65a1634693864ec",
    "total_lines": 99,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:15:46.590Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-505Z-db699a9d-08eb-4485-bd96-335b71f16f8d-inner-read-91-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-505Z-db699a9d-08eb-4485-bd96-335b71f16f8d-inner-read-91-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T15:15:46.686Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-604Z-2ac962ac-55cc-484b-822e-a899fbbf419c-inner-read-91-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-604Z-2ac962ac-55cc-484b-822e-a899fbbf419c-inner-read-91-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 99,
        "date": "2026-10-16T15:15:46.773Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-697Z-d610471c-febf-4fcd-b5ef-4cdcb7bdc8f8-inner-read-91-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-46-697Z-d610471c-febf-4fcd-b5ef-4cdcb7bdc8f8-inner-read-91-81.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:17:10.153Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-066Z-861915df-9866-4319-a07e-e122a3879ff9-inner-read-91-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-066Z-861915df-9866-4319-a07e-e122a3879ff9-inner-read-91-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T15:17:10.244Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-166Z-0af81f25-63c1-40ae-9bcc-aade7661a862-inner-read-91-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-166Z-0af81f25-63c1-40ae-9bcc-aade7661a862-inner-read-91-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 99,
        "date": "2026-10-16T15:17:10.332Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-257Z-05c8dac0-f293-433d-84a1-b6d521c05334-inner-read-91-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-257Z-05c8dac0-f293-433d-84a1-b6d521c05334-inner-read-91-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 92,
    "path": "正文/0092-上柜里的一张纸.md",
    "sha256": "47478655d3d2fe4cd4bff8e70e2a99ce34a5276fac38af988f9ea3bb47e8e785",
    "total_lines": 91,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:15:52.991Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-52-904Z-6d7b3ff9-f9a6-4197-b5e6-75d3192d406f-inner-read-92-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-52-904Z-6d7b3ff9-f9a6-4197-b5e6-75d3192d406f-inner-read-92-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T15:15:53.093Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-53-007Z-098e25fa-94c2-4e5d-85df-8927de0b8df7-inner-read-92-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-53-007Z-098e25fa-94c2-4e5d-85df-8927de0b8df7-inner-read-92-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 91,
        "date": "2026-10-16T15:15:53.196Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-53-108Z-8eba9505-bd97-47ec-9b14-c51ef9147dd8-inner-read-92-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-53-108Z-8eba9505-bd97-47ec-9b14-c51ef9147dd8-inner-read-92-81.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:17:10.967Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-893Z-341d1a5a-4867-4a79-9486-cc1a89b1bc4b-inner-read-92-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-893Z-341d1a5a-4867-4a79-9486-cc1a89b1bc4b-inner-read-92-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T15:17:11.061Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-981Z-197c1902-4a56-427c-820c-6e26902cbec9-inner-read-92-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-10-981Z-197c1902-4a56-427c-820c-6e26902cbec9-inner-read-92-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 91,
        "date": "2026-10-16T15:17:11.152Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-11-073Z-7b8f1b2d-4607-45fd-834e-9c5205d62b97-inner-read-92-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-11-073Z-7b8f1b2d-4607-45fd-834e-9c5205d62b97-inner-read-92-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 93,
    "path": "正文/0093-菜还没有买完.md",
    "sha256": "a3f5ee964181cb42554a120e59f4a513522ec59b419704d5127bd9e5e3ea33d8",
    "total_lines": 87,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:15:52.992Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-52-905Z-767c7650-4c5a-4b7b-989d-f7927756aed3-inner-read-93-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-52-905Z-767c7650-4c5a-4b7b-989d-f7927756aed3-inner-read-93-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T15:15:53.093Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-53-006Z-fac75352-0f6b-434b-8a74-eedccf96d595-inner-read-93-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-53-006Z-fac75352-0f6b-434b-8a74-eedccf96d595-inner-read-93-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 87,
        "date": "2026-10-16T15:15:53.197Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-53-107Z-3be74ef7-d69c-4732-a6f0-4a02df31651c-inner-read-93-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-15-53-107Z-3be74ef7-d69c-4732-a6f0-4a02df31651c-inner-read-93-81.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:17:16.824Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-737Z-50004f81-1004-486f-bc18-b9821df8a920-inner-read-93-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-737Z-50004f81-1004-486f-bc18-b9821df8a920-inner-read-93-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T15:17:16.941Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-838Z-e7233293-0b35-4a2c-a6f5-2f69744afe8e-inner-read-93-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-838Z-e7233293-0b35-4a2c-a6f5-2f69744afe8e-inner-read-93-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 87,
        "date": "2026-10-16T15:17:17.056Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-957Z-4e9070de-9445-48d3-8f28-6df6199d6194-inner-read-93-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-957Z-4e9070de-9445-48d3-8f28-6df6199d6194-inner-read-93-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 94,
    "path": "正文/0094-票夹不用交给你.md",
    "sha256": "18424487db5beedf1c047b28377a9f35332612bbc802cef5dcc7b21886d194a5",
    "total_lines": 85,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:17:16.826Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-737Z-df3dc0ce-1d58-4e28-87e8-edd9e6d95ac2-inner-read-94-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-737Z-df3dc0ce-1d58-4e28-87e8-edd9e6d95ac2-inner-read-94-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T15:17:16.941Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-838Z-256f1597-fefc-4ad5-b64e-5374e65a0fc7-inner-read-94-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-838Z-256f1597-fefc-4ad5-b64e-5374e65a0fc7-inner-read-94-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 85,
        "date": "2026-10-16T15:17:17.056Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-957Z-5e6e9911-0e8b-4034-abb4-57c83be8df7f-inner-read-94-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-16-957Z-5e6e9911-0e8b-4034-abb4-57c83be8df7f-inner-read-94-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 95,
    "path": "正文/0095-先写今天这一页.md",
    "sha256": "93eb336cc249745f32b3884fbb4b79a9899cf3e767c85ac4744f3f0f0c5f5f01",
    "total_lines": 77,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:17:22.430Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-22-351Z-725c8ddb-8892-4d47-b0a6-8e9ddd3d1541-inner-read-95-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-22-351Z-725c8ddb-8892-4d47-b0a6-8e9ddd3d1541-inner-read-95-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 77,
        "date": "2026-10-16T15:17:22.519Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-22-443Z-9f8d54d1-2d17-4166-b9ca-02c86eec753a-inner-read-95-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-22-443Z-9f8d54d1-2d17-4166-b9ca-02c86eec753a-inner-read-95-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 96,
    "path": "正文/0096-听完以后出门.md",
    "sha256": "1c7aaa5031a6021cbea55dc59feb3912833154f7c141dec114499458dc860532",
    "total_lines": 69,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:17:23.231Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-23-152Z-9b4cf8e6-0793-48c8-bcb9-28506f1569d7-inner-read-96-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-23-152Z-9b4cf8e6-0793-48c8-bcb9-28506f1569d7-inner-read-96-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 69,
        "date": "2026-10-16T15:17:23.318Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-23-246Z-fe78e067-1cf9-4a9b-96f1-32bb96e32335-inner-read-96-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-17-23-246Z-fe78e067-1cf9-4a9b-96f1-32bb96e32335-inner-read-96-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 97,
    "path": "正文/0097-两张仍在一起.md",
    "sha256": "a88211ff494bf6024bc9c44a1d0fa71dae77fbf3f1f6d018d35ef47b69002ca9",
    "total_lines": 81,
    "ranges": [
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:40:48.149Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-48-043Z-bdb2672c-a1dd-45f9-aed6-2c1beb5af7b8-outer-ch97-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-48-043Z-bdb2672c-a1dd-45f9-aed6-2c1beb5af7b8-outer-ch97-41.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:40:48.149Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-48-043Z-4a1f3e28-7b23-4f44-87a8-fa0085a9b058-outer-ch97-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-48-043Z-4a1f3e28-7b23-4f44-87a8-fa0085a9b058-outer-ch97-1.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 81,
        "date": "2026-10-16T14:40:52.791Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-52-702Z-a40b0d9a-59ef-4b8b-8cc6-6ce68b798735-outer-ch97-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-52-702Z-a40b0d9a-59ef-4b8b-8cc6-6ce68b798735-outer-ch97-81.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:18:27.735Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-656Z-f4282cd0-74b5-4d4c-933d-738875156a24-inner-read-97-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-656Z-f4282cd0-74b5-4d4c-933d-738875156a24-inner-read-97-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T15:18:27.823Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-748Z-696d1c4b-dd22-4290-9ce7-5154e1ac17af-inner-read-97-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-748Z-696d1c4b-dd22-4290-9ce7-5154e1ac17af-inner-read-97-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 81,
        "date": "2026-10-16T15:18:27.909Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-834Z-db81813b-059e-4697-87a2-17434d81c0d6-inner-read-97-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-834Z-db81813b-059e-4697-87a2-17434d81c0d6-inner-read-97-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 98,
    "path": "正文/0098-到点以后椅子还在.md",
    "sha256": "0ba33184f1b846a0c06b405017e31c8bb81917e1d4d422cf3f6fdec44f97ab1b",
    "total_lines": 79,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:40:54.346Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-54-263Z-388bc76d-f89a-48ea-92a6-09880bc66e30-outer-ch98-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-54-263Z-388bc76d-f89a-48ea-92a6-09880bc66e30-outer-ch98-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 79,
        "date": "2026-10-16T14:40:59.315Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-59-235Z-cad2997d-eec7-4e59-b99d-b30ade62999f-outer-ch98-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-40-59-235Z-cad2997d-eec7-4e59-b99d-b30ade62999f-outer-ch98-41.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:18:27.710Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-632Z-fabff298-58e0-4483-a249-c4fb271766c1-inner-read-98-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-632Z-fabff298-58e0-4483-a249-c4fb271766c1-inner-read-98-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 79,
        "date": "2026-10-16T15:18:27.800Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-724Z-43edf8c7-36a6-4b0c-b8d9-0bcf6ed8670f-inner-read-98-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-27-724Z-43edf8c7-36a6-4b0c-b8d9-0bcf6ed8670f-inner-read-98-41.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 99,
    "path": "正文/0099-饭后还有一会儿.md",
    "sha256": "390ab02ebfce519741c02cff1c633c65c55b74b4ddec75fa32561f87f3c490a4",
    "total_lines": 85,
    "ranges": [
      {
        "from": 81,
        "to": 85,
        "date": "2026-10-16T14:41:04.360Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-04-259Z-a3a0c0d2-3459-46d4-8d59-153b9960e1fa-outer-ch99-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-04-259Z-a3a0c0d2-3459-46d4-8d59-153b9960e1fa-outer-ch99-81.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:41:04.357Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-04-260Z-44e39345-b0ed-44f0-87a9-5a33df464872-outer-ch99-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-04-260Z-44e39345-b0ed-44f0-87a9-5a33df464872-outer-ch99-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T14:41:05.181Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-05-099Z-ef92dcf7-ce8b-4923-8e39-93ec7341a8de-outer-ch99-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-05-099Z-ef92dcf7-ce8b-4923-8e39-93ec7341a8de-outer-ch99-41.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:18:35.090Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-34-995Z-03fdc5c2-4465-44b7-aac3-1566bcfd81b5-inner-read-99-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-34-995Z-03fdc5c2-4465-44b7-aac3-1566bcfd81b5-inner-read-99-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 80,
        "date": "2026-10-16T15:18:35.188Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-35-104Z-f37d99f6-e432-474d-bc05-6cb42f3750b6-inner-read-99-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-35-104Z-f37d99f6-e432-474d-bc05-6cb42f3750b6-inner-read-99-41.stdout.raw.txt"
      },
      {
        "from": 81,
        "to": 85,
        "date": "2026-10-16T15:18:35.286Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-35-201Z-bf5def7f-09a9-4386-9acd-02ef24e9f64a-inner-read-99-81.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-18-35-201Z-bf5def7f-09a9-4386-9acd-02ef24e9f64a-inner-read-99-81.stdout.raw.txt"
      }
    ]
  },
  {
    "unit": 100,
    "path": "正文/0100-念到这一页的末尾.md",
    "sha256": "6f7f439a1adf22655fc76510906bb88c9dd450a0051ea795d446485cae35c89e",
    "total_lines": 73,
    "ranges": [
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T14:41:10.025Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-09-942Z-a9a9cc19-f27c-439c-bbb8-b96e2367a176-outer-ch100-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-09-942Z-a9a9cc19-f27c-439c-bbb8-b96e2367a176-outer-ch100-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 73,
        "date": "2026-10-16T14:41:10.782Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-10-692Z-ccc9eb1e-d15c-42b1-96ad-ee6687f5f97f-outer-ch100-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T14-41-10-692Z-ccc9eb1e-d15c-42b1-96ad-ee6687f5f97f-outer-ch100-41.stdout.raw.txt"
      },
      {
        "from": 1,
        "to": 40,
        "date": "2026-10-16T15:19:12.200Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-19-12-119Z-843b802a-2906-46f3-9801-49ba40bdc693-inner-read-100-1.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-19-12-119Z-843b802a-2906-46f3-9801-49ba40bdc693-inner-read-100-1.stdout.raw.txt"
      },
      {
        "from": 41,
        "to": 73,
        "date": "2026-10-16T15:19:12.282Z",
        "raw_command": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-19-12-213Z-8966b937-86c3-4b12-9971-91b40c21580f-inner-read-100-41.json",
        "raw_stdout": "D:\\work\\other\\ai-writer\\acceptance\\20261016-hundred\\final-review\\commands\\2026-10-16T15-19-12-213Z-8966b937-86c3-4b12-9971-91b40c21580f-inner-read-100-41.stdout.raw.txt"
      }
    ]
  }
]
```
