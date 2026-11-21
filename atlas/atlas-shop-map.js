/* Britannia Atlas / Wiki map integration test, stage 7.
 * Read-only: loads public shop rows, does not submit edits.
 * The Wiki should load this via a short #javascript bridge.
 */
(function () {
  'use strict';
  var ROOT_ID = 'atlas-shop-map-root';
  var API = 'https://uo-atlas-player-shops.quicksilver0918.workers.dev/api/shops';
  var SHARDS = ['Asuka','Yamato','Izumo','Wakoku','Hokuto','Mizuho','Sakura','Mugen','Atlantic','Catskills','Chesapeake','Great Lakes','Lake Austin','Legends','Pacific','Sonoma','Baja','Lake Superior','Europa','Drachenfels','Arirang','Balhae','Formosa','Oceania'];
  var MAP_BOUNDS = [[0, 0], [4096, 7168]];
  var IMAGE_NAME = 'atlas_trammel_test.png';
  function start() {
    var root = document.getElementById(ROOT_ID);
    if (!root) { return; }
    if (root.dataset.initialized === 'yes') { return; }
    root.dataset.initialized = 'yes';
    function elem(id) { return root.querySelector('[data-atlas="' + id + '"]'); }
    var status = elem('status'), shardSelect = elem('shard'), results = elem('results'), count = elem('count');
    var mapBox = elem('map'), coord = elem('coordinates'), search = elem('search');
    if (!status) { return; }
    status.textContent = '外部JS実行中：画面部品を確認しています';
    var required = ['shard','results','count','map','coordinates','search','reload'];
    var missing = required.filter(function (key) { return !elem(key); });
    if (missing.length) { status.textContent = '画面部品が見つかりません：' + missing.join(', '); status.style.background = '#a11e37'; return; }
    function report(message, type) {
      status.textContent = message;
      status.style.background = type === 'ok' ? '#08783d' : type === 'error' ? '#a11e37' : '#956500';
    }
    try {
      SHARDS.forEach(function (shard) { shardSelect.add(new Option(shard, shard)); });
    } catch (error) { report('シャード一覧の作成に失敗：' + error.message, 'error'); return; }
    report('シャード一覧OK・地図画像を確認中');
    shardSelect.value = 'Asuka';
    var images = document.querySelectorAll('img'), imageUrl = '';
    for (var i = 0; i < images.length; i++) {
      var src = images[i].getAttribute('src') || '';
      if (src.indexOf(IMAGE_NAME) !== -1) {
        imageUrl = images[i].src;
        images[i].style.display = 'none';
        break;
      }
    }
    if (!imageUrl) { report('画像を検出できません（添付PNGとref構文を確認）', 'error'); return; }
    var map, layer, shops = [], markerLookup = new Map();
    function render() {
      if (!map) { return; }
      layer.clearLayers(); markerLookup.clear(); results.replaceChildren();
      var q = search.value.toLowerCase().trim(), shard = shardSelect.value, visible = 0;
      shops.forEach(function (shop) {
        if (!shop || shop.shard !== shard || shop.facet !== 'Trammel') { return; }
        var x = Number(shop.x), y = Number(shop.y);
        if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 7168 || y < 0 || y > 4096) { return; }
        var haystack = [shop.name, shop.category, shop.services].join(' ').toLowerCase();
        if (q && haystack.indexOf(q) < 0) { return; }
        visible++;
        var latlng = [4096 - y, x];
        var marker = L.circleMarker(latlng, {
          radius: 8, color: '#fff', fillColor: '#e79536', fillOpacity: 1, weight: 2
        }).addTo(layer);
        var popup = document.createElement('div');
        var title = document.createElement('strong'); title.textContent = String(shop.name || '店舗');
        var detail = document.createElement('div'); detail.textContent = shard + ' / X' + x + ' Y' + y;
        popup.append(title, detail); marker.bindPopup(popup);
        markerLookup.set(shop.id, marker);
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = (shop.name || '店舗') + '　X' + x + ' Y' + y;
        button.style.cssText = 'display:block;width:100%;text-align:left;background:#254e61;color:#fff;padding:8px;margin:3px 0;border:1px solid #7599a4;cursor:pointer';
        button.addEventListener('click', function () { map.panTo(latlng); marker.openPopup(); });
        results.appendChild(button);
      });
      count.textContent = '表示 ' + visible + ' / 全' + shops.length + '件';
      if (!visible) { results.textContent = 'この条件の店舗はありません'; }
    }
    async function refresh() {
      report('店舗データを読み込み中…');
      try {
        var response = await fetch(API, { cache: 'no-store' });
        if (!response.ok) { throw new Error('HTTP ' + response.status); }
        var json = await response.json();
        if (!json || json.ok !== true || !Array.isArray(json.shops)) { throw new Error(json.error || '応答形式が不正です'); }
        shops = json.shops;
        render();
        report('店舗読込成功：' + shops.length + '件（Trammelの店舗をシャード別に表示）', 'ok');
      } catch (e) { report('店舗読込失敗：' + e.message, 'error'); }
    }
    function setupMap() {
      try {
        map = L.map(mapBox, { crs: L.CRS.Simple, minZoom: -5, maxZoom: 3, zoomSnap: 0.25 });
        L.imageOverlay(imageUrl, MAP_BOUNDS).addTo(map);
        map.fitBounds(MAP_BOUNDS);
        layer = L.layerGroup().addTo(map);
        map.on('click', function (e) {
          coord.textContent = 'クリック位置 X ' + Math.round(e.latlng.lng) + ' / Y ' + Math.round(4096 - e.latlng.lat);
        });
        elem('reload').addEventListener('click', refresh);
        shardSelect.addEventListener('change', render);
        search.addEventListener('input', render);
        setTimeout(function () { map.invalidateSize(); }, 250);
        refresh();
      } catch (e) { report('地図初期化失敗：' + e.message, 'error'); }
    }
    if (window.L) { report('Leaflet検出・地図を初期化中'); setupMap(); return; }
    report('Leafletを読み込み中');
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = function () { report('Leaflet読込成功・地図初期化中'); setupMap(); };
    script.onerror = function () { report('Leafletの外部読み込みに失敗しました', 'error'); };
    document.head.appendChild(script);
  }
  function safeStart() {
    try { start(); } catch (error) {
      var root = document.getElementById(ROOT_ID);
      var status = root && root.querySelector('[data-atlas="status"]');
      if (status) { status.textContent = '外部JS実行エラー：' + error.message; status.style.background = '#a11e37'; }
    }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', safeStart); }
  else { safeStart(); }
})();
