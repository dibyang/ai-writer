import fs from 'node:fs';
const dir='acceptance/20261027-governance-relocation-ak/';
let s=fs.readFileSync(dir+'fixture47.mjs','utf8');
s=s.replace("import {initProject,main} from '../../lib/workspace.mjs';", "import {main} from '../../lib/workspace.mjs';\nimport {initProject} from '../../.tmp/relocation-ai6/ai-writer-0.10.0/lib/workspace.mjs';").replace("root=path.join(base,'work-v2')", "root=path.join(base,'work-v3')").replaceAll('fixture47-progress.json','fixture47-v3-progress.json').replaceAll('fixture47-result.json','fixture47-v3-result.json');
fs.writeFileSync(dir+'fixture47-v3.mjs',s,{flag:'wx'});
