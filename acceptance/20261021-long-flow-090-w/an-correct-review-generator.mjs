import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),source=fs.readFileSync(path.join(W,'an-prepare-review.mjs'),'utf8');
if(!source.includes('将已经抬起的手放下来'))throw Error('Exact mistaken quote absent');
const next=source.replace('将已经抬起的手放下来','把已经抬起的手放下来').replace('inputs/an-review-10-15-v1.json','inputs/an-review-10-15-v2.json');
fs.writeFileSync(path.join(W,'an-prepare-review-v2.mjs'),next,{flag:'wx'});
fs.writeFileSync(path.join(W,'an-input-preparation-failure.json'),JSON.stringify({scope:'auxiliary-input-generator-only',exit_code:1,script:'an-prepare-review.mjs',error:'AssertionError [ERR_ASSERTION]: Missing actual quote 10: 将已经抬起的手放下来',actual_quote:'把已经抬起的手放下来',formal_input_written:false,product_state_changed:false,correction:'new generator and input v2; source script retained'},null,2)+'\n',{flag:'wx'});
