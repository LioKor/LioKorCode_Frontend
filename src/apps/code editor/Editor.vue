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
  import 'ace-builds/webpack-resolver'

  export default {
    data() {
      return {
        aceEditor: null,
        showNeedToLogin: false,
        isMounted: false,
        textWhenMounted: "",
        onChangeAction: () => {
          const text = this.aceEditor.getValue();
          this.$emit('editorChange', text);
        }
      }
    },
    mounted() {
      this.aceEditor = ace.edit('aceEditor');
      this.isMounted = true;
      this.aceEditor.setValue(this.textWhenMounted, 1); // ', 1' to disable selection

      this.aceEditor.setOptions({
        fontSize: '12pt',
        tabSize: 4,
        useSoftTabs: false,
      });

      this.aceEditor.on('change', this.onChangeAction);

      this.aceEditor.setTheme('ace/theme/ambiance');

      // const scrollbar = document.querySelector('.ace_scrollbar');
      // console.log(scrollbar)
      // scrollbar.classList.add('scrollable');
      // delete scrollbar.style.height;

      if (!this.$store.state.user.isLogined) {
        this.aceEditor.setReadOnly(true);
        this.showNeedToLogin = true;
      }
    },

    methods: {
      resize() {
        this.aceEditor.resize();
      },
      setText(text, name, disableChangeEmit = true) {
        if (!this.isMounted) {
          this.textWhenMounted = text;
        } else {
          if (disableChangeEmit)
            this.aceEditor.removeAllListeners('change');

          this.aceEditor.setValue(text, 1); // ', 1' to disable selection

          if (disableChangeEmit)
            this.aceEditor.on('change', this.onChangeAction);
        }

        this.setSyntaxHighlighting(name);
      },

      setSyntaxHighlighting(name) {
        let mode = 'plain_text';
        if (['GNUmakefile', 'makefile', 'Makefile'].find(el => el === name)) {
          mode = 'makefile';
        }
        const rules = [
          {ends: ['.py'], mode: 'python'},
          {ends: ['.c', '.cpp', '.h', '.cc', '.c++', '.hpp', '.cxx', '.hxx', '.h++'], mode: 'c_cpp'},
          {ends: ['.pas', '.inc'], mode: 'pascal'},
          {ends: ['.kt', '.kts'], mode: 'kotlin'},
          {ends: ['.scala', '.sc'], mode: 'scala'},
          {ends: ['.ts'], mode: 'typescript'},
          {ends: ['.js'], mode: 'javascript'},
          {ends: ['.xml'], mode: 'xml'},
          {ends: ['.yaml'], mode: 'yaml'},
          {ends: ['.json'], mode: 'json'},
          {ends: ['.html'], mode: 'html'},
          {ends: ['.php'], mode: 'php'},
          {ends: ['.pl', 'pm'], mode: 'perl'},
          {ends: ['.java', '.class', '.jar', '.jad', '.jmod'], mode: 'java'},
        ];
        const rule = rules.find(rule => rule.ends.find(end => name.endsWith(end)) !== undefined);
        if (rule)
          mode = rule.mode;
        this.aceEditor.session.setMode('ace/mode/' + mode);
      },
      clear() {
        this.setText('')
      },
      setReadOnly(state) {
        this.aceEditor.setReadOnly(state);
      }
    }
  }
</script>
