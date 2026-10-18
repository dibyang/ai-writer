import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(), base=path.join(root,'acceptance/20261018-governance-c'), out=path.join(base,'native-resume-verify'), work=path.join(base,'native-create-review/work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const originals=[...['bin','lib','.agents/skills','docs'].flatMap(p=>walk(path.join(root,p))),path.join(root,'AGENTS.md'),path.join(root,'package.json')];
const protectedFiles=walk(base).filter(p=>!p.startsWith(work+path.sep)&&!p.startsWith(out+path.sep));
const all=[...new Set([...originals,...protectedFiles,...walk(work)])];
fs.mkdirSync(path.join(out,'before/work'),{recursive:true});
for(const f of walk(work)){const to=path.join(out,'before/work',path.relative(work,f));fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(f,to,fs.constants.COPYFILE_EXCL);}
fs.writeFileSync(path.join(out,'before/inventory.json'),JSON.stringify(all.map(p=>({path:path.relative(root,p).replaceAll('\\','/'),sha256:sha(fs.readFileSync(p)),bytes:fs.statSync(p).size})),null,2)+'\n',{flag:'wx'});
const source=path.join(base,'capture.mjs'), bytes=fs.readFileSync(source,'utf8');
const copy=bytes.replace("'../../lib/tool-build.mjs'","'../../../lib/tool-build.mjs'");
fs.writeFileSync(path.join(out,'capture.mjs'),copy,{flag:'wx'});
fs.writeFileSync(path.join(out,'capture-provenance.json'),JSON.stringify({source,source_sha256:sha(Buffer.from(bytes)),copy_sha256:sha(Buffer.from(copy)),only_change:'Import rebased one directory deeper; capture base now confines native-three commands to native-resume-verify/commands. Capture algorithm unchanged.',reason:'User write boundary permits only work and this material directory.'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({baseline_files:all.length,work_files:walk(work).length,out}));
