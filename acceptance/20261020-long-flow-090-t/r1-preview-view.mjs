import fs from 'node:fs';
import path from 'node:path';
import {base,save,sha} from './common.mjs';
const n=process.argv[2],raw=fs.readFileSync(path.join(base,`commands/r1-preview-${n}/stdout.raw.txt`));
const lines=[`Raw preview SHA256 ${sha(raw)}; lossless scalar-path view; empty arrays and objects retained.`];
function visit(v,at=[]){if(v===null||typeof v!=='object'||Object.keys(v).length===0)lines.push(JSON.stringify(at)+' = '+JSON.stringify(v));else for(const [k,x] of Object.entries(v))visit(x,[...at,k]);}
visit(JSON.parse(raw));save(`r1-preview-${n}-scalar-view.txt`,lines.join('\n')+'\n');
