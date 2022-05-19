<style lang="stylus">
  @import "../../styles/constants.styl"

  .editor-container
    flex 1
    position relative
    > *
      position absolute
  .editor
    height 100%

  #aceEditor
    width 100%
    background linear-gradient(to right, #3d3d3d 42px, #202020 42px) // to prevent white screen before ace editor loaded

  .form-centered
    margin 0
    left 50%
    top 30%
    transform translate(-50%, -50%)

  .errorHighlight
    position absolute
    z-index 20
    background-color mix(colorError, transparent)
</style>

<template>
  <div class="editor-container">
    <div id="aceEditor" class="editor"></div>

    <div v-show="showNeedToLogin" class="standalone-form form-centered">
      <div class="title">
        <div class="primary">Для отправки решений необходимо <router-link to="/signin">авторизоваться</router-link></div>
      </div>
    </div>
  </div>
</template>

<script>
  let ace;

  export default {
    data() {
      return {
        aceEditor: null,
        showNeedToLogin: false,
        isMounted: false,
        textWhenMounted: "",
        onMountAction: () => {},

        errorHighLightMarkers: [],
      }
    },

    async mounted() {
      ace = await this.importAce()

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
      async importAce() {
        const { default: ace } = await import('ace-builds')

        await import('ace-builds/src-noconflict/theme-ambiance')


        await import('ace-builds/src-noconflict/mode-makefile')

        await import('ace-builds/src-noconflict/mode-c_cpp')
        await import('ace-builds/src-noconflict/mode-python')
        await import('ace-builds/src-noconflict/mode-golang')
        await import('ace-builds/src-noconflict/mode-java')
        await import('ace-builds/src-noconflict/mode-pascal')
        await import('ace-builds/src-noconflict/mode-lua')

        await import('ace-builds/src-noconflict/mode-json')

        return ace
      },

      async waitForAce() {
        return new Promise(function(resolve) {
          const interval = setInterval(function() {
            if (this.aceEditor !== null) {
              clearInterval(interval)
              resolve()
            }
          }.bind(this), 1)
        }.bind(this))
      },

      async resize() {
        await this.waitForAce()
        this.aceEditor.resize()
      },
      async onChangeAction() {
        await this.waitForAce()
        const text = this.aceEditor.getValue();
        this.$emit('editorChange', text);
        this.clearMarkers();
      },
      async setText(text, name = null, disableChangeEmit = true) {
        await this.waitForAce()

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

      async setSyntaxHighlighting(name) {
        await this.waitForAce()

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
      async setReadOnly(state) {
        await this.waitForAce()
        this.aceEditor.setReadOnly(state);
      },

      setOnMountAction(callback) {
        this.onMountAction = callback;
      },

      async setAnnotations(annotations) {
        await this.waitForAce();
        this.aceEditor.session.setAnnotations(annotations);
        this.clearMarkers();
        for (const ann of annotations) {
          this.errorHighLightMarkers.push(this.aceEditor.session.addMarker(new ace.Range(ann.row, 0, ann.row, 144),"errorHighlight","fullLine"));
        }
      },
      clearAnnotations(annotations) {
        this.aceEditor.session.clearAnnotations();

      },
      clearMarkers() {
        for (const marker of this.errorHighLightMarkers) {
          this.aceEditor.session.removeMarker(marker);
        }
      }
    }
  }
</script>
