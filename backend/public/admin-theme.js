(function () {
  var STORAGE_KEY = 'adminTheme';

  function getTheme() {
    return document.documentElement.classList.contains('admin-theme-light') ? 'light' : 'dark';
  }

  function apply(theme) {
    var root = document.documentElement;
    if (theme === 'light') root.classList.add('admin-theme-light');
    else root.classList.remove('admin-theme-light');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
      /* ignore */
    }
  }

  function syncButton(btn) {
    if (!btn) return;
    var light = getTheme() === 'light';
    btn.setAttribute('aria-pressed', light ? 'true' : 'false');
    btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    btn.setAttribute('title', light ? 'Dark theme' : 'Light theme');
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-admin-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        apply(getTheme() === 'dark' ? 'light' : 'dark');
        document.querySelectorAll('[data-admin-theme-toggle]').forEach(function (b) {
          syncButton(b);
        });
      });
      syncButton(btn);
    });
  });
})();
