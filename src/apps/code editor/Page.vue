<style lang="stylus">
  @import "../../styles/constants.styl"

  background = linear-gradient(30deg, #0e2028 0%, #2e3f44 40%, #0c2129 100%) repeat scroll 0% 0%;

  #task-block
    background-color white

  .code-editor-page
    height 100vh
    overflow hidden
    color textColor1

    .files-tab
      width 100%
      background background


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
      #task-info
        flex 1

    #editor-block
      display flex
      flex-direction column
      position relative
      .editor-hint
        position absolute
        z-index 10
        inset 0
        background color2
        display flex
        flex-direction column
        align-items center
        justify-content center
        text-align center
        > *
          margin-top 20px
    #code-editor-all
      height 'calc(100% - %s)' % headerHeight
</style>

<template>
  <div class="code-editor-page">
    <Header ref="header" @start-check="checkSolution" @open-session="connectSession" @connect-session="connectSession" @leave-session="leaveSession"/>

    <div id="code-editor-all">
      <div id="task-block" class="task-and-editor">
        <div id="taskInfo-and-tree">
          <Tabs class="vertical" ref="tabsVertical" :items="[
              {name: 'Задание', action: () => {this.openedTab = 0}, closable: false},
              {name: 'Файлы', action: () => {this.openedTab = 1}, closable: false}
          ]"></Tabs>
          <TaskInfo id="task-info" v-show="openedTab === 0" ref="taskInfo" :task-id="taskId"></TaskInfo>

          <div class="files-tab" v-show="openedTab === 1">
            <Templates @openTemplate="openTemplate" />

            <Tree ref="tree" name="Project"
                  :items="getDefaultFiles()"
                  @open-file-text="openTreeFile"
                  @rename-file="updateFileNameInTabs"
                  @editorSetText="editorSetText"
                  @delete-file="deleteFromTabs" />
          </div>
        </div>
        <SlideLine el1="taskInfo-and-tree" el2="editor-block" uid="editor-vertical" initial-value="30" class="vertical"/>
        <div id="editor-block">
          <Tabs class="horizontal" ref="tabs" :items="[]" @tabsCountChange="filesWatchUpdate"></Tabs>
          <Editor ref="editor" @editor-change="updateOpenedFileText"/>

          <div class="editor-hint" v-show="isAllFilesClosed">
            <div>Все файлы закрыты</div>
            <div>Откройте файл из вкладки слева, чтобы начать редактирование</div>
          </div>
        </div>
      </div>

      <SlideLine el1="task-block" el2="solutions" uid="editor-horizontal" initial-value="80" class="horizontal" @sliderMoved="this.$refs.editor.resize()" />

      <Solutions ref="solutions" :id="taskId" @openSolution="(id) => this.openSolution(id)"/>
    </div>
  </div>
</template>

<script>
  import TaskInfo from "./TaskInfo.vue";
  import Editor from './Editor.vue';
  import Solutions from './Solutions.vue';
  import Header from './Header.vue';
  import Templates from './Templates.vue'

  import SlideLine from '../SlideLine.vue';
  import Tree from "./FilesTree/Tree.vue";
  import Tabs from "../Tabs.vue";
  import LiveEditor from "./LiveEditor/LiveEditor";

  import SolutionTemplates from "../../utils/solution-templates";
  import Solution from "../../models/solution";

  const DEV_SOCKET_URL = 'ws://178.62.57.180';

  export default {
    components: {Tabs, Tree, Header, Templates, TaskInfo, Editor, Solutions, SlideLine},

    data() {
      return {
        taskId: parseInt(this.$route.params.taskId),
        openedTab: 0,
        isAllFilesClosed: false,
      }
    },

    async mounted() {
      await import('/src/lib/ot.exec.js');
      await import('/src/lib/ot-addon.exec.js');
    },

    methods: {
      openTemplate(items) {
        this.closeSolution();
        this.$refs.tree.loadTree(items);
        this.openTreeFile(this.$refs.tree.reactiveItems[0]);
      },

      editorSetText(text) {
        this.$refs.editor.setText(text);
      },

      getDefaultFiles() {
        return Object.values(SolutionTemplates)[0];
      },

      async checkSolution() {
        if (!this.$store.state.user.isLogined) {
          this.$refs.header.checkError();
          return;
        }

        this.$refs.header.checkBegin();
        const solutionUid = this.$refs.solutions.addEmptySolution();
        const source = this.$refs.tree.getSourceCode();
        const preCheckInfo = await this.$store.state.api.sendSolution(this.taskId, { sourceCode: source });
        if (!preCheckInfo.ok_) {
          this.$store.state.popups.error("Не удалось отправить решение");
          this.$refs.header.checkDone();
          return;
        }

        const checkInfo = await this.$store.state.api.getSolution(this.taskId, preCheckInfo.id);
        this.handleErrorsIntoSolution(checkInfo);
        this.$refs.header.checkDone();
        this.$refs.solutions.replaceSolution(solutionUid, checkInfo);
      },

      openTreeFile(treeItem) {
        this.$refs.tabs.addTab({
          name: treeItem.name,
          action: () => {this.$refs.tree.openFileByItem(treeItem)},
          uniqueValue: treeItem,
        });
        this.$refs.editor.setReadOnly(false);
        this.$refs.editor.setText(treeItem.value, treeItem.name);
      },
      updateOpenedFileText(text) {
        let item = this.$refs.tabs.getSelected();
        if (item === null)
          return;
        item = item.uniqueValue;
        item.value = text;
        this.$refs.tree.saveToLocalStorage();
      },
      updateFileNameInTabs(treeItem) {
        this.$refs.tabs.updateTab(treeItem, treeItem.name);
        this.$refs.editor.setSyntaxHighlighting(treeItem.name);
      },
      deleteFromTabs(treeItem) {
        this.$refs.tabs.deleteTabByItem(treeItem);
      },

      closeSolution() {
        this.$refs.tree.loadTree([]);
        this.$refs.tabsVertical.selectTabIndex(1);
        this.$refs.tabs.closeAllTabs();
      },

      async openSolution(solutionId) {
        // todo: check for errors
        const checkInfo = await this.$store.state.api.getSolution(this.taskId, solutionId)

        this.closeSolution();

        // opening new solution
        const fileList = this.$refs.tree.parseSourceCode(checkInfo.sourceCode);
        this.$refs.tree.loadTree(fileList);
      },

      filesWatchUpdate(count) {
        if (count === 0) {
          this.$refs.editor.setReadOnly(true);
          this.$refs.editor.clear();
          this.isAllFilesClosed = true;
          return;
        }
        this.$refs.editor.setReadOnly(false);
        this.isAllFilesClosed = false;
      },

      handleErrorsIntoSolution(checkInfo) {
        const solution = new Solution();
        solution.set(checkInfo);
        // solution passed
        if (solution.isOk) {
          this.$store.state.popups.success("Задача успешно решена!", "Поздравляем!");
          return;
        }

        // check for makefile exists
        //if (this.$refs.tree.)
      },

      // --- WebSockets live editor
      async connectSession(uid, filename = undefined) {
        // const response = await this.$store.state.api.checkRedactorSession(uid);
        // if (!response.ok_) {
        //   this.$store.state.popups.error('Не удалось подключиться к сессии', uid);
        //   return;
        // }

        this.$refs.tree.lockOpeningFiles();
        this.$refs.tabs.lockChangeTabs();
        this.createLiveEditor(uid, filename);

        // if (taskId !== undefined) {
        //   this.$refs.taskInfo.getTask(taskId);
        // }
      },
      leaveSession() {
        this.$refs.tree.unlockOpeningFiles();
        this.$refs.tabs.unlockChangeTabs();
        this.removeLiveEditor();
        this.$refs.header.leaveSession();
      },

      createLiveEditor(id, filename = undefined) {
        const callbackForAceEditorLoaded = () => {
          if (filename !== undefined)
            this.$refs.editor.setSyntaxHighlighting(filename);

          const wsProtocol = (location.protocol === 'http:')? 'ws': 'wss';
          let wsUrl = `${wsProtocol}://${location.host}`;
          if (location.host.includes('localhost') || location.host.includes('127.0.0.1') || location.host.includes('192.168.')) {
            wsUrl = DEV_SOCKET_URL;
          }
          wsUrl += this.$store.state.api.apiUrl + '/ws/redactor/' + id;

          this.liveEditor = new LiveEditor(this.$refs.editor.aceEditor, wsUrl);
          this.liveEditor.callbacks.join = ({client_id, username}) => {
            this.$store.state.popups.alert('К сессии присоединился:', username);
          };
          this.liveEditor.callbacks.quit = ({client_id, username}) => {
            this.$store.state.popups.alert('От сессии отключился:', username);
          };
          this.liveEditor.callbacks.close =
            this.liveEditor.callbacks.error = () => {
              this.$store.state.popups.error('Сервер оборвал соединение с сессией');
              this.leaveSession();
          };
          this.liveEditor.join(this.$store.state.user.username);
        }

        if (this.$refs.editor.isMounted) {
          callbackForAceEditorLoaded();
          return;
        }
        this.$refs.editor.setOnMountAction(callbackForAceEditorLoaded);
      },
      removeLiveEditor() {
        this.liveEditor.callbacks.close =
            this.liveEditor.callbacks.error = () => {};
        this.liveEditor.leave();
        this.$refs.tabs.unlockChangeTabs();
        delete this.liveEditor;
      },
    }
  }
</script>
