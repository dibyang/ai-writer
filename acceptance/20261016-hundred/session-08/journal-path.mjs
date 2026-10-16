import fs from 'node:fs';
import {project} from './run-cli.mjs';
for(const d of fs.readdirSync(project+'/.writer',{withFileTypes:true}).filter(x=>x.isDirectory()))console.log(d.name,fs.readdirSync(project+'/.writer/'+d.name).slice(0,4));
const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8'));console.log('UNIT KEYS',Object.keys(s.units.at(-1)));console.log('UNIT 72',JSON.stringify(s.units.at(-1),null,2).slice(0,3000));
