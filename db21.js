(function(){
function init(){
 var root=document.getElementById('uo-creature-json-v10');if(!root)return;
 var $=function(id){return root.querySelector('#'+id)};
 var info=$('count'),data=window.UO_CREATURE_BRIDGE;
 if(!data||data.schema!=='creature-ui-bridge-1'){info.textContent='試験データ未読込';return;}
 var rows=data.rows,sel=$('property'),st=$('state'),sort='name',asc=true;
 var names={'stats.hp':'HP','stats.str':'STR','stats.dex':'DEX','stats.int':'INT','stats.stam':'スタミナ','stats.mana':'マナ','resists.physical':'物理抵抗','resists.fire':'炎抵抗','resists.cold':'冷気抵抗','resists.poison':'毒抵抗','resists.energy':'エネルギー抵抗','skills.wrestling':'格闘','taming_difficulty':'テイム値','slots':'Slot','gold':'Gold'};
 var keys=Object.keys(names);rows.forEach(function(r){Object.keys(r.properties).forEach(function(k){if(keys.indexOf(k)<0)keys.push(k)})});
 sel.textContent='';keys.forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=names[k]||k;sel.appendChild(o)});sel.value='stats.hp';
 var states=['unspecified','wild','tamed','trained'];rows.forEach(function(r){if(states.indexOf(r.state)<0)states.push(r.state)});
 states.forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;st.appendChild(o)});
 function inspect(r){var a=r.properties[sel.value]||[];if(!a.length)return {label:'記録なし',n:null,status:'未掲載',cnt:0,all:a};
 if(a.length>1)return {label:'複数候補 ('+a.length+'件)',n:null,status:'要照合',cnt:a.length,all:a};
 var o=a[0];if(o.status!=='recorded'||typeof o.min!=='number'||typeof o.max!=='number')return {label:o.status==='estimated'?'推定値':'不明・非数値',n:null,status:o.status||'未確認',cnt:1,all:a};
 return {label:o.min===o.max?String(o.min):o.min+'～'+o.max,n:$('bound').value==='max'?o.max:o.min,status:'記録値',cnt:1,all:a}}
 function draw(){var q=$('q').value.toLowerCase(),sv=st.value,lo=$('atleast').value,hi=$('atmost').value;
 var a=rows.map(function(r,i){return {r:r,i:i,m:inspect(r)}}).filter(function(x){return [x.r.name].concat(x.r.aliases).join(' ').toLowerCase().indexOf(q)>=0&&(sv==='all'||x.r.state===sv)&&(lo===''||(x.m.n!==null&&x.m.n>=Number(lo)))&&(hi===''||(x.m.n!==null&&x.m.n<=Number(hi)))});
 a.sort(function(x,y){var u=sort==='value'?x.m.n:sort==='state'?x.r.state:x.r.name,v=sort==='value'?y.m.n:sort==='state'?y.r.state:y.r.name;if(u==null)return v==null?x.i-y.i:1;if(v==null)return -1;var d=typeof u==='number'&&typeof v==='number'?u-v:String(u).localeCompare(String(v),'ja');return (asc?d:-d)||x.i-y.i});
 var body=$('tbody');body.textContent='';a.forEach(function(x){var tr=document.createElement('tr');[x.r.name,x.r.state,x.r.page,x.m.label,x.m.status,x.m.cnt].forEach(function(v){var cell=document.createElement('td');cell.textContent=v;cell.style.padding='6px';tr.appendChild(cell)});var td=document.createElement('td'),b=document.createElement('button');b.type='button';b.textContent='観測を見る';b.onclick=function(){$('details').textContent=x.r.name+' / '+sel.value+'：'+(x.m.all.map(function(o){return [o.min,o.max,o.status,o.source,o.note].join(' / ')}).join(' | ')||'記録なし')};td.appendChild(b);tr.appendChild(td);body.appendChild(tr)});
 info.textContent='玲奈形式の模擬データ：'+a.length+' / '+rows.length+' 件'}
 ['q','atleast','atmost'].forEach(function(k){$(k).addEventListener('input',draw)});['state','property','bound'].forEach(function(k){$(k).addEventListener('change',draw)});
 $('clear').onclick=function(){$('q').value='';st.value='all';sel.value='stats.hp';$('atleast').value='';$('atmost').value='';$('bound').value='min';$('details').textContent='';draw()};
 root.querySelectorAll('th[data-key]').forEach(function(th){th.addEventListener('click',function(){var key=th.getAttribute('data-key');key=key==='value'?'value':key==='state'?'state':'name';if(sort===key)asc=!asc;else{sort=key;asc=true}draw()})});draw();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());
