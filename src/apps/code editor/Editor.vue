<style lang="stylus">
  .editor
    height 100%
</style>

<template>
  <div id="editorBlock">
    <div id="aceEditor" class="editor"></div>
  </div>
</template>

<script>
  import 'ace-builds'
  import 'ace-builds/webpack-resolver'

  export default {
    data() {
      return {
        aceEditor: null
      }
    },
    mounted() {
      this.aceEditor = ace.edit('aceEditor');
      this.aceEditor.setOptions({
        fontSize: '12pt',
      });

      this.aceEditor.on('change', () => {
        localStorage.setItem('code', this.aceEditor.getValue());
      })

      this.aceEditor.setTheme('ace/theme/ambiance');
      this.aceEditor.session.setMode('ace/mode/c_cpp');

      this.aceEditor.setValue(localStorage.getItem('code') || "");
    }
  }
</script>