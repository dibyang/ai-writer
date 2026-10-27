import fs from 'node:fs';const P='D:/work/other/ai-writer/acceptance/20261021-long-flow-090-x/scenario/东岸末班船-再扩展验证',r=JSON.parse(fs.readFileSync(P+'/.writer/state.json')).revision,mode=process.argv[2];let input;
if(mode==='old'){input={expected_revision:r,operation_id:'cr-freeze33-initial',ref:'大纲/单元/0033.json',version_id:'CR33_INITIAL',previous:null};}
if(mode==='new'){let p=JSON.parse(fs.readFileSync(P+'/.writer/cr-inputs/plan33.json'));p.recall_ids=p.recall_ids.map(x=>x==='P_X_COAT'?'P_W_COAT':x);fs.writeFileSync(P+'/大纲/单元/0033-cr-v2.json',JSON.stringify(p,null,2)+'\n',{flag:'wx'});input={expected_revision:r,operation_id:'cr-freeze33-correct-id',ref:'大纲/单元/0033.json',file:'大纲/单元/0033-cr-v2.json',version_id:'CR33_RECALL_ID_V2',previous:'CR33_INITIAL'};}
if(mode==='impact')input={version_id:'CR33_RECALL_ID_V2',from:33,mode:'future'};
fs.writeFileSync(P+'/.writer/cr-inputs/source33-'+mode+'.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log({mode,r,input});
