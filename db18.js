(function(){
function init(){
var r=document.getElementById('uo-creature-json-v10');if(!r)return;
var $=function(id){return r.querySelector('#'+id)};
var data=[
['試験A','unspecified',100,150],['試験B','unspecified',260,320],['試験C','unspecified',800,1000],
['模擬ペット','unspecified',120,180],['模擬召喚','unspecified',117,117],['模擬仲間','unspecified',100,200],
['模擬仲間','unspecified',10,20],['模擬機械','unspecified',null,null],
['模擬調教','wild',100,200],['模擬調教','tamed',50,100],['模擬育成','trained',null,null],
['模擬抵抗','unspecified',80,95],['模擬魔法','unspecified',150,250],
['模擬不明','unspecified',100,null],['模擬戦利品','unspecified',160,180],
['模擬ダメージ','unspecified',200,260],['模擬相違','unspecified',[[100,200],[110,210]],null]
];
var st=$('state'),pr=$('property'),sort=0,asc=true;
var labels={hp:'HP',str:'STR',dex:'DEX',intl:'INT',physical:'物理抵抗',fire:'炎抵抗',cold:'冷気抵抗',poison:'毒抵抗',energy:'エネルギー抵抗',wrestling:'格闘',tame:'テイム値',slots:'Slot',gold:'Gold'};
pr.textContent='';Object.keys(labels).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=labels[k];pr.appendChild(o)});
var extra={3:{tame:[104.7,104.7],slots:[4,5]},11:{physical:[0,5],fire:[10,15],cold:[20,25],poison:[30,35],energy:[40,45]},12:{wrestling:[70.1,80.2]},14:{gold:[1500,2000]},0:{str:[50,70],dex:[20,30],intl:[0,0]}};
data.forEach(function(row,i){row[4]=extra[i]||{}});
['unspecified','wild','tamed','trained'].forEach(function(s){var o=document.createElement('option');o.value=s;o.textContent=s;st.appendChild(o)});
function metric(x){var key=pr.value,p=key==='hp'?[x[2],x[3]]:x[4][key];if(!p)return {label:'記録なし',n:null,obs:0,detail:'記録なし'};
if(Array.isArray(p[0]))return {label:'複数候補 ('+p.length+'件)',n:null,obs:p.length,detail:p.map(function(v){return v.join('～')}).join(' / ')};
var v=p[0],w=p[1];if(v===null||w===null)return {label:'不明・未確定',n:null,obs:0,detail:'未確定'};
return {label:v===w?String(v):v+'～'+w,n:$('bound').value==='max'?w:v,obs:1,detail:v+'～'+w};}
function draw(){
var q=$('q').value.toLowerCase(),state=st.value,min=$('atleast').value,max=$('atmost').value;
var arr=data.map(function(x,i){return {x:x,i:i,m:metric(x)};}).filter(function(a){
return a.x[0].toLowerCase().indexOf(q)>=0&&(state==='all'||state===a.x[1])&&(min===''||(a.m.n!==null&&a.m.n>=Number(min)))&&(max===''||(a.m.n!==null&&a.m.n<=Number(max)));});
arr.sort(function(a,b){var av=sort===0?a.x[0]:sort===1?a.x[1]:sort===3?a.m.n:a.i;var bv=sort===0?b.x[0]:sort===1?b.x[1]:sort===3?b.m.n:b.i;
if(av==null)return bv==null?a.i-b.i:1;if(bv==null)return -1;
var v=typeof av==='number'&&typeof bv==='number'?av-bv:String(av).localeCompare(String(bv),'ja');return (asc?v:-v)||a.i-b.i;});
var body=$('tbody');body.textContent='';arr.forEach(function(a){
var tr=document.createElement('tr');var vals=[a.x[0],a.x[1],'模擬',a.m.label,a.m.obs===2?'要照合':'模擬',a.m.obs];
vals.forEach(function(v){var td=document.createElement('td');td.textContent=v;td.style.padding='6px';tr.appendChild(td)});
var td=document.createElement('td'),b=document.createElement('button');b.textContent='観測を見る';b.type='button';b.onclick=function(){$('details').textContent=a.x[0]+' : '+a.m.detail};td.appendChild(b);tr.appendChild(td);body.appendChild(tr)});
$('count').textContent='表示 '+arr.length+' 件 / 全17件（模擬）';}
['q','atleast','atmost'].forEach(function(id){$(id).addEventListener('input',draw)});
['state','property','bound'].forEach(function(id){$(id).addEventListener('change',draw)});
$('clear').onclick=function(){$('q').value='';st.value='all';pr.value='hp';$('atleast').value='';$('atmost').value='';$('bound').value='min';$('details').textContent='';draw()};
r.querySelectorAll('th[data-key]').forEach(function(th,i){th.addEventListener('click',function(){if(sort===i)asc=!asc;else{sort=i;asc=true}draw()})});
draw();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());