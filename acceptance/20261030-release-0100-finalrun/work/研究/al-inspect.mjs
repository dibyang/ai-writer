import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'),'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const inventory=[];
function walk(dir){for(const f of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,f.name);if(f.isDirectory())walk(p);else if(/\.(md|txt)$/.test(f.name)){const b=fs.readFileSync(p);inventory.push({path:path.relative(root,p).replaceAll('\\','/'),sha256:hash(b)});}}}
walk(path.join(root,'正文'));
fs.writeFileSync(path.join(root,'研究/AL-a-initial-drafts.json'),JSON.stringify(inventory,null,2)+'\n');
fs.writeFileSync(path.join(root,'研究/AL-a-state-shape.json'),JSON.stringify({keys:Object.keys(state),sample:Object.fromEntries(Object.entries(state).filter(([k])=>!['units','journal','snapshots','tool_control'].includes(k)))},null,2)+'\n');
console.log(JSON.stringify({keys:Object.keys(state),inventory:inventory.length,authorization_sha256:hash(fs.readFileSync(path.join(root,'研究/AL轮真实任务授权.md')))}));
