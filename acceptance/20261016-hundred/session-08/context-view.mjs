import fs from 'node:fs';
import {stage} from './run-cli.mjs';
const x=JSON.parse(fs.readFileSync(stage+'/context-'+process.argv[2]+'.json','utf8'));
console.log('CONTINUITY KEYS',Object.keys(x.continuity));
function slim(v){if(typeof v==='string')return v.split('；')[0];if(Array.isArray(v))return v.map(slim);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,a])=>[k,slim(a)]));return v;}
const c=x.continuity;console.log('SELECTED',JSON.stringify(c.recall));console.log('AUTHOR',JSON.stringify(Object.fromEntries(Object.entries(c.author).map(([id,e])=>[id,{statement:e.statement,status:e.status,due:e.due_unit,custody:e.custody}]))));console.log('KNOWLEDGE',JSON.stringify(slim(c.characters)));
