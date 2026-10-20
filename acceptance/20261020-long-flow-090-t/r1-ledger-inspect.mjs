import {state,save,read} from './common.mjs';
const s=state(),ids=['O_CURTAIN','T_CURTAIN_RETURN','T_SITE_RETURN','O_RACK_WHEELS','T_RACK_INSPECTION','O_RACK_PATTERN','T_RACK_SAMPLE_VISIT','T_RACK_TRIAL','O_FLAT_CART','T_FLAT_CART_RETURN','T_RACK_REPLACEMENT','O_RACK_PAIR','T_RACK_INSTALL'];
save('r1-ledger-exact-view.jsonl',Object.entries(s.snapshot.ledger).filter(([id,v])=>v.type==='observation'||ids.includes(id)).map(([id,value])=>JSON.stringify({id,value})).join('\n')+'\n');
save('r1-original-journal-view.jsonl',s.units.filter(u=>u.unit>=15).map(u=>JSON.stringify({unit:u.unit,summary:u.summary,journal:u.journal,patch:JSON.parse(read(u.journal)).patch})).join('\n')+'\n');
