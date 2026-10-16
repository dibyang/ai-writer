import fs from 'node:fs';
import {stage} from './run-cli.mjs';
const p=stage+'/plan-0072.json';fs.copyFileSync(p,stage+'/plan-0072-before-correction.json',fs.constants.COPYFILE_EXCL);
const x=JSON.parse(fs.readFileSync(p,'utf8'));x.beats[1]='何把排版活试样装袋，见沈架原缺名袋空位，明确35日电话已知原纸回邱，只问夹子是否一起还；沈当面新讲48细夹滑页与54两夹原纸全交，不取其他旧稿，何不倒算在场或读原页';
fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');console.log('Corrected future beat before drafting: retain He knowledge from chapter 60; ask about clips, not original paper identity. No registered unit or authority state changed.');
