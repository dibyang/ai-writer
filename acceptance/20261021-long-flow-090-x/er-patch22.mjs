import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),p=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/drafts/er-replay22.json'),'utf8'));
function family(v){return JSON.parse(JSON.stringify(v).replaceAll('15:24','15:14').replaceAll('15:30','15:20').replaceAll('三点半','三点二十').replaceAll('长针到六','长针到四').replaceAll('长针刚走到六','长针刚走到四'));}
const patch=family({summary:p.summary,changes:p.changes});
patch.changes.characters.沈成林='第十五日在家亲听沈说画册已还、女三点二十前来，短翻后交回沈，非本人赴糕店；自己理旧报/传单，把眼镜盒放浅蓝袋置椅旁，今日不愿出门仍垫脚；未见姑娘买布和课堂。';
patch.changes.ledger.P_W_PICTURE_BOOK.character_known.沈成林='在家听沈说已还及姑娘三点二十前来，短翻后交回沈，不见糕店过程，未亲获六分钟等待细节。';
patch.changes.ledger.F_W_BOOK_RETURN.character_known.沈成林='在家听沈说已还、姑娘三点二十前来，不亲见交接或钟面。';
fs.writeFileSync(path.join(X,'er-input-patch22.json'),JSON.stringify(patch,null,2)+'\n',{flag:'wx'});
