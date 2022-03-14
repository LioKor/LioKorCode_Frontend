<style lang="stylus">
  #taskBlock
    background-color white
</style>

<template>
  <Header ref="header" @check-event="checkSolution" />

  <div id="taskBlock" class="task-and-editor">
    <TaskInfo ref="taskInfo" :id=parseInt($route.params.id) />

    <SlideLine el1="taskInfo" el2="editorBlock" mode="width" class="vertical"/>

    <Editor ref="editor" />
  </div>

  <SlideLine el1="taskBlock" el2="solutions" mode="height" class="horizontal"/>

  <Solutions ref="solutions" />
</template>

<script>
  import TaskInfo from "./TaskInfo.vue";
  import Editor from './Editor.vue';
  import Solutions from './Solutions.vue';
  import Header from './../Header.vue';

  import SlideLine from '../SlideLine.vue';

  import api from './../../utils/api';

  export default {
    components: { Header, TaskInfo, Editor, Solutions, SlideLine },

    methods: {
      checkSolution: async function() {
        const code = this.$refs.editor.aceEditor.getValue()
        localStorage.setItem('code', code);
        const response = await api.post('/tasks/1/solutions', {
          sourceCode: code
        });
        if (!response.ok) {
          alert("Не удалось отправить решение");
          this.$refs.header.checkDone()
          return
        }

        const res = await response.json();
        this.$refs.header.checkDone();
        this.$refs.solutions.addSolution(res);
      }
    }
  }
</script>
