import fs from 'node:fs';
const t=JSON.parse(fs.readFileSync('研究/AL-c-record118.json','utf8')),c=JSON.parse(fs.readFileSync('../commands/c-020-context118/stdout.raw.txt','utf8'));
t.changes.characters.沈禾=t.changes.characters.沈禾.replace('未接其做饭','未让葛接手做饭');
for(const person of ['沈禾','葛筠'])t.changes.ledger.T_DINNER72_117.character_known[person]+='；此前117时点完整知识（历史，不作现在仍未吃）：'+c.continuity.characters[person].T_DINNER72_117;
fs.writeFileSync('研究/AL-c-record118-retained.json',JSON.stringify(t,null,2)+'\n',{flag:'wx'});console.log('explicit historical knowledge retained; no sources or draft changed');
