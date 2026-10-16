import fs from 'node:fs';
import crypto from 'node:crypto';
const base='acceptance/20261016-expanded/session-c';
const project='acceptance/20261016-expanded/works/潮汐信号';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8'));
const refs=['writer.json','.writer/state.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/角色卡.md','大纲/全书大纲.md',...['V1','V2','V3','V4'].map(v=>'大纲/分卷/'+v+'.json'),...s.units.map(u=>u.draft),'审查/session-b-0001-0008模型知情复核.md'];
fs.writeFileSync(base+'/recovery-sources.json',JSON.stringify({revision:s.revision,read_kind:'actual-file-read-model-informed',sources:Object.fromEntries(refs.map(p=>[p,hash(fs.readFileSync(project+'/'+p))])),ledger:s.snapshot.ledger,characters:s.snapshot.characters},null,2)+'\n');
fs.writeFileSync(base+'/plan-0009.json',JSON.stringify({unit:9,title:'灯还留着',goal:'返回旧站兑现整理责任，明确灯语到期缺证，找到可问的场地经手人',change:'唐穗首次获告现厅细节与灯语口述；留下原灯查核窗口，联系许成但还没见图',beats:['第3日午后实走返回旧站，共同挪干桌和核通知位置，唐穗表达迟告后的不信任','沈禾告知现六号寄存和接驳所见，并明确罗敬灯语仅口述；两人外墙看灯不通电不拆','唐穗从当前维修联系人中联系许成，沈禾电话约三点二十去河街五金铺，只获自称留有维修图','沈禾先完成散页与当日留存单；灯义仍未知、原件不随意搬走'],cast:['沈禾','唐穗'],setting_refs:['设定/角色卡.md','大纲/全书大纲.md'],research_refs:[],arc_id:'A3',recall_ids:Object.keys(s.snapshot.ledger),forbidden:['灯语凭回忆结案或改due9','唐穗周砚顾遥自动亲见牌','把联系人口述当作已得图','揭露罗敬私因']},null,2)+'\n');
