import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const stage=import.meta.dirname;
const project=path.resolve(stage,'../works/潮汐信号');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const [mode,...args]=process.argv.slice(2);
if(mode==='ledger'){
  const names=fs.readdirSync(path.join(stage,'commands')).filter(n=>n.endsWith('-status-full-current.stdout.txt'));
  const file=path.join(stage,'commands',names.sort().at(-1));
  const value=JSON.parse(fs.readFileSync(file,'utf8'));
  const ledger=value.snapshot.ledger;
  const entries=Object.entries(ledger);
  for(let i=0;i<entries.length;i+=11){
    const target=path.join(stage,`current-ledger-${1+Math.floor(i/11)}.json`);
    fs.writeFileSync(target,JSON.stringify({source:file,source_sha256:sha(file),entries:Object.fromEntries(entries.slice(i,i+11))},null,2),'utf8');
    console.log(target);
  }
  console.log('ledger_count='+entries.length);
  const anchors=new Map();
  for(const [,v] of entries)for(const e of v.evidence??[])anchors.set(`${e.unit}:${e.draft}:${e.sha256}`,e);
  fs.writeFileSync(path.join(stage,'ledger-anchor-map.json'),JSON.stringify([...anchors.values()].map(({unit,draft,sha256})=>({unit,draft,sha256})),null,2),'utf8');
  for(let i=0;i<entries.length;i+=11){
    const content=entries.slice(i,i+11).map(([id,v])=>{
      const parts=[`## ${id}`];
      for(const [k,val] of Object.entries(v)){
        if(k==='evidence'){parts.push('evidence（每项的正文路径与SHA见ledger-anchor-map.json，各unit无歧义）:');for(const e of val)parts.push(`- unit=${e.unit}; line=${e.line}; quote=${JSON.stringify(e.quote)}`);}
        else if(k==='character_known'){parts.push('character_known:');for(const [n,t]of Object.entries(val))parts.push(`- ${n}: ${t}`);}
        else parts.push(`${k}: ${JSON.stringify(val)}`);
      }
      return parts.join('\n');
    }).join('\n\n');
    fs.writeFileSync(path.join(stage,`ledger-reading-${1+Math.floor(i/11)}.md`),content+'\n','utf8');
  }
}
if(mode==='read-log'){
  const manifest=JSON.parse(fs.readFileSync(path.resolve(stage,args[0]),'utf8'));
  for(const item of manifest){
    const file=path.isAbsolute(item.path)?item.path:path.resolve(project,item.path);
    const lines=fs.readFileSync(file,'utf8').split('\n').length;
    const row={at:new Date().toISOString(),path:file.replaceAll('\\','/'),sha256:sha(file),range:item.range??`1-${lines}`,purpose:item.purpose,method:'full text read in model tool output; hash calculation only binds that read',...item};
    row.path=file.replaceAll('\\','/');
    fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify(row)+'\n','utf8');
  }
  console.log('logged='+manifest.length);
}
if(mode==='counts'){
  const files=fs.readdirSync(path.join(project,'正文')).filter(n=>/^00(2[5-9]|30)-.*\.md$/.test(n)).sort();
  for(const name of files){const p=path.join(project,'正文',name);const t=fs.readFileSync(p,'utf8').replace(/^#.*\r?\n/gm,'');console.log(JSON.stringify({path:'正文/'+name,han:(t.match(/\p{Script=Han}/gu)||[]).length,sha256:sha(p)}));}
}
