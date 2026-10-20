import fs from 'node:fs';
import path from 'node:path';
import {base,save,sha} from './common.mjs';
const n=process.argv[2],raw=fs.readFileSync(path.join(base,`commands/r1-preview-${n}/stdout.raw.txt`)),v=JSON.parse(raw);
function render(x,depth=0){const flat=JSON.stringify(x);if(flat.length<=1800)return flat;const pad=' '.repeat(depth),child=' '.repeat(depth+2);if(Array.isArray(x))return '[\n'+x.map(y=>child+render(y,depth+2)).join(',\n')+'\n'+pad+']';return '{\n'+Object.entries(x).map(([k,y])=>child+JSON.stringify(k)+': '+render(y,depth+2)).join(',\n')+'\n'+pad+'}';}
const output=render(v);if(JSON.stringify(JSON.parse(output))!==JSON.stringify(v))throw Error('not lossless');save(`r1-preview-${n}-readable.txt`,`Raw preview SHA256 ${sha(raw)}; lossless JSON whitespace reformat only.\n${output}\n`);
