import fs from 'node:fs';
import path from 'node:path';
const out=import.meta.dirname;
for(const n of [11,12]){
 const doc=JSON.parse(fs.readFileSync(path.join(out,`changes-${n}.json`),'utf8'));
 doc.changes.ledger.T_MISSED=n===11?{reader_known:'第11章纸面核验未解释陈师傅私人原因，失约陈述不入核验单，不据此归责。',evidence:[{unit:11,quote:'把旧本子里“本人说未到场”原样留着，没有挪进核验单。'}]}:{statement:'陈师傅失约仍仅第3章本人陈述；私人原因尚未确认，第12章明确仍未知，纸面副页核验不替私事作答，不据此归责。',status:'intentional-open',reader_known:'主线完成，私人原因有边界保留；陈师傅未获新章现场结果，不编其内心或私事答案。',character_known:{林岚:'第12章仍不知私人失约缘由，未添进核验结论，不据此认定档案或作业责任。'},evidence:[{unit:12,quote:'他为什么失约，她仍不知道；这一页纸也没有替他作答。'}]};
 fs.writeFileSync(path.join(out,`changes-${n}b.json`),JSON.stringify(doc,null,2)+'\n');
}
