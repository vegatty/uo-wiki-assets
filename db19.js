(function(){
function init(){
var root=document.getElementById('uo-creature-json-v10');if(!root)return;
var get=function(id){return root.querySelector('#'+id)};
var count=get('count'),body=get('tbody'),prop=get('property'),state=get('state');
try{
count.textContent='JS起動成功・データ準備中';
var keys=[['hp','HP'],['str','STR'],['fire','炎抵抗'],['slots','Slot']];
prop.textContent='';
keys.forEach(function(p){var o=document.createElement('option');o.value=p[0];o.textContent=p[1];prop.appendChild(o)});
var data=[['模擬A','unspecified',{hp:[100,150],str:[50,70]}],['模擬B','wild',{hp:[260,320],fire:[10,15]}],['模擬C','tamed',{hp:[800,1000],slots:[4,5]}]];
state.textContent='';
['all','unspecified','wild','tamed'].forEach(function(s){var o=document.createElement('option');o.value=s;o.textContent=s==='all'?'すべて':s;state.appendChild(o)});
function draw(){
var q=get('q').value.toLowerCase(),st=state.value,k=prop.value,low=get('atleast').value,high=get('atmost').value,bound=get('bound').value==='max'?1:0;
body.textContent='';var shown=0;
data.forEach(function(r){
var n=r[2][k],v=n?n[bound]:null;
if(r[0].toLowerCase().indexOf(q)<0||(st!=='all'&&r[1]!==st)||(low!==''&&(v===null||v<Number(low)))||(high!==''&&(v===null||v>Number(high))))return;
var tr=document.createElement('tr');
[r[0],r[1],'模擬',n?n.join('～'):'記録なし','試験',n?1:0,''].forEach(function(t){var td=document.createElement('td');td.textContent=t;tr.appendChild(td)});
body.appendChild(tr);shown++;
});count.textContent='JS起動成功・表示 '+shown+' / '+data.length+' 件（模擬）';
}
['q','atleast','atmost'].forEach(function(id){get(id).addEventListener('input',draw)});
['state','property','bound'].forEach(function(id){get(id).addEventListener('change',draw)});
get('clear').addEventListener('click',function(){get('q').value='';get('atleast').value='';get('atmost').value='';state.value='all';prop.value='hp';draw()});
draw();
}catch(e){count.textContent='JS実行エラー：'+e.name+' '+e.message;}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());