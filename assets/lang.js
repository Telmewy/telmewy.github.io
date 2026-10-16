// Language switch: picks RU or EN (saved choice, else browser language), shows matching [data-lang] blocks.
(function () {
  var LANGS = ['ru', 'en'];
  var RU_LIKE = ['ru', 'uk', 'be', 'kk', 'ky', 'uz', 'tg', 'hy', 'az'];
  var root = document.documentElement;

  function saved() {
    try { var s = localStorage.getItem('site-lang'); return LANGS.indexOf(s) >= 0 ? s : null; } catch (e) { return null; }
  }
  function detect() {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]).toLowerCase().slice(0, 2);
      if (RU_LIKE.indexOf(l) >= 0) return 'ru';
      if (l === 'en') return 'en';
    }
    return 'en';
  }

  var style = document.createElement('style');
  style.textContent =
    'html[data-ui-lang="ru"] [data-lang="en"], html[data-ui-lang="en"] [data-lang="ru"] { display:none !important; }' +
    '.lang-switch { display:inline-flex; margin-left:1.25em; border:1px solid var(--border, #e5e7eb); border-radius:999px; overflow:hidden; vertical-align:middle; }' +
    '.lang-switch button { font:inherit; font-size:0.85em; font-weight:600; padding:0.2em 0.75em; border:0; background:transparent; color:var(--muted, #6b7280); cursor:pointer; }' +
    '.lang-switch button[aria-pressed="true"] { background:var(--accent, #4f46e5); color:#fff; }';
  document.head.appendChild(style);

  var defaultTitle = null;
  function apply(lang) {
    root.setAttribute('data-ui-lang', lang);
    root.lang = lang;
    if (defaultTitle === null) defaultTitle = document.title;
    var t = document.querySelector('meta[name="title-' + lang + '"]');
    document.title = t ? t.content : defaultTitle;
    var btns = document.querySelectorAll('.lang-switch button');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-set') === lang ? 'true' : 'false');
  }

  var current = saved() || detect();
  root.setAttribute('data-ui-lang', current);

  document.addEventListener('DOMContentLoaded', function () {
    var host = document.querySelector('header nav') || document.querySelector('header') || document.body;
    var sw = document.createElement('span');
    sw.className = 'lang-switch';
    sw.setAttribute('role', 'group');
    sw.setAttribute('aria-label', 'Language');
    LANGS.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = l.toUpperCase();
      b.setAttribute('data-set', l);
      b.addEventListener('click', function () {
        current = l;
        try { localStorage.setItem('site-lang', l); } catch (e) {}
        apply(l);
      });
      sw.appendChild(b);
    });
    host.appendChild(sw);
    apply(current);
  });
})();
