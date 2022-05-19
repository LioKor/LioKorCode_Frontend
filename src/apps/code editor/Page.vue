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
        color textColor4
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

        annotations: [],
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
        try {
          this.handleErrorsIntoSolution(checkInfo);
        } catch {
          this.$store.state.popups.error("Неизвестная ошибка в решении", "Не удалось обработать ответ сервера");
        }
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
        this.updateErrors();
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
        this.clearAllErrors();

        const solution = new Solution();
        solution.set(checkInfo);
        const message = solution.checkMessage;

        // Solution passed
        if (solution.isOk) {
          this.$store.state.popups.success("Задача успешно решена!", "Поздравляем!");
          return;
        }

        // Check for makefile exists
        const makeFileNames = ['GNUmakefile', 'makefile', 'Makefile'];
        let makefilePathItem = {};
        for (let i = 0; !makefilePathItem.item && i < makeFileNames.length; i++) {
          makefilePathItem = this.$refs.tree.getPathAndItemByStringPath(makeFileNames[i]);
        }
        if (!makefilePathItem.item || message === "No Makefile found!") {
          this.$store.state.popups.error("Ошибка структуры", "Отсутствует Makefile");
          return;
        }

        // Set error setters
        const handleMakefileError = (name, desc, force = false) => {
          // Handle makefile errors
          const makefileErrorLine = message.match(/Makefile:(\d+):/);
          if (makefileErrorLine !== null || force) {
            this.$store.state.popups.error(name, desc);
          }
          if (makefileErrorLine !== null && makefileErrorLine.length >= 2) {
            let description = "Неизвестная ошибка";
            if (/missing separator/.test(message))
              description = "Пропущен отступ. Допустима только табуляция";
            else if (/No such file or directory/.test(message))
              description = "Неизвестная команда";
            this.addError(makefileName, makefileErrorLine[1] - 1, 0, description);
            return true;
          }
        }

        // Get makefile language
        const makefile = makefilePathItem.item.value;
        const makefileName = makefilePathItem.item.name;
        let chosenLang = null;
        for (const [lang, regExp] of Object.entries({
          gcc: /build:[^:]*\n\t(gcc|cc|g\+\+) /,
          python: /run:[^:]*\n\tpython3? /,
          lua: /run:[^:]*\n\tlua /,
          pascal: /build:[^:]*\n\tfpc /,
          go: /build:[^:]*\n\tgo build /,
          nasm: /build:[^:]*\n\tnasm -felf64 .*\n\tld /,
        })) {
          if (regExp.test(makefile)) {
            chosenLang = lang;
            break;
          }
        }
        if (chosenLang === null) {
          handleMakefileError("Ошибка структуры", "Неизвестная конфигурация языка в makefile", true)
          return;
        }

        // Check - is it really error from compilator. Not from other commands in makefile
        if (!{
          gcc: /^(gcc|cc|g\+\+)/,
          python: /.*/,
          lua: /^lua/,
          pascal: /^fpc/,
          go: /^go build/,
          nasm: /nasm/,
        }[chosenLang]?.test(message))
          chosenLang = null;

        // Message "For ... ... expected ... but got ..."
        if (/^For ".*" expected ".*", but got ".*"$/.test(message)) {
          this.$store.state.popups.error("Тест не прошёл", message);
          return;
        }

        // If error not in any language
        if (chosenLang === null) {
          // Handle other makefile errors
          if (handleMakefileError("Ошибка консоли", "Неизвестная команда в makefile"))
            return;
        }

        // Handle other languages errors
        // Note: ([^<>:"/\\|?*]+) is a filename without deprecated symbols
        const langErrorMessageParseRegExp = {
          gcc: /(?:gcc|cc|g\+\+) (?:(?:(?!error).)*\n)+([^<>:"/\\|?*\n]+):(\d+):(?:\d+): (.+)\n/,
          python: /File "\/root\/source_w\/([^<>:"/\\|?*\n]+)", line (\d+).*(?:.*\n)+(\w+:[^:]*)\n/,
          lua: /lua: ([^<>:"/\\|?*\n]+):(\d+):(.*)\n/,
          pascal: /([^<>:"/\\|?*\n]+)\((\d+)\) Fatal: (.*)\n/,
          go: /\.\/([^<>:"/\\|?*\n]+):(\d+):(?:\d+): (.*)\n/,
          nasm: /([^<>:"/\\|?*\n]+):(\d+): (.*)\n/,
        }[chosenLang];

        const tokens = message.match(langErrorMessageParseRegExp);
        console.log(tokens);
        if (tokens === null || tokens.length < 4) {
          this.$store.state.popups.error("Решение не сработало", "Подробности смотрите в консоли решений");
          return;
        }
        console.log("Filepath: ", tokens[1]);
        console.log("Line: ", tokens[2]);
        console.log("Error text: ", tokens[3]);
        this.$store.state.popups.error("Ошибка в коде", "В файле " + tokens[1]);
        this.addError(tokens[1], tokens[2] - 1, 0, tokens[3]);
      },

      addError(filepath, line, sym = 0, description = 'error') {
        this.annotations.push({
          filepath: filepath,
          row: line,
          column: sym,
          text: description,
          type: "error",
        });
        this.updateErrors();
      },
      clearAllErrors() {
        this.annotations = [];
        this.updateErrors();
      },
      updateErrors() {
        const openedFilePath = this.$refs.tree.getOpenedItemStringPath();
        const openedFileAnnotations = this.annotations.filter(ann => ann.filepath === openedFilePath);
        this.$refs.editor.setAnnotations(openedFileAnnotations);

        // opened file without errors and some errors in other files
        if (openedFileAnnotations.length === 0 || this.annotations.length !== 0) {
          this.$refs.tabsVertical.selectTabIndex(1);
        }
      },

      // --- WebSockets live editor
      async connectSession(uid, filename = undefined) {
        // Проверка существования комнаты перед тем, как пытаться подключиться по webSocket'у.
        // const response = await this.$store.state.api.checkRedactorSession(uid);
        // if (!response.ok_) {
        //   this.$store.state.popups.error('Не удалось подключиться к сессии', uid);
        //   return;
        // }

        this.$refs.tree.lockOpeningFiles();
        this.$refs.tabs.lockChangeTabs();
        this.createLiveEditor(uid, filename);
      },
      async leaveSession() {
        this.$refs.tree.unlockOpeningFiles();
        this.$refs.tabs.unlockChangeTabs();
        this.removeLiveEditor();
        await this.$refs.header.leaveSession(false, true);
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
