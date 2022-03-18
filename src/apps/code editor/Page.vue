<style lang="stylus">
  @import "../../styles/constants.styl"

  #taskBlock
    background-color white

  .code-editor-page
    height 100%
    color textColor1

  .task-and-editor
    display flex
    height "calc(100vh - %s)" % headerHeight
    touch-action none
    .task
      padding 10px
      overflow-x hidden
      overflow-y auto
      width 30%
      table
        max-width 500px
        width 100%
        border-collapse collapse
        td, th
          border 1px solid #BABABA
          padding 5px
    div#editorBlock
      width 70%
      #aceEditor
        width 100%
</style>

<template>
  <div class="code-editor-page">
    <Header ref="header" @startCheck="checkSolution"/>

    <div id="taskBlock" class="task-and-editor">
      <TaskInfo ref="taskInfo" :id="parseInt($route.params.id)"/>

      <SlideLine el1="taskInfo" el2="editorBlock" class="vertical"/>

      <Editor ref="editor"/>
    </div>

    <SlideLine el1="taskBlock" el2="solutions" class="horizontal"/>

    <Solutions ref="solutions"/>
  </div>
</template>

<script>
  import TaskInfo from "./TaskInfo.vue";
  import Editor from './Editor.vue';
  import Solutions from './Solutions.vue';
  import Header from './Header.vue';

  import SlideLine from '../SlideLine.vue';


  export default {
    components: { Header, TaskInfo, Editor, Solutions, SlideLine },

    methods: {
      checkSolution: async function() {
        const code = this.$refs.editor.aceEditor.getValue();
        const checkInfo = await this.$store.state.api.sendSolution(1, {
          sourceCode: code
        });
        if (!checkInfo.ok_) {
          alert("Не удалось отправить решение");
          this.$refs.header.checkDone();
          return;
        }

        this.$refs.header.checkDone();
        this.$refs.solutions.addSolution(checkInfo);
      }
    }
  }
</script>
