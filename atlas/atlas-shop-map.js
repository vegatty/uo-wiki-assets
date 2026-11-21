/* Britannia Atlas stage 7 — display-only Wiki shop map.
 * Public data GET only; no mutations or credentials.
 * All widget controls are created by this script to avoid @Wiki HTML sanitization.
 */
(function () {
  'use strict';
  var ROOT_ID = 'atlas-shop-map-root';
  var API = 'https://uo-atlas-player-shops.quicksilver0918.workers.dev/api/shops';
  var SHARDS = ['Asuka','Yamato','Izumo','Wakoku','Hokuto','Mizuho','Sakura','Mugen','Atlantic','Catskills','Chesapeake','Great Lakes','Lake Austin','Legends','Pacific','Sonoma','Baja','Lake Superior','Europa','Drachenfels','Arirang','Balhae','Formosa','Oceania'];
  var BOUNDS = [[0,0],[4096,7168]];
  function node(tag, parent, text, css) {
    var n = document.createElement(tag);
    if (text != null) n.textContent = text;
    if (css) n.style.cssText = css;
    if (parent) parent.appendChild(n);
    return n;
  }
  function run() {
    var root = document.getElementById(ROOT_ID);
    if (!root || root.getAttribute('data-loaded') === 'yes') return;
    root.setAttribute('data-loaded','yes');
    root.replaceChildren();
    root.style.cssText = 'background:#173747;color:white;padding:12px;border:2px solid #b08b4c;';
    var status = node('div',root,'外部スクリプト起動済み','padding:10px;text-align:center;background:#986000;color:white;font-weight:bold;');
    function report(message, kind) {
      status.textContent = message;
      status.style.background = kind === 'ok' ? '#08783d' : kind === 'error' ? '#a11e37' : '#986000';
    }
    var controls = node('div',root,null,'margin:10px 0;display:flex;flex-wrap:wrap;gap:8px;align-items:center;');
    node('span',controls,'シャード');
    var shardSelect = node('select',controls,null,'padding:7px;color:#222;');
    SHARDS.forEach(function (shard) { var opt=node('option',shardSelect,shard);opt.value=shard; });
    shardSelect.value = 'Asuka';
    node('span',controls,'検索');
    var search = node('input',controls,null,'padding:7px;min-width:160px;');
    search.type='search';search.placeholder='店舗名・設備';
    var reload = node('button',controls,'店舗再読込','padding:7px;cursor:pointer;color:#222;');
    reload.type='button';
    var count = node('span',controls,'');
    var mapBox = node('div',root,null,'height:470px;width:100%;background:#093247;');
    var coordinates = node('div',root,'地図をクリックするとX/Y座標を表示','padding:8px;');
    var results = node('div',root,'','max-height:160px;overflow:auto;border:1px solid #7599a4;padding:8px;');
    var imageUrl = '';
    Array.prototype.forEach.call(document.querySelectorAll('img'),function (im) {
      if (imageUrl) return;
      var src = im.getAttribute('src') || '';
      if (src.indexOf('atlas_trammel_test.png') >= 0) { imageUrl=im.src;im.style.display='none'; }
    });
    if (!imageUrl) { report('画像が見つかりません：atlas_trammel_test.png の添付を確認', 'error'); return; }
    var map,layer,shops=[];
    function render() {
      if (!layer) return;
      layer.clearLayers();
      results.replaceChildren();
      var visible=0, query=search.value.toLowerCase().trim(), shard=shardSelect.value;
      shops.forEach(function (s) {
        if (!s || s.shard !== shard || s.facet !== 'Trammel') return;
        var x=Number(s.x),y=Number(s.y);
        if (!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>7168||y<0||y>4096) return;
        if (query && [s.name,s.category,s.services].join(' ').toLowerCase().indexOf(query)<0) return;
        visible++;
        var pos=[4096-y,x];
        var marker=L.circleMarker(pos,{radius:8,color:'#fff',weight:2,fillColor:'#e79536',fillOpacity:1}).addTo(layer);
        var popup=node('div',null),title=node('strong',popup,String(s.name||'店舗'));
        node('div',popup,s.shard+' / X'+x+' Y'+y);
        marker.bindPopup(popup);
        var b=node('button',results,String(s.name||'店舗')+'　X'+x+' Y'+y,'display:block;width:100%;text-align:left;background:#254e61;color:#fff;padding:8px;margin:3px 0;border:1px solid #7599a4;cursor:pointer;');
        b.type='button';
        b.addEventListener('click',function () { map.panTo(pos);marker.openPopup(); });
      });
      count.textContent='表示 '+visible+' / 全'+shops.length+'件';
      if (!visible) node('div',results,'該当する店舗はありません');
    }
    async function refresh() {
      report('Cloudflareの店舗情報を読込中...');
      try {
        var res=await fetch(API,{cache:'no-store'});
        if (!res.ok) throw new Error('HTTP '+res.status);
        var body=await res.json();
        if (!body || body.ok!==true || !Array.isArray(body.shops)) throw new Error('応答の形式が不正です');
        shops=body.shops;render();report('店舗読込成功：'+shops.length+'件','ok');
      } catch (err) { report('店舗読込エラー：'+err.message,'error'); }
    }
    function startMap() {
      try {
        if (!window.L) throw new Error('Leafletが利用できません');
        map=L.map(mapBox,{crs:L.CRS.Simple,minZoom:-5,maxZoom:3,zoomSnap:0.25});
        L.imageOverlay(imageUrl,BOUNDS).addTo(map);
        map.fitBounds(BOUNDS);
        layer=L.layerGroup().addTo(map);
        map.on('click',function (e) { coordinates.textContent='X '+Math.round(e.latlng.lng)+' / Y '+Math.round(4096-e.latlng.lat); });
        shardSelect.addEventListener('change',render);
        search.addEventListener('input',render);
        reload.addEventListener('click',refresh);
        setTimeout(function () {map.invalidateSize();},250);
        refresh();
      } catch(e) { report('地図初期化エラー：'+e.message,'error'); }
    }
    if (window.L) {startMap();return;}
    report('Leafletを読み込んでいます...');
    var css=node('link',document.head);
    css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    var script=node('script',document.head);
    script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload=startMap;
    script.onerror=function () {report('Leafletの読み込みに失敗しました','error');};
  }
  function safeRun() {
    try {run();} catch (e) {
      var root=document.getElementById(ROOT_ID);
      if (root) {root.textContent='外部スクリプトエラー：'+e.message;root.style.color='#fff';root.style.background='#a11e37';}
    }
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',safeRun);
  else safeRun();
})();
