import fs from 'node:fs';
const W='acceptance/20261021-long-flow-090-w/',r=JSON.parse(fs.readFileSync(W+'inputs/d-record-22.json'));
const e=quote=>[{unit:22,quote}];
r.changes.ledger.P_W_CURTAIN_BAG={reader_known:'21小段补边已归父；22父仍自己保管，整理旧报/传单后眼镜盒入袋留椅旁，今日选择不出门，未新增耐久保证。',character_known:{'沈成林':'21已亲接有限补边，22摸新针并装眼镜盒；今天不愿出门，仍伤脚。','沈禾':'22见父盒入袋椅旁，亲听今日不出门；向姑娘只述自己所见前晚轻用及昨日袋椅旁。','许蓉女儿':'22亲听沈说前晚轻用未张、昨日在椅旁，沈未见白日携走；自己没见父22整理。'},previous_holder:'沈成林',custody:{holder:'沈成林',location:'沈家父亲椅旁干处',condition:'22眼镜盒在袋内，父理旧报；21白褶小段新针仍在，毛点/原四带未改，今日未出门，脚仍垫凳'},evidence:e('父亲把眼镜盒放回袋底，又摸到白褶上的新针')};
r.changes.ledger.T_W_CURTAIN_BAG={reader_known:'15父愿轻物袋由18首次真实短用兑现，20借损/21有限补边归还及轻用，22父继续自己整理轻物，未把首次兑现推成长期耐久。',character_known:{'沈成林':'21已亲接补边、看新针/轻用，22摸新针装眼镜盒自己保管，非仍未补成。'},evidence:e('父亲把眼镜盒放回袋底，又摸到白褶上的新针')};
fs.writeFileSync(W+'inputs/d-record-22-v2.json',JSON.stringify(r,null,2)+'\n',{flag:'wx'});
