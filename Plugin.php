<?php

    namespace Kanboard\Plugin\CssStylesheetEditorAce;

    use Kanboard\Core\Plugin\Base;
    use Kanboard\Core\Translator;

    class Plugin extends Base
    {
        public function initialize()
        {
            // JS (served from 'self' for CSP)
            $this->hook->on('template:layout:js', ['template' => 'plugins/CssStylesheetEditorAce/Assets/ace/ace.js']);
            $this->hook->on('template:layout:js',
                ['template' => 'plugins/CssStylesheetEditorAce/Assets/ace/ext-beautify.js']);
            $this->hook->on('template:layout:js', ['template' => 'plugins/CssStylesheetEditorAce/Assets/init.js']);

            // Inject i18n placeholders into the page
            $this->template->hook->attach('template:config:application', 'CssStylesheetEditorAce:partials/i18n');
        }

        public function onStartup()
        {
            // Load plugin translations
            Translator::load($this->languageModel->getCurrentLanguage(), __DIR__.'/Locale');
        }

        public function getPluginName()
        {
            return 'CSS Stylesheet Editor - ACE';
        }

        public function getPluginDescription()
        {
            return 'CSS Stylesheet Editor with ACE syntax highlighting and beautify';
        }

        public function getPluginAuthor()
        {
            return 'R. Valentin - rivdesign.fr';
        }

        public function getPluginVersion()
        {
            return '1.0.0';
        }

        public function getCompatibleVersion()
        {
            return '>=1.2.0';
        }
    }
