// Parse only complete public JSON return values. A truncated value or non-JSON
// prefix/suffix invalidates the batch; saved page files alone are not evidence.
export function publicJsonObjects(raw){
 if(typeof raw!=='string')return [];
 const values=[];let at=0;
 while(at<raw.length){
  while(at<raw.length&&/\s/.test(raw[at]))at++;
  if(at===raw.length)break;
  if(raw[at]!=='{'&&raw[at]!=='[')return [];
  const start=at;let depth=0,quoted=false,escaped=false,complete=false;
  for(;at<raw.length;at++){
   const c=raw[at];
   if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;continue;}
   if(c==='"'){quoted=true;continue;}
   if(c==='{'||c==='[')depth++;
   else if(c==='}'||c===']'){
    if(--depth===0){at++;complete=true;break;}
   }
  }
  if(!complete)return [];
  try{const v=JSON.parse(raw.slice(start,at));values.push(...(Array.isArray(v)?v:[v]));}catch{return [];}
 }
 return values.filter(v=>v&&typeof v==='object'&&!Array.isArray(v));
}
