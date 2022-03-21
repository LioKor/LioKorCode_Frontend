<style lang="stylus">
  .editor
    height 100%

  .absolute-wrapper
    position relative
    > *
      position absolute
</style>

<template>
  <div id="editorBlock" class="absolute-wrapper">
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
      });

      this.aceEditor.on('change', () => {
        localStorage.setItem('code', this.aceEditor.getValue());
      })

      this.aceEditor.setTheme('ace/theme/ambiance');
      this.aceEditor.session.setMode('ace/mode/c_cpp');

      this.aceEditor.setValue(localStorage.getItem('code') || "");

      // const scrollbar = document.querySelector('.ace_scrollbar');
      // console.log(scrollbar)
      // scrollbar.classList.add('scrollable');
      // delete scrollbar.style.height;

      if (!this.$store.state.user.isLogined) {
        this.aceEditor.setReadOnly(true);
        this.showNeedToLogin = true;
      }
    }
  }
</script>
