import {cli,input,rev} from './native-one-helper.mjs';
cli('freeze-position',['source','freeze','--input',input('freeze-position',{expected_revision:rev(),operation_id:'native-one-freeze-position',ref:'设定/作品定位.md',version_id:'POSITION_V1',previous:null})]);
cli('impact-position',['source','impact','--input',input('impact-position',{version_id:'POSITION_V1',from:1,mode:'baseline'})]);
