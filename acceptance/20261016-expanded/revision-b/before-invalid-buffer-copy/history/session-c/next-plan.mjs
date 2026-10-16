import fs from 'node:fs';
const b='acceptance/20261016-expanded/session-c',p='acceptance/20261016-expanded/works/潮汐信号';
const u=Number(process.argv[2]),data=JSON.parse(fs.readFileSync(`${b}/plan-content-${String(u).padStart(4,'0')}.json`,'utf8'));
const s=JSON.parse(fs.readFileSync(p+'/.writer/state.json','utf8'));
data.unit=u;data.arc_id='A3';data.recall_ids=Object.keys(s.snapshot.ledger);data.setting_refs=['设定/角色卡.md','大纲/全书大纲.md'];data.research_refs=[];
fs.writeFileSync(`${b}/plan-${String(u).padStart(4,'0')}.json`,JSON.stringify(data,null,2)+'\n');
