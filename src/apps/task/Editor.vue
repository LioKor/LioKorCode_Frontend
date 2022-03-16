<style lang="stylus">
  .editor
    height 100%
</style>

<template>
  <div id="editorBlock">
    <div  id="aceEditor" class="editor"></div>
  </div>
</template>

<script>
  import 'ace-builds'
  import 'ace-builds/webpack-resolver'
  import ApiRequest from "../../utils/requests";

  export default {
    data() {
      return {
        api: null,
        aceEditor: null
      }
    },
    mounted() {
      this.api = new ApiRequest('http://code.liokor.com/api/v1');

      this.aceEditor = ace.edit('aceEditor');
      this.aceEditor.setOptions({
        fontSize: '12pt',
      });

      //this.aceEditor.setTheme('ace/theme/dawn');
      this.aceEditor.session.setMode('ace/mode/c_cpp');

      this.aceEditor.setValue(localStorage.getItem('code') || "");

      console.log(this.$root.storage.str);
    }
  }
</script>
