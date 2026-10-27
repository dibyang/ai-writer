import {spawnSync} from 'node:child_process';
import {fs,path,base} from './c-utils.mjs';
const privateInfo=JSON.parse(fs.readFileSync(path.join(base,'ddr-revision-private.json'))),[label,...args]=process.argv.slice(2);
if(!label||!args.length)throw new Error('label and command required');
const ws=privateInfo.workspace,token=privateInfo.token;
const r=spawnSync(process.execPath,[path.join(base,'cli.mjs'),label,...args,'--project',ws,'--revision-token',token],{encoding:'utf8',maxBuffer:8*1024*1024});
let out=r.stdout;try{const o=JSON.parse(out);delete o.token;if(o.session)delete o.session.token;out=JSON.stringify(o,null,2);}catch{}
process.stdout.write(out);if(r.stderr)process.stderr.write(r.stderr);process.exit(r.status??1);
