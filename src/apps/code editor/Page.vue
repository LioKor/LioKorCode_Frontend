<style lang="stylus">
  @import "../../styles/constants.styl"

  #taskBlock
    background-color white

  .code-editor-page
    height 100vh
    overflow hidden
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

  #taskInfo-and-tree
    display flex
    #taskInfo
      flex 1

  #code-editor-all
    height 'calc(100% - %s)' % headerHeight
</style>

<template>
  <div class="code-editor-page">
    <Header ref="header" @startCheck="checkSolution"/>

    <div id="code-editor-all">
      <div id="taskBlock" class="task-and-editor">
        <div id="taskInfo-and-tree">
          <TaskInfo ref="taskInfo" :id="taskId"></TaskInfo>

          <Tree name="Project" :items="[
              {name: 'File1', value: 'txt1'},
              {name: 'Folder1', value: [
                  {name: 'file3', value: 'text3'}
              ]},
              {name: 'file4', value: 'textt4'}
              ]"></Tree>
        </div>
        <SlideLine el1="taskInfo-and-tree" el2="editorBlock" class="vertical"/>

        <Editor ref="editor"/>
      </div>

      <SlideLine el1="taskBlock" el2="solutions" class="horizontal"/>

      <Solutions ref="solutions" :id="taskId"/>
    </div>
  </div>
</template>

<script>
  import TaskInfo from "./TaskInfo.vue";
  import Editor from './Editor.vue';
  import Solutions from './Solutions.vue';
  import Header from './Header.vue';

  import SlideLine from '../SlideLine.vue';
  import Tree from "./FilesTree/Tree.vue";


  export default {
    components: {Tree, Header, TaskInfo, Editor, Solutions, SlideLine},

    data() {
      return {
        taskId: parseInt(this.$route.params.taskId),
      }
    },

    methods: {
      checkSolution: async function() {
        if (!this.$store.state.user.isLogined) {
          this.$refs.header.checkError();
          return;
        }

        this.$refs.header.checkBegin();
        const solutionUid = this.$refs.solutions.addEmptySolution();
        const code = this.$refs.editor.aceEditor.getValue();
        const preCheckInfo = await this.$store.state.api.sendSolution(this.taskId, {
          sourceCode: code
        });
        if (!preCheckInfo.ok_) {
          alert("Не удалось отправить решение");
          this.$refs.header.checkDone();
          return;
        }

        const checkInfo = await this.$store.state.api.getSolution(this.taskId, preCheckInfo.id);
        this.$refs.header.checkDone();
        this.$refs.solutions.replaceSolution(solutionUid, checkInfo);
      }
    }
  }
</script>
