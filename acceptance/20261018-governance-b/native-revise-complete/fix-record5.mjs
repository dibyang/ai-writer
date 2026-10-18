import path from 'node:path';
import {phase,root,branch,json,input,run} from './session.mjs';
const t=json(path.join(root,'commands/native-three-fix-knowledge-template5/stdout.raw.txt'));
const prior=json(path.join(phase,'inputs/record5.json'));
t.summary=prior.summary;t.changes=prior.changes;
t.changes.ledger.OBS_NOTCH={
 reader_known:'第三章所见右下缺角和相似大小保留；第五章以原印高差、软硬试印及字内短缺口查明修补缘由，单凭缺角相似仍不能认定仿印或揭封',
 character_known:{'阿禾':'亲见封套及旧页缺角；已在场核原印补角高差与软硬试印，知道修补造成缺印，原描样仍出自旧页','周叔':'亲见封套及旧页缺角；已亲自操作原印复验并记经过，知道补角低处造成缺印','柳婆':'本章亲看原印、旧页和封套，与自存试纸及现场试印比对，确认自己补角未磨齐'},
 evidence:[{unit:5,quote:'头一印缺右下，第二印那一角浅浅显了出来。'},{unit:5,quote:'周叔在旧簿上写下复验经过，没再写仿印。'}]
};
run('fix-knowledge-record5',['record','--input',input('record5-knowledge-fixed',t)],branch);
run('fix-knowledge-context6',['context','--unit','6','--purpose','revision'],branch);
run('fix-knowledge-template6',['record-template','--unit','6','--draft','正文/0006-信纸背面.md'],branch);
