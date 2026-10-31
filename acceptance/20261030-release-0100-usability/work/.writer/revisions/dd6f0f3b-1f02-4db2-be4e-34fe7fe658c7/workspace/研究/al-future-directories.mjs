import fs from 'node:fs';
const s=JSON.parse(fs.readFileSync('.writer/state.json','utf8'));
fs.writeFileSync('研究/AL-a-future-directories.json',JSON.stringify({mapping:[],directories:[...s.draft_relocations.directories,{volume_id:'V17',directory:'正文/V17-走到桥那边',from:113,to:115},{volume_id:'V18',directory:'正文/V18-带着回话往下做',from:116,to:118}]},null,2)+'\n');
