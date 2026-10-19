import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const B=path.dirname(fileURLToPath(import.meta.url)),H=path.dirname(B),n=Number(process.argv[2]);
if(!Number.isInteger(n)||n<92||n>101)throw Error('Only current batch92–101');
const s=JSON.parse(fs.readFileSync(path.join(B,'session.json'))),report=path.join(B,`semantic-${n}.md`);
const raw=fs.readFileSync(path.join(H,`commands/revise-c-replay-${n}/stdout.raw.txt`));
const rawPath=path.join(B,`replay-${n}.raw.json`);if(!fs.existsSync(rawPath))fs.writeFileSync(rawPath,raw,{flag:'wx'});
const r=JSON.parse(raw),amendPath=path.join(B,`amend-${n}.json`);
if(fs.existsSync(amendPath))for(const e of JSON.parse(fs.readFileSync(amendPath))){let p=r;for(const k of e.path.slice(0,-1))p=p[k];p[e.path.at(-1)]=e.value;}
const reportRef=`审查/H-revise-c-replay-${n}.md`;
fs.copyFileSync(report,path.join(s.workspace,reportRef));
r.replay_review={reviewer:'Codex-H-revise-c-informed-self-review',report:reportRef,draft_sha256:r._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
fs.writeFileSync(path.join(B,`record-${n}.json`),JSON.stringify(r,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({unit:n,expected_revision:r.expected_revision,report:reportRef,amendments:fs.existsSync(amendPath)?JSON.parse(fs.readFileSync(amendPath)).map(x=>x.path.join('.')):[]}));
