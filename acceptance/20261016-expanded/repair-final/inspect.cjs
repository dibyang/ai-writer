const fs=require('fs'),path=require('path');
const p=path.resolve(__dirname,'../works/潮汐信号');
const s=JSON.parse(fs.readFileSync(path.join(__dirname,'before-state.json')));
let out='';for(const [id,v]of Object.entries(s.snapshot.ledger)){out+='\n## '+id+'\n'+JSON.stringify(Object.fromEntries(Object.entries(v).filter(([k])=>k!=='evidence')),null,2)+'\nEvidence units: '+v.evidence.map(e=>e.unit).join(',')+'\n';}
fs.writeFileSync(path.join(__dirname,'ledger-inspection.txt'),out);
fs.writeFileSync(path.join(__dirname,'characters-heads.json'),JSON.stringify(Object.fromEntries(Object.entries(s.snapshot.characters).map(([k,v])=>[k,v.split('；此前')[0]])),null,2));
let refs='';for(const f of ['设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/角色卡.md','大纲/全书大纲.md','大纲/分卷/V3.json']){if(fs.existsSync(path.join(p,f)))refs+='\n===== '+f+' =====\n'+fs.readFileSync(path.join(p,f),'utf8');}
fs.writeFileSync(path.join(__dirname,'recovery-settings.txt'),refs);
console.log(JSON.stringify({ledger_chars:out.length,characters:Object.keys(s.snapshot.characters),references_chars:refs.length}));
