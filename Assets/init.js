(function () {
  function pluginRoot() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src') || '';
      if (src.indexOf('/plugins/CssStylesheetEditorAce/Assets/init.js') !== -1) {
        return new URL('../', new URL(src, document.baseURI)).href;
      }
    }
    return '/plugins/CssStylesheetEditorAce/';
  }

  function waitForTextarea(cb) {
    var ta = document.getElementById('form-application_stylesheet');
    if (ta) return cb(ta);
    var obs = new MutationObserver(function () {
      ta = document.getElementById('form-application_stylesheet');
      if (ta) { obs.disconnect(); cb(ta); }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init(ta) {
    if (!window.ace || !ace.edit) return;
    if (document.getElementById('acecss-editor')) return;

    var root = pluginRoot();
    var base = root + 'Assets/ace/';
    ace.config.set('basePath', base);
    if (ace.config.setModuleUrl) {
      ace.config.setModuleUrl('ace/mode/css_worker', base + 'worker-css.js');
    }

    // i18n
    var i18nEl = document.getElementById('acecss-i18n');
    var L = {
      beautify: (i18nEl && i18nEl.dataset.beautify) || 'Beautify',
      copy:     (i18nEl && i18nEl.dataset.copy)     || 'Copy'
    };

    // Styles (no fixed height; dynamic below)
    var style = document.createElement('style');
    style.textContent = '.acecss-toolbar{margin:8px 0;display:flex;gap:8px}.acecss-toolbar button{padding:6px 10px}#acecss-editor{width:100%;border:1px solid #ddd;font-size:16px}';
    document.head.appendChild(style);

    // Toolbar + editor element
    var toolbar = document.createElement('div');
    toolbar.className = 'acecss-toolbar';
    toolbar.innerHTML = '<button type="button" id="acecss-beautify"></button><button type="button" id="acecss-copy"></button>';
    var editorEl = document.createElement('div');
    editorEl.id = 'acecss-editor';
    editorEl.textContent = ta.value;

    ta.style.display = 'none';
    ta.parentNode.insertBefore(toolbar, ta.nextSibling);
    ta.parentNode.insertBefore(editorEl, toolbar.nextSibling);

    // Labels
    document.getElementById('acecss-beautify').textContent = L.beautify;
    document.getElementById('acecss-copy').textContent = L.copy;

    // ACE
    var editor = ace.edit('acecss-editor');
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/css');
    editor.setOptions({ tabSize: 2, useSoftTabs: true, wrap: true, showPrintMargin: false });

    // Dynamic height (~70% viewport)
    function resizeEditor() {
      var h = Math.floor(window.innerHeight * 0.7);
      editorEl.style.height = h + 'px';
      editor.resize();
    }
    window.addEventListener('resize', resizeEditor);
    resizeEditor();

    // Sync on submit
    if (ta.form) ta.form.addEventListener('submit', function () { ta.value = editor.getValue(); });

    // Buttons
    var beautify = (ace.require && ace.require('ace/ext/beautify')) || null;
    document.getElementById('acecss-beautify').addEventListener('click', function () {
      if (beautify) beautify.beautify(editor.session);
    });
    document.getElementById('acecss-copy').addEventListener('click', function () {
      var txt = editor.getValue();
      try { navigator.clipboard.writeText(txt); }
      catch (e) {
        var tmp = document.createElement('textarea');
        tmp.value = txt; document.body.appendChild(tmp); tmp.select();
        document.execCommand('copy'); document.body.removeChild(tmp);
      }
    });
  }

  function start() {
    if (!window.ace || !ace.edit) return;
    waitForTextarea(init);
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
