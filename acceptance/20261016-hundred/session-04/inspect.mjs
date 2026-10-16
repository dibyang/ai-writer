import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const runner=createRunner('acceptance/20261016-hundred/session-04');
const state=runner.json('status-full-initial').snapshot;
for(const [id,x] of Object.entries(state.ledger))console.log(JSON.stringify({id,type:x.type,status:x.status,due:x.due_unit,intro:x.introduced_unit,updated:x.updated_unit,statement:x.statement,custody:x.custody,anchors:x.evidence.length?{first:x.evidence[0].unit,last:x.evidence.at(-1).unit}:null}));
