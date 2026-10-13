(function(){
function init(){
var r=document.getElementById('uo-creature-json-v10');if(!r)return;
var $=function(id){return r.querySelector('#'+id)},out=$('count');
out.textContent='データ取得中';
fetch('https://vegatty.github.io/uo-wiki-assets/creatures-test-v12.json').then(function(x){if(!x.ok)throw Error(x.status);return x.json()}).then(function(d){
if(!d||!Array.isArray(d.rows))throw Error('データ形式');
var all=[['stats.hp','HP'],['stats.str','STR'],['stats.dex','DEX'],['stats.int','INT'],['resists.physical','物理'],['resists.fire','炎'],['resists.cold','冷気'],['resists.poison','毒'],['resists.energy','エネ'],['taming_difficulty','テイム'],['slots','Slot'],['skills.wrestling','格闘']];
var modes={all:all,stats:all.slice(0,4),resists:all.slice(4,9),pet:all.slice(9,11),skills:all.slice(11)};
var p=$('property'),st=$('state'),table=r.querySelector('table'),head=table.querySelector('thead'),body=$('tbody'),sort='name',asc=true;
r.style.maxWidth='100%';r.style.width='100%';table.style.minWidth='950px';
var bar=document.createElement('label'),mode=document.createElement('select');bar.textContent='表示列：';
[['all','すべて'],['stats','基本能力'],['resists','属性抵抗'],['pet','ペット'],['skills','スキル']].forEach(function(a){var o=document.createElement('option');o.value=a[0];o.textContent=a[1];mode.appendChild(o)});bar.appendChild(mode);
bar.style.cssText='display:block;background:#e7f0f8;padding:8px;margin:8px 0';table.parentElement.parentElement.insertBefore(bar,table.parentElement);
p.textContent='';all.forEach(function(a){var o=document.createElement('option');o.value=a[0];o.textContent=a[1];p.appendChild(o)});
st.textContent='';['all','unspecified','wild','tamed','trained'].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v==='all'?'すべて':v;st.appendChild(o)});
function metric(x,k){var a=x.properties[k]||[];if(!a.length)return ['－',null];if(a.length>1)return ['複数('+a.length+')',null];var v=a[0];if(v.status==='estimated')return ['推定',null];if(v.status!=='recorded'||typeof v.min!=='number'||typeof v.max!=='number')return ['?',null];return [v.min===v.max?String(v.min):v.min+'～'+v.max,v[$('bound').value==='max'?'max':'min']]}
function draw(){
var cols=modes[mode.value],q=$('q').value.toLowerCase(),state=st.value,lo=$('atleast').value,hi=$('atmost').value,key=p.value;
var a=d.rows.filter(function(x){var n=metric(x,key)[1];return [x.name].concat(x.aliases||[]).join(' ').toLowerCase().indexOf(q)>=0&&(state==='all'||x.state===state)&&(lo===''||(n!==null&&n>=Number(lo)))&&(hi===''||(n!==null&&n<=Number(hi)))});
a.sort(function(x,y){var u=sort==='name'?x.name:sort==='state'?x.state:metric(x,sort)[1],v=sort==='name'?y.name:sort==='state'?y.state:metric(y,sort)[1];if(u===null)return v===null?0:1;if(v===null)return -1;var n=typeof u==='number'&&typeof v==='number'?u-v:String(u).localeCompare(String(v),'ja');return asc?n:-n});
head.textContent='';var h=document.createElement('tr');[['name','生物名'],['state','状態']].concat(cols).forEach(function(c,i){var th=document.createElement('th');th.textContent=c[1]+' ↕';th.style.cssText='position:sticky;top:0;background:#274660;color:white;padding:8px;white-space:nowrap;cursor:pointer;z-index:3';if(i===0){th.style.left='0';th.style.zIndex='5'}th.onclick=function(){if(sort===c[0])asc=!asc;else{sort=c[0];asc=true}draw()};h.appendChild(th)});head.appendChild(h);
body.textContent='';a.forEach(function(x){var tr=document.createElement('tr');[x.name,x.state].concat(cols.map(function(c){return metric(x,c[0])[0]})).forEach(function(v,i){var td=document.createElement('td');td.textContent=v;td.style.cssText='padding:7px;white-space:nowrap;border-bottom:1px solid #ccd8e0;background:white';if(!i){td.style.position='sticky';td.style.left='0';td.style.background='#eef5fa'}tr.appendChild(td)});body.appendChild(tr)});
out.textContent='横並び・列切替：'+a.length+' / '+d.rows.length+' 件（模擬）'}
['q','atleast','atmost'].forEach(function(k){$(k).addEventListener('input',draw)});['state','property','bound'].forEach(function(k){$(k).addEventListener('change',draw)});mode.onchange=draw;
$('clear').onclick=function(){$('q').value='';$('atleast').value='';$('atmost').value='';st.value='all';p.value='stats.hp';mode.value='all';draw()};draw()
}).catch(function(e){out.textContent='読込エラー：'+e.message})
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()
}());