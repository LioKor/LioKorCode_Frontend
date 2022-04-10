<style lang="stylus">
  .editor-container
    flex 1
    position relative
    > *
      position absolute
  .editor
    height 100%

  #aceEditor
    width 100%
</style>

<template>
  <div class="editor-container">
    <div id="aceEditor" class="editor"></div>

    <div v-show="showNeedToLogin" class="standalone-form">
      <div class="title">
        <div class="primary">Для отправки решений необходимо <router-link to="/signin">авторизоваться</router-link></div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'ace-builds'

  import 'ace-builds/src-noconflict/theme-ambiance'


  import 'ace-builds/src-noconflict/mode-makefile'

  import 'ace-builds/src-noconflict/mode-c_cpp'
  import 'ace-builds/src-noconflict/mode-python'
  import 'ace-builds/src-noconflict/mode-golang'
  import 'ace-builds/src-noconflict/mode-java'
  import 'ace-builds/src-noconflict/mode-pascal'
  import 'ace-builds/src-noconflict/mode-lua'

  import 'ace-builds/src-noconflict/mode-json'

  export default {
    data() {
      return {
        aceEditor: null,
        showNeedToLogin: false,
        isMounted: false,
        textWhenMounted: "",
        onMountAction: () => {},
      }
    },
    mounted() {
      this.aceEditor = ace.edit('aceEditor');
      this.isMounted = true;
      this.onMountAction();
      this.aceEditor.setValue(this.textWhenMounted, 1); // ', 1' to disable selection

      this.aceEditor.setOptions({
        fontSize: '12pt',
        tabSize: 4
      });

      this.aceEditor.on('change', this.onChangeAction);

      this.aceEditor.setTheme('ace/theme/ambiance');

      const scrollbars = document.querySelectorAll('.ace_scrollbar');
      scrollbars.forEach(scrollbar => scrollbar.classList.add('scrollable'));
      scrollbars[0].style.right = '5px';
      scrollbars[1].style.overflowY = 'hidden';

      if (!this.$store.state.user.isLogined) {
        this.aceEditor.setReadOnly(true);
        this.showNeedToLogin = true;
      }
    },

    methods: {
      resize() {
        this.aceEditor.resize();
      },
      onChangeAction() {
        const text = this.aceEditor.getValue();
        this.$emit('editorChange', text);
      },
      setText(text, name = null, disableChangeEmit = true) {
        if (!this.isMounted) {
          this.textWhenMounted = text;
        } else {
          if (disableChangeEmit)
            this.aceEditor.removeAllListeners('change');

          this.aceEditor.setValue(text, 1); // ', 1' to disable selection

          if (disableChangeEmit)
            this.aceEditor.on('change', this.onChangeAction);
        }

        if (name) {
          this.setSyntaxHighlighting(name);
        }
      },

      setSyntaxHighlighting(name) {
        let mode = 'plain_text';
        if (['GNUmakefile', 'makefile', 'Makefile'].find(el => el === name)) {
          mode = 'makefile';
        }
        const rules = [
          {ends: ['.c', '.cpp', '.h', '.cc', '.c++', '.hpp', '.cxx', '.hxx', '.h++'], mode: 'c_cpp'},
          {ends: ['.py'], mode: 'python'},
          {ends: ['.go'], mode: 'golang'},
          {ends: ['.java', '.class', '.jar', '.jad', '.jmod'], mode: 'java'},
          {ends: ['.pas', '.inc'], mode: 'pascal'},
          {ends: ['.lua'], mode: 'lua'},

          {ends: ['.json'], mode: 'json'},
        ];
        const rule = rules.find(rule => rule.ends.find(end => name.endsWith(end)) !== undefined);
        if (rule)
          mode = rule.mode;

        this.aceEditor.session.setMode('ace/mode/' + mode);
        this.aceEditor.session.setUseSoftTabs(mode !== 'makefile');
      },
      clear() {
        this.setText('')
      },
      setReadOnly(state) {
        this.aceEditor.setReadOnly(state);
      },

      setOnMountAction(callback) {
        this.onMountAction = callback;
      }
    }
  }
</script>
