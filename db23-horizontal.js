(function(){
function init(){
 var root=document.getElementById('uo-creature-json-v10');if(!root)return;
 var get=function(id){return root.querySelector('#'+id)},status=get('count');
 status.textContent='横並び比較表のデータ取得中…';
 fetch('https://vegatty.github.io/uo-wiki-assets/creatures-test-v12.json?v=1').then(function(res){if(!res.ok)throw Error('HTTP '+res.status);return res.json()}).then(function(data){
 if(!data||data.kind!=='synthetic'||data.schema!=='creature-ui-bridge-1'||!Array.isArray(data.rows))throw Error('試験データ形式不一致');
 var rows=data.rows,columns=[['stats.hp','HP'],['stats.str','STR'],['stats.dex','DEX'],['stats.int','INT'],['resists.physical','物理'],['resists.fire','炎'],['resists.cold','冷気'],['resists.poison','毒'],['resists.energy','エネ'],['taming_difficulty','テイム値'],['slots','Slot']];
 var table=root.querySelector('table'),thead=table.querySelector('thead'),body=get('tbody'),wrap=table.parentElement,sort='name',asc=true;
 wrap.style.overflow='auto';wrap.style.maxHeight='440px';table.style.minWidth='1450px';
 thead.textContent='';var hr=document.createElement('tr');
 function heading(key,label){var th=document.createElement('th');th.textContent=label+' ↕';th.style.cssText='position:sticky;top:0;background:#274660;color:white;padding:8px;white-space:nowrap;cursor:pointer;z-index:3';if(key==='name'){th.style.left='0';th.style.zIndex='5'}th.onclick=function(){if(sort===key)asc=!asc;else{sort=key;asc=true}draw()};hr.appendChild(th)}
 heading('name','生物名');heading('state','状態');columns.forEach(function(c){heading(c[0],c[1])});thead.appendChild(hr);
 get('bound').value='min';
 var property=get('property');property.textContent='';columns.forEach(function(c){var o=document.createElement('option');o.value=c[0];o.textContent=c[1];property.appendChild(o)});
 var state=get('state');state.textContent='';['all','unspecified','wild','tamed','trained'].forEach(function(s){var o=document.createElement('option');o.value=s;o.textContent=s==='all'?'すべて':s;state.appendChild(o)});
 var notice=root.querySelector('#details');notice.textContent='※ 模擬データ。－は未掲載、?は推定・不明、複数は別の観測候補。';
 function metric(row,key){var arr=row.properties[key]||[];if(!arr.length)return {text:'－',sort:null};if(arr.length>1)return {text:'複数 ('+arr.length+')',sort:null};
 var a=arr[0];if(a.status==='estimated')return {text:'推定',sort:null};if(a.status!=='recorded'||typeof a.min!=='number'||typeof a.max!=='number')return {text:'?',sort:null};
 return {text:a.min===a.max?String(a.min):a.min+'～'+a.max,sort:a[get('bound').value==='max'?'max':'min']};}
 function draw(){
 var q=get('q').value.toLowerCase(),st=state.value,key=property.value,lo=get('atleast').value,hi=get('atmost').value;
 var a=rows.map(function(r,i){return {r:r,i:i}}).filter(function(x){var r=x.r,v=metric(r,key).sort;
 return [r.name].concat(r.aliases||[]).join(' ').toLowerCase().indexOf(q)>=0&&(st==='all'||r.state===st)&&(lo===''||(v!==null&&v>=Number(lo)))&&(hi===''||(v!==null&&v<=Number(hi)))});
 a.sort(function(x,y){var vx=sort==='name'?x.r.name:sort==='state'?x.r.state:metric(x.r,sort).sort,vy=sort==='name'?y.r.name:sort==='state'?y.r.state:metric(y.r,sort).sort;
 if(vx==null)return vy==null?x.i-y.i:1;if(vy==null)return -1;var c=typeof vx==='number'&&typeof vy==='number'?vx-vy:String(vx).localeCompare(String(vy),'ja');return (asc?c:-c)||x.i-y.i});
 body.textContent='';a.forEach(function(x){var tr=document.createElement('tr');function cell(text,first){var td=document.createElement('td');td.textContent=text;td.style.cssText='padding:7px;border-bottom:1px solid #ccd8e0;white-space:nowrap;background:#fff';if(first){td.style.position='sticky';td.style.left='0';td.style.zIndex='2';td.style.background='#eef5fa'}tr.appendChild(td)}
 cell(x.r.name,true);cell(x.r.state);columns.forEach(function(c){cell(metric(x.r,c[0]).text)});body.appendChild(tr)});
 status.textContent='横並び比較：'+a.length+' / '+rows.length+' 件（模擬データ）';
 }
 ['q','atleast','atmost'].forEach(function(id){get(id).addEventListener('input',draw)});
 ['state','property','bound'].forEach(function(id){get(id).addEventListener('change',draw)});
 get('clear').onclick=function(){get('q').value='';get('atleast').value='';get('atmost').value='';state.value='all';property.value='stats.hp';get('bound').value='min';draw()};
 draw();
 }).catch(function(err){status.textContent='横並び版の読み込みエラー：'+err.message});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());
