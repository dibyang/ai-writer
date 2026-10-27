import path from'node:path';import{base,j,write}from'./ef-lib.mjs';const r=j(path.join(base,'e-revision-private.json')),x=j(path.join(r.workspace,'.writer/drafts/er2-replay-57.json')),lamp=structuredClone(x.changes.ledger.P_AD_NEW_DESK_LAMP54);lamp.custody.condition=lamp.custody.condition.replace('原68','原72');
write(path.join(base,'er2-delta-57.json'),{body_changed:false,characters:{'许蓉女儿':x.changes.characters['许蓉女儿']+' 54已听母告知、55亲回述灯价72，未新增柜价知情。'},ledger:{P_AD_NEW_DESK_LAMP54:lamp}});
write(path.join(base,'er2-notes-57.md'),`写前r339取得本次context/record-template与官方旧六字段参考，当前14110字符8页按1—2、3—4、5—6、7—8完整返回；无正文改动，原字节为最终稿。当前C滚动研究14行亦实读，保留其C组历史阅读/计划语境，未当作当前阅读证据。

summary真实完成同一第45日周三19—20:40/100分钟第六课，母衣未带，老师实际接纸读48夜行后才知道；今天仅女早见母穿，无新整日记录。旧反馈纸和练习小纸分开，老师获准摸52另侧硬尾，48平小段/偏长针不拆，另空边未结先翘、仅退新段最后一下、摊开后重走自收，仍厚有影。与48退两针的课题不同，不冒学成或职业转向。20:40真收齐针剪/纸布再走，示范布归老师，同学两珠针由本人取齐再穿，女短托无针边不代缝；动作/物件可追踪。

characters与timeline逐项核原参考：老师新增知情止亲看/听，母仅归家摸新旧/听女有限述，沈只夜字问回误会、不见照片/母摸过程，父是否睡未见不替判。女直接要夸同时愿认厚，母保自己听戏时间和衣靠桌仍认，两种需要均有回应，未强行改风格。原14册/夹纸移停页有实动作，8册不动，原母信封/半纸两空仍留。旧灯未修、原留物条不转新票。

ledger/evidence逐项对应最终原句：原纸午间仍碰/站取没总想/口袋顺手，只讲记录当日；本夜老师实读、递还护纸；小纸加未结先翘/末角夹进/退最后一下/旧尾先留/转布/另空边，母纸不并入。新灯条目的旧整项含原68会覆盖已登记72，本次只改condition原72，并在女character保留54/55已知72，非本章新告知；何/沈不增加知价。周/柜客户不在本章增量，当前48三张一粗两细和55未收62/56交70找8净62及已纠正客户付70收8全部继承，不能从旧patch倒回。summary/timeline其他字段未变均核正文，真实引文全核；当前最终稿SHA/依赖/新报告绑定，不沿旧review冒用。

downstream：58才后续使用/关系，59/60实际回述按真实时点核；旧硬尾、母衣长期穿感、新灯长期性能、课程总期和父康复/复航均未知，不强结。完整修订到60，之后另读全部当前48—60，不能以本章写前页取代登记后尾读。
`);console.log('57 semantic delta saved');
