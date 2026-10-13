(function () {
  function init() {
    var el = document.getElementById('uo-db-external-test');
    if (el) {
      el.textContent = '外部JavaScriptの読み込み成功！';
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
