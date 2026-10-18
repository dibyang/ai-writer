import {project,input,cli,hash} from './native-one-helper.mjs';
import {drafts} from './native-one-drafting.mjs';
const source_hashes=Object.fromEntries([1,2,3].map(n=>[drafts[n],hash(project+'/'+drafts[n])]));
cli('review-1-3',['review','--input',input('review-1-3',{from:1,to:3,kind:'model-self-review',report:'审查/连读1-3-初稿.md',source_hashes})]);
