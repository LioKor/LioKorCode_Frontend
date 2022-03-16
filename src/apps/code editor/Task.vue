<style lang="stylus">
  #taskBlock
    background-color white
</style>

<template>
  <Header ref="header" @startCheck="checkSolution"/>

  <div id="taskBlock" class="task-and-editor">
    <TaskInfo ref="taskInfo" :id="parseInt($route.params.id)"/>

    <SlideLine el1="taskInfo" el2="editorBlock" class="vertical"/>

    <Editor ref="editor"/>
  </div>

  <SlideLine el1="taskBlock" el2="solutions" class="horizontal"/>

  <Solutions ref="solutions"/>
</template>

<script>
  import TaskInfo from "./TaskInfo.vue";
  import Editor from './Editor.vue';
  import Solutions from './Solutions.vue';
  import Header from './../Header.vue';

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
