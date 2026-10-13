(function(){
function init(){
var root=document.getElementById('uo-creature-json-v10');if(!root)return;
var $=function(id){return root.querySelector('#'+id)},out=$('count');
var source=window.UO_CREATURE_TEST_DATA;
if(!source||source.version!=='synthetic-v1'){out.textContent='データ未読込：dbdata17.jsを先に指定';return;}
var rows=source.rows,prop=$('property'),state=$('state'),sort=0,asc=true;
var labels={hp:'HP',str:'STR',dex:'DEX',intl:'INT',physical:'物理抵抗',fire:'炎抵抗',cold:'冷気抵抗',poison:'毒抵抗',energy:'エネルギー抵抗',wrestling:'格闘',tame:'テイム値',slots:'Slot',gold:'Gold'};
prop.textContent='';Object.keys(labels).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=labels[k];prop.appendChild(o)});
['unspecified','wild','tamed','trained'].forEach(function(s){var o=document.createElement('option');o.value=s;o.textContent=s;state.appendChild(o)});
function metric(row){var p=row[2][prop.value];if(p===undefined)return {label:'記録なし',n:null,detail:'記録なし',count:0};if(p===null||p[0]===null||p[1]===null)return {label:'不明',n:null,detail:'未確定',count:0};if(Array.isArray(p[0]))return {label:'複数候補 ('+p.length+'件)',n:null,detail:p.map(function(x){return x.join('～')}).join(' / '),count:p.length};
return {label:p[0]===p[1]?String(p[0]):p.join('～'),n:p[$('bound').value==='max'?1:0],detail:p.join('～'),count:1};}
function draw(){
var q=$('q').value.toLowerCase(),st=state.value,lo=$('atleast').value,hi=$('atmost').value;
var a=rows.map(function(row,i){return {row:row,i:i,m:metric(row)}}).filter(function(x){return x.row[0].toLowerCase().indexOf(q)>=0&&(st==='all'||x.row[1]===st)&&(lo===''||(x.m.n!==null&&x.m.n>=Number(lo)))&&(hi===''||(x.m.n!==null&&x.m.n<=Number(hi)))});
a.sort(function(x,y){var av=sort===0?x.row[0]:sort===1?x.row[1]:sort===3?x.m.n:x.i,bv=sort===0?y.row[0]:sort===1?y.row[1]:sort===3?y.m.n:y.i;if(av==null)return bv==null?x.i-y.i:1;if(bv==null)return -1;var c=typeof av==='number'&&typeof bv==='number'?av-bv:String(av).localeCompare(String(bv),'ja');return (asc?c:-c)||x.i-y.i});
var body=$('tbody');body.textContent='';a.forEach(function(x){var tr=document.createElement('tr');
[x.row[0],x.row[1],'模擬',x.m.label,x.m.count>1?'要照合':'模擬',x.m.count].forEach(function(v){var td=document.createElement('td');td.textContent=v;tr.appendChild(td)});
var td=document.createElement('td'),b=document.createElement('button');b.type='button';b.textContent='観測を見る';b.onclick=function(){$('details').textContent=x.row[0]+'：'+x.m.detail};td.appendChild(b);tr.appendChild(td);body.appendChild(tr)});
out.textContent='外部データ読込成功・表示 '+a.length+' / '+rows.length+' 件（模擬）';}
['q','atleast','atmost'].forEach(function(id){$(id).addEventListener('input',draw)});
['state','property','bound'].forEach(function(id){$(id).addEventListener('change',draw)});
$('clear').onclick=function(){$('q').value='';$('atleast').value='';$('atmost').value='';state.value='all';prop.value='hp';$('bound').value='min';$('details').textContent='';draw()};
root.querySelectorAll('th[data-key]').forEach(function(th,i){th.addEventListener('click',function(){if(sort===i)asc=!asc;else{sort=i;asc=true;}draw()})});draw();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());