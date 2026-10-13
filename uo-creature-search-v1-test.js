(function () {
  'use strict';
  function init() {
    var root = document.getElementById('uo-creature-json-v10');
    if (!root || root.getAttribute('data-ready') === '1') return;
    root.setAttribute('data-ready', '1');
    var $ = function (id) { return root.querySelector('#' + id); };
    var rows = [
      ['模擬:normal','unspecified','900001',{'stats.hp':[100,200],'stats.str':[50,70],'stats.dex':[20,30],'stats.int':[0,0]}],
      ['模擬:pet','unspecified','900002',{'taming_difficulty':[104.7,104.7],slots:[4,5]}],
      ['試験ボス','unspecified','900003',{'stats.hp':[50000,50000,'estimated']}],
      ['模擬:summon','unspecified','900004',{'stats.hp':[117,117],'stats.mana':[128,128]}],
      ['模擬:companion','unspecified','900005',{'stats.hp':[100,200]}],
      ['模擬:companion','unspecified','900005',{'stats.hp':[10,20]}],
      ['試験機械 (made)','unspecified','900006',{loyalty:[0,0]}],
      ['模擬:tamed','wild','900007',{'stats.hp':[100,200]}],
      ['模擬:tamed','tamed','900007',{'stats.hp':[50,100]}],
      ['模擬:trained','trained','900008',{training_slots:[5,5]}],
      ['模擬:resistant','unspecified','900009',{'resists.physical':[0,5],'resists.fire':[10,15],'resists.cold':[20,25],'resists.poison':[30,35],'resists.energy':[40,45]}],
      ['模擬:mage','unspecified','900010',{'skills.wrestling':[70.1,80.2],'skills.resisting_spells':[90,100],'skills.poisoning':[0,0],'skills.eval_int':[45,62]}],
      ['模擬:unknown','unspecified','900011',{'stats.hp':[100,110],'stats.mana':[null,null,'partial_or_unknown']}],
      ['模擬:loot','unspecified','900012',{gold:[1500,2000]}],
      ['模擬:karma','unspecified','900013',{karma:[-4500,-2500],bard_difficulty:[81.4,81.4]}],
      ['模擬:damage','unspecified','900014',{'damage.base':[12,23],'attack.physical':[100,100]}],
      ['模擬:conflict','unspecified','900015',{'stats.hp':[[100,200],[110,210]]}]
    ].map(function(x){ return {display_name:x[0],state:x[1],page_key:'uo88:'+x[2],properties:x[3],aliases:x[2]==='900002'?['試験ペット、別名']:[]}; });
    var keys=['stats.hp','stats.stam','stats.mana','stats.str','stats.dex','stats.int','resists.physical','resists.fire','resists.cold','resists.poison','resists.energy','skills.wrestling','damage.base','taming_difficulty','slots','gold'];
    var labels={'stats.hp':'HP','stats.stam':'スタミナ','stats.mana':'マナ','stats.str':'STR','stats.dex':'DEX','stats.int':'INT','resists.physical':'物理抵抗','resists.fire':'炎抵抗','resists.cold':'冷気抵抗','resists.poison':'毒抵抗','resists.energy':'エネルギー抵抗','skills.wrestling':'格闘','damage.base':'基本ダメージ','taming_difficulty':'テイム値',slots:'Slot',gold:'Gold'};
    rows.forEach(function(r){Object.keys(r.properties).forEach(function(k){if(keys.indexOf(k)<0)keys.push(k);});});
    keys.forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=labels[k]||k;$('property').appendChild(o);});
    ['unspecified','wild','tamed','trained'].forEach(function(s){var o=document.createElement('option');o.value=s;o.textContent=s;$('state').appendChild(o);});
    $('property').value='stats.hp';
    var sortKey='display_name',ascending=true;
    function info(r){
      var val=r.properties[$('property').value];
      if(!val)return {label:'記録なし',status:'未記載',sort:null,count:0,observations:[]};
      var obs=Array.isArray(val[0])?val:[val];
      if(obs.length>1)return {label:'複数候補 ('+obs.length+'件)',status:'要照合',sort:null,count:obs.length,observations:obs};
      var a=obs[0],status=a[2]||'recorded';
      if(status==='estimated')return {label:'推定値',status:'推定',sort:null,count:1,observations:obs};
      if(status!=='recorded'||a[0]===null||a[1]===null)return {label:'不明・未確定',status:status,sort:null,count:1,observations:obs};
      return {label:a[0]===a[1]?String(a[0]):a[0]+'～'+a[1],status:'記録値',sort:a[$('bound').value==='max'?1:0],count:1,observations:obs};
    }
    function td(tr,text) {var c=document.createElement('td');c.textContent=String(text==null?'':text);c.style.cssText='padding:7px;border-bottom:1px solid #d8e1e9;white-space:nowrap;background:#fff';tr.appendChild(c);return c;}
    function draw(){
      var q=$('q').value.trim().toLowerCase(), st=$('state').value, least=$('atleast').value, most=$('atmost').value;
      var a=rows.map(function(r,i){return {r:r,i:i,m:info(r)};}).filter(function(x){
        if(q && [x.r.display_name].concat(x.r.aliases).join(' ').toLowerCase().indexOf(q)<0)return false;
        if(st!=='all'&&x.r.state!==st)return false;
        if(least!==''&&(x.m.sort===null||x.m.sort<Number(least)))return false;
        if(most!==''&&(x.m.sort===null||x.m.sort>Number(most)))return false;
        return true;
      });
      a.sort(function(x,y){
        var va=sortKey==='value'?x.m.sort:sortKey==='status'?x.m.status:sortKey==='observations'?x.m.count:x.r[sortKey];
        var vb=sortKey==='value'?y.m.sort:sortKey==='status'?y.m.status:sortKey==='observations'?y.m.count:y.r[sortKey];
        if(va==null&&vb==null)return x.i-y.i;if(va==null)return 1;if(vb==null)return -1;
        var c=typeof va==='number'&&typeof vb==='number'?va-vb:String(va).localeCompare(String(vb),'ja');
        return (ascending?c:-c)||x.i-y.i;
      });
      var body=$('tbody');while(body.firstChild)body.removeChild(body.firstChild);
      a.forEach(function(x){
        var tr=document.createElement('tr');
        var name=td(tr,x.r.display_name);name.style.position='sticky';name.style.left='0';name.style.background='#f4f8fc';name.style.zIndex='1';
        td(tr,x.r.state);td(tr,x.r.page_key);td(tr,x.m.label);td(tr,x.m.status);td(tr,x.m.count);
        var cell=td(tr,'');var btn=document.createElement('button');btn.type='button';btn.textContent='観測を見る';
        btn.addEventListener('click',function(){var p=document.createElement('p');p.textContent=x.r.display_name+' / '+$('property').value+' : '+(x.m.observations.length?x.m.observations.map(function(v){return v[0]+'～'+v[1]+' ('+(v[2]||'recorded')+')';}).join(' | '):'記録なし');$('details').textContent='';$('details').appendChild(p);});
        cell.appendChild(btn);body.appendChild(tr);
      });
      $('count').textContent='表示 '+a.length+' 行 / 全 '+rows.length+' 行（模擬データ）';
    }
    ['q','state','property','bound','atleast','atmost'].forEach(function(id){$(id).addEventListener(id==='q'||id==='atleast'||id==='atmost'?'input':'change',draw);});
    $('clear').addEventListener('click',function(){['q','atleast','atmost'].forEach(function(id){$(id).value='';});$('state').value='all';$('property').value='stats.hp';$('bound').value='min';$('details').textContent='';draw();});
    root.querySelectorAll('th[data-key]').forEach(function(th){th.addEventListener('click',function(){var k=th.getAttribute('data-key');if(k===sortKey)ascending=!ascending;else{sortKey=k;ascending=true;}draw();});});
    draw();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());
