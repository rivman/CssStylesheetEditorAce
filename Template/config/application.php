<?php
// Renders a toolbar and transforms the existing textarea (#form-application_stylesheet) into ACE
?>
<style>
  .acecss-toolbar { margin: 8px 0; display: flex; gap: 8px; }
  .acecss-toolbar button { padding: 6px 10px; }
  #acecss-editor { width: 100%; height: 400px; border: 1px solid #ddd; font-size: 16px }
</style>

<div class="acecss-toolbar">
  <button type="button" id="acecss-beautify"><?= t('Beautify') ?></button>
  <button type="button" id="acecss-copy"><?= t('Copy') ?></button>
</div>
<div id="acecss-editor"></div>

<script>
(function(){
  function ready(cb){
    if (window.ace && ace.require) return cb();
    setTimeout(function(){ ready(cb); }, 50);
  }

  ready(function(){
    var ta = document.getElementById('form-application_stylesheet');
    if (!ta) return;

    ta.style.display = 'none';
    var editorEl = document.getElementById('acecss-editor');
    editorEl.textContent = ta.value;

    var editor = ace.edit('acecss-editor');
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/css');
    editor.setOptions({
      tabSize: 2,
      useSoftTabs: true,
      wrap: true,
      showPrintMargin: false,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });

    var form = ta.form;
    if (form) {
      form.addEventListener('submit', function(){
        ta.value = editor.getValue();
      });
    }

    var beautify = ace.require('ace/ext/beautify');
    document.getElementById('acecss-beautify').addEventListener('click', function(){
      beautify.beautify(editor.session);
    });

    document.getElementById('acecss-copy').addEventListener('click', async function(){
      var txt = editor.getValue();
      try { await navigator.clipboard.writeText(txt); }
      catch(e){
        var tmp = document.createElement('textarea');
        tmp.value = txt; document.body.appendChild(tmp); tmp.select();
        document.execCommand('copy'); document.body.removeChild(tmp);
      }
    });
  });
})();
</script>
