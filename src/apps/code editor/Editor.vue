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
        <div class="primary">Для отправки решений необходимо авторизоваться</div>
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
      }
    },
    mounted() {
      this.aceEditor = ace.edit('aceEditor');
      this.aceEditor.setOptions({
        fontSize: '12pt',
        tabSize: 4,
        useSoftTabs: false,
      });

      // this.aceEditor.setValue(localStorage.getItem('code') || "");
      this.aceEditor.on('change', () => {
        const text = this.aceEditor.getValue();
        //localStorage.setItem('code', text);
        this.$emit('editorChange', text);
      });

      this.aceEditor.setTheme('ace/theme/ambiance');
      this.aceEditor.session.setMode('ace/mode/c_cpp');

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
      setText(text) {
        this.aceEditor.setValue(text, 1); // ', 1' to disable selection
      }
    }
  }
</script>
