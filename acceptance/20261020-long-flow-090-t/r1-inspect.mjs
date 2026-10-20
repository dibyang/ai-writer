import {save,state} from './common.mjs';
const s=state();
save('r1-baseline-ledger.json',s.snapshot.ledger);
save('r1-baseline-registrations-15-24.json',s.units.filter(u=>u.unit>=15));
console.log(JSON.stringify({snapshot_keys:Object.keys(s.snapshot),ledger_keys:Object.keys(s.snapshot.ledger),unit_keys:Object.keys(s.units[14])}));
