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

  #editor-block
    display flex
    flex-direction column

  #code-editor-all
    height 'calc(100% - %s)' % headerHeight
</style>

<template>
  <div class="code-editor-page">
    <Header ref="header" @start-check="checkSolution" @open-session="openSession" @connect-session="connectSession"/>

    <div id="code-editor-all">
      <div id="taskBlock" class="task-and-editor">
        <div id="taskInfo-and-tree">
          <Tabs class="vertical" ref="tabsVertical" :items="[
              {name: 'Задание', action: () => {this.openedTab = 0}, closable: false},
              {name: 'Файлы', action: () => {this.openedTab = 1}, closable: false}
          ]"></Tabs>
          <TaskInfo v-show="openedTab === 0" ref="taskInfo" :id="taskId"></TaskInfo>

          <Tree v-show="openedTab === 1" ref="tree" name="Project" :items="[
              {name: 'main.c', value: 'int main() {\n\treturn 0;\n}\n'},
              {name: 'Makefile', value: `build:\n\tgcc main.c -o solution\nrun: build\n\t./solution`}
            ]"
            @open-file-text="openTreeFile" @rename-file="updateFileNameInTabs"></Tree>
        </div>
        <SlideLine el1="taskInfo-and-tree" el2="editor-block" class="vertical"/>
        <div id="editor-block">
          <Tabs class="horizontal" ref="tabs" :items="[]" @lastTabClosed="allFilesClosed"></Tabs>
          <Editor ref="editor" @editor-change="updateOpenedFileText"/>
        </div>
      </div>

      <SlideLine el1="taskBlock" el2="solutions" class="horizontal" @sliderMoved="this.$refs.editor.resize()" />

      <Solutions ref="solutions" :id="taskId" @openSolution="(id) => this.openSolution(id)"/>
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
  import Tabs from "../Tabs.vue";
  import wsRedactorApi from "./wsRedactorApi";


  export default {
    components: {Tabs, Tree, Header, TaskInfo, Editor, Solutions, SlideLine},

    data() {
      return {
        taskId: parseInt(this.$route.params.taskId),
        openedTab: 0,
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
        const source = this.$refs.tree.getSource();
        const preCheckInfo = await this.$store.state.api.sendSolution(this.taskId, {
          sourceCode: source
        });
        if (!preCheckInfo.ok_) {
          this.$store.state.popups.error("Не удалось отправить решение");
          this.$refs.header.checkDone();
          return;
        }

        const checkInfo = await this.$store.state.api.getSolution(this.taskId, preCheckInfo.id);
        this.$refs.header.checkDone();
        this.$refs.solutions.replaceSolution(solutionUid, checkInfo);
      },

      openTreeFile(treeItem) {
        this.$refs.tabs.addTab({
          name: treeItem.name,
          action: () => {this.$refs.tree.openFileByItem(treeItem)},
          uniqueValue: treeItem,
        });
        this.$refs.editor.setReadOnly(false)
        this.$refs.editor.setText(treeItem.value, treeItem.name);
      },
      updateOpenedFileText(text) {
        const item = this.$refs.tabs.getSelected().uniqueValue;
        item.value = text;
        this.$refs.tree.saveToLocalStorage();
      },
      updateFileNameInTabs(treeItem) {
        this.$refs.tabs.updateTab(treeItem, treeItem.name);
        this.$refs.editor.setSyntaxHighlighting(treeItem.name);
      },

      parseSourceCode(sourceCode) {
        const filesList = []
        for (const [name, content] of Object.entries(sourceCode)) {
          filesList.push({
            name: name,
            value: content,
          });
        }
        return filesList;
      },

      async openSolution(solutionId) {
        const checkInfo = await this.$store.state.api.getSolution(this.taskId, solutionId)

        const fileList = this.parseSourceCode(checkInfo.sourceCode);
        this.$refs.tree.loadTree(fileList);

        this.allFilesClosed()

        this.$refs.tabsVertical.selectTabIndex(1);
        this.$refs.tabs.closeAllTabs();
      },

      allFilesClosed() {
        this.$refs.editor.setReadOnly(true);
        this.$refs.editor.clear();
      },

      // --- WebSockets live editor
      editorActions(json) {
        switch (json.type) {
          case 'set':
          case 'select':
          case 'add':
          case 'delete':
        }
      },
      openSession() {
        this.ws = new wsRedactorApi(this.$store.state.api.apiUrl);
        this.ws.onmessage = (json) => {
          this.$store.state.popups.success('Ваша сессия создана. ID:\n' + json.id);

          this.ws.onmessage = (json) => {
            this.$store.state.popups.success('К вам подключился: ' + json.username);

            this.ws.onmessage = this.editorActions;
          };
        };
        this.ws.open();
      },
      connectSession() {
        const id = prompt('Ведите ID сессии');
        if (!id)
          return;

        this.ws = new wsRedactorApi(this.$store.state.api.apiUrl, id);
        this.ws.onmessage = this.editorActions;
        this.ws.onerror = () => {
          this.$store.state.popups.error('Соединение не удалоь');
        }
        this.ws.open();
      }
    }
  }
</script>
