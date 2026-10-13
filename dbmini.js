(function(){
function init(){
var root=document.getElementById('uo-creature-json-v10');
if(!root)return;
var data=[['試験A',100,150],['試験B',260,320],['試験C',800,1000]];
var q=root.querySelector('#q'),body=root.querySelector('#tbody'),count=root.querySelector('#count');
var property=root.querySelector('#property');
property.innerHTML='<option value="hp">HP</option>';
function draw(){
var word=q.value.toLowerCase(),list=data.filter(function(x){return x[0].toLowerCase().indexOf(word)>=0;});
var low=root.querySelector('#atleast').value,high=root.querySelector('#atmost').value;
list=list.filter(function(x){return (low===''||x[1]>=Number(low))&&(high===''||x[1]<=Number(high));});
body.textContent='';
list.forEach(function(x){
var tr=document.createElement('tr');
[x[0],'unspecified','試験用',x[1]+'～'+x[2],'模擬',1,''].forEach(function(v){var td=document.createElement('td');td.textContent=v;tr.appendChild(td);});
body.appendChild(tr);
});
count.textContent='表示 '+list.length+' 件 / 全3件（模擬）';
}
q.addEventListener('input',draw);
root.querySelector('#atleast').addEventListener('input',draw);
root.querySelector('#atmost').addEventListener('input',draw);
root.querySelector('#clear').addEventListener('click',function(){q.value='';root.querySelector('#atleast').value='';root.querySelector('#atmost').value='';draw();});
draw();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
}());