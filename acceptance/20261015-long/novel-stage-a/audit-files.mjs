import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const stage = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(stage, '../../..');
const project = path.resolve(stage, '../works/末班寄存柜');
const hash = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function files(base, rel='') {
  return fs.readdirSync(path.join(base, rel), {withFileTypes:true}).flatMap(e => {
    const r=path.posix.join(rel,e.name);
    return e.isDirectory() ? files(base,r) : [r];
  });
}
const mode=process.argv[2];
if (mode==='baseline') {
  const protectedFiles=['bin','lib','tests','.agents/skills'].flatMap(d=>files(root,d));
  fs.writeFileSync(path.join(stage,'protected-baseline.json'),JSON.stringify(Object.fromEntries(protectedFiles.map(f=>[f,hash(path.join(root,f))])),null,2)+'\n');
  const copies=['.writer/tool','.agents/skills'].flatMap(d=>files(project,d));
  const provenance=copies.map(f=>({path:f,sha256:hash(path.join(project,f)),source:f.startsWith('.writer/tool/')?f.slice('.writer/tool/'.length):f,source_sha256:hash(path.join(root,f.startsWith('.writer/tool/')?f.slice('.writer/tool/'.length):f))}));
  fs.writeFileSync(path.join(stage,'copied-provenance.json'),JSON.stringify({license_reference:'../../../LICENSE.md (root repository; read only)',files:provenance},null,2)+'\n');
  console.log(JSON.stringify({protected_files:protectedFiles.length,copied_files:copies.length,copies_equal:provenance.every(x=>x.sha256===x.source_sha256)}));
} else if (mode==='final') {
  const before=JSON.parse(fs.readFileSync(path.join(stage,'protected-baseline.json'),'utf8'));
  const changed=Object.keys(before).filter(f=>!fs.existsSync(path.join(root,f))||hash(path.join(root,f))!==before[f]);
  const chapters=files(project,'正文').filter(f=>f.endsWith('.md')).map(f=>{
    const text=fs.readFileSync(path.join(project,f),'utf8');
    const body=text.replace(/^#.*\r?\n/u,'');
    return {path:f,sha256:hash(path.join(project,f)),han_count:(body.match(/\p{Script=Han}/gu)||[]).length,body_characters:Array.from(body.replace(/\s/gu,'')).length};
  });
  const provenance=JSON.parse(fs.readFileSync(path.join(stage,'copied-provenance.json'),'utf8'));
  const copiedChanged=provenance.files.filter(f=>!fs.existsSync(path.join(project,f.path))||hash(path.join(project,f.path))!==f.sha256).map(f=>f.path);
  const result={audited_at:new Date().toISOString(),protected_changed:changed,copied_changed:copiedChanged,chapters};
  fs.writeFileSync(path.join(stage,'final-file-audit.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} else throw new Error('use baseline|final');
