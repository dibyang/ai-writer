import path from 'node:path';import {project,state,readFilePages} from './ef-lib.mjs';
const [unitArg,startArg,endArg,prefix='ef-baseline']=process.argv.slice(2),u=state().units.find(u=>u.unit===Number(unitArg));if(!u)throw Error('Unknown registered unit');readFilePages(prefix+'-ch'+u.unit,path.join(project,u.draft),Number(startArg??1),endArg?Number(endArg):undefined);
