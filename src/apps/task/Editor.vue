<template>
  <div class="editor" id="editorBlock">
    <div id="aceEditor"></div>
  </div>
</template>

<script>
  import 'ace-builds'
  import 'ace-builds/webpack-resolver'

  export default {
    mounted() {
      this.aceEditor = ace.edit('editorBlock');
      this.aceEditor.setOptions({
        fontSize: '12pt',
      });

      // editor.setTheme('ace/theme/dawn');
      this.aceEditor.session.setMode('ace/mode/c_cpp');
    }
  }
</script>