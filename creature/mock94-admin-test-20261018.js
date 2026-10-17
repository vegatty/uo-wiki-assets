/* UO DB admin test: fictional 94 rows only; no game data. */
(function(){
"use strict";
function init(){
const el=id=>document.getElementById(id);
if(!el("q")||!el("body"))return;
const keys=["stats.hp","stats.stam","stats.mana","stats.str","stats.dex","stats.int","resists.physical","resists.fire","resists.cold","resists.poison","resists.energy","damage.base","attack.physical","attack.fire","attack.cold","attack.poison","attack.energy","skills.wrestling","skills.tactics","skills.resisting_spells","skills.anatomy","skills.poisoning","skills.magery","skills.eval_int","skills.meditation"];
const names={"stats.hp":"HP","stats.stam":"スタミナ","stats.mana":"マナ","stats.str":"STR","stats.dex":"DEX","stats.int":"INT","resists.physical":"物理抵抗","resists.fire":"炎抵抗","resists.cold":"冷気抵抗","resists.poison":"毒抵抗","resists.energy":"エネルギー抵抗","damage.base":"攻撃力"};
const label=k=>names[k]||k;
const rows=Array.from({length:94},(_,i)=>{
let n=i+1,p={};
keys.forEach((k,j)=>{const b=j<6?40+(n*17+j*13)%770:5+(n*7+j*3)%86;
p[k]=((n+j)%19===0)?"???":((n+j)%23===0)?"-":[b,b+(n+j)%8]});
return {name:"テスト生物"+String(n).padStart(3,"0"),page:"mock:"+n,properties:p,slot:1+n%5,taming:n%7===0?(n+".5"):"-",note:"模擬データ。実在のUO生物の記録ではありません"};
});
let sortKey="name",sortAsc=true,page=0;
const numericOptions=keys.map(k=>{const o=document.createElement("option");o.value=k;o.textContent=label(k);return o});
for(const id of ["filterKey","filterKey2"]){const s=el(id);if(!s)continue;for(const o of numericOptions)s.appendChild(o.cloneNode(true));}
el("filterKey").value="stats.hp";
function num(r,k,side){const x=r.properties[k];if(!Array.isArray(x))return null;return x[side];}
function match(r,k,l,h){if(!k)return true;if(l===""&&h==="")return true;const mode=el("bound").value;const a=num(r,k,0),b=num(r,k,1);if(a===null||b===null)return false;let lo=a,hi=b;if(mode==="minimum")hi=a;if(mode==="maximum")lo=b;if(l!==""&&lo<Number(l))return false;if(h!==""&&hi>Number(h))return false;return true;}
function display(x){if(Array.isArray(x))return x[0]===x[1]?String(x[0]):x[0]+"～"+x[1];return x??"-";}
function draw(){
const group=el("group").value;
const selected=group==="all"?keys:keys.filter(k=>k.startsWith(group+".")||(group==="pet"&&false));
let filtered=rows.filter(r=>r.name.toLowerCase().includes(el("q").value.trim().toLowerCase())&&match(r,el("filterKey").value,el("min").value,el("max").value)&&match(r,el("filterKey2").value,el("min2").value,el("max2").value));
filtered.sort((a,b)=>{let x=sortKey==="name"?a.name:num(a,sortKey,0),y=sortKey==="name"?b.name:num(b,sortKey,0);if(x===null)x=Infinity;if(y===null)y=Infinity;return (typeof x==="number"&&typeof y==="number"?x-y:String(x).localeCompare(String(y),"ja"))*(sortAsc?1:-1)});
const size=el("pageSize").value==="all"?Math.max(1,filtered.length):Number(el("pageSize").value),pages=Math.max(1,Math.ceil(filtered.length/size));page=Math.min(page,pages-1);
el("count").textContent=filtered.length+" / 94件（模擬）";el("pageInfo").textContent=(page+1)+" / "+pages+"ページ";el("pagePrev").disabled=page<=0;el("pageNext").disabled=page>=pages-1;
const head=el("head"),body=el("body");head.replaceChildren();body.replaceChildren();
const tr=document.createElement("tr");for(const k of ["name",...selected]){const th=document.createElement("th");th.textContent=k==="name"?"名称":label(k);th.addEventListener("click",()=>{sortAsc=sortKey===k?!sortAsc:true;sortKey=k;draw()});tr.appendChild(th);}head.appendChild(tr);
for(const r of filtered.slice(page*size,(page+1)*size)){
const row=document.createElement("tr"),name=document.createElement("td");name.textContent=r.name;row.appendChild(name);
for(const k of selected){const td=document.createElement("td"),btn=document.createElement("button");btn.type="button";btn.textContent=display(r.properties[k]);btn.addEventListener("click",()=>{el("details").textContent=r.name+" / "+label(k)+" : "+display(r.properties[k])+"\n出典：架空の検証用データ（mock）\n現行UOの数値ではありません。";});td.appendChild(btn);row.appendChild(td);}body.appendChild(row);}
}
for(const id of ["q","group","filterKey","filterKey2","min","max","min2","max2","bound","pageSize"])el(id).addEventListener(id==="q"||id.startsWith("min")||id.startsWith("max")?"input":"change",()=>{page=0;draw()});
el("pagePrev").addEventListener("click",()=>{page=Math.max(0,page-1);draw()});
el("pageNext").addEventListener("click",()=>{page++;draw()});
el("reset").addEventListener("click",()=>{for(const id of ["q","min","max","min2","max2"])el(id).value="";el("group").value="all";el("filterKey").value="stats.hp";el("filterKey2").value="";el("bound").value="range";page=0;draw()});
draw();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();