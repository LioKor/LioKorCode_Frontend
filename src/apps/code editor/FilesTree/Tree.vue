<style lang="stylus">
  @require "../../../styles/constants.styl"

  font-size = 16px

  .tree-container
    height 100%
    flex 1
    overflow-x hidden
  .tree
    padding 10px
    margin 0
    overflow-x hidden
    height 100%
    li
      margin-left 20px
      pointer-events visible
      color textColor3
      font-size font-size
      position relative
      outline none
      z-index 0
      cursor default
    li::before
      content ""
      position absolute
      left -500px
      width 1000px
      height (font-size + 2)
      z-index -1
    li:hover
      color textColor1
    li:hover::before
      content ""
      background color1mostLighter
    li.name
      margin-left 0
    li.name.root
      list-style none
    li:selected
      color textColor1
    li.selected::before
      content ""
      background color3
    li.selected:focus::before
      background color4

    li.highlighted::before
      content ""
      background var(--color)

    li.name.folder
      list-style georgian
      ~ li
      ~ ul
        height 0
        opacity 0
        transition none
    li.name.folder.expanded
      list-style hangul-consonant
      ~ li
      ~ ul
        opacity 1
        height auto
        transition all 0.2s ease

    ul
      margin 0
      padding 0
      margin-left 10px
      padding-left 10px
      background linear-gradient(color4, transparent) no-repeat
      background-size 2px calc(100% - 20px)
      background-position 0 20px
      z-index 0

  .blocked
    li
      cursor not-allowed
</style>

<template>
  <div class="tree-container">
    <ul class="tree context-tree-root root scrollable" ref="root"
      @keyup.delete="proxyFileFoo(deleteItem, true)"
      @keyup.ctrl.c="proxyFileFoo(copyItem)"
      @keyup.ctrl.x="proxyFileFoo(cutItem)"
      @keyup.ctrl.v="proxyFileFoo(pasteItem)"
      @keyup.alt.shift.d="proxyFileFoo(duplicateItem)"
      @keyup.f2.prevent="proxyFileFoo(renameItem)"
      @keyup.ctrl.insert.prevent="proxyFileFooNotNull(addFile)"
      @keyup.alt.insert.prevent="proxyFileFooNotNull(addFolder)"
      @keydown.up.prevent="selectPrevious"
      @keydown.down.prevent="selectNext"
      @keydown.right.prevent="expandSelected"
      @keydown.left.prevent="collapseSelected"
      @keydown.enter="proxyFileFoo(openFile)"
      >
      <li tabindex="1" class="name root context-tree-root" data-idx-path="">{{name}}</li>
      <Item v-for="(item, idx) in reactiveItems" :item="item" :idx-path="[idx]" @open-file="openFile" @select-file="selectFile"></Item>
    </ul>

    <ContextMenu :menus="[
          {
            targets: 'context-tree-file',
            items: [
              {name: 'Копировать', hint: 'Ctrl+C', action: copyItem},
              {name: 'Вырезать', hint: 'Ctrl+X', action: cutItem},
              {name: 'Вставить', hint: 'Ctrl+V', action: pasteItem},
              {name: 'Дублировать', hint: 'Alt+Shift+D', action: duplicateItem},
              {name: 'Переименовать', hint: 'F2', action: renameItem},
              {name: 'Удалить', hint: 'Delete', action: deleteItem},
              ]
          },
          {
            targets: 'context-tree-folder',
            items: [
              {name: 'Копировать', hint: 'Ctrl+C', action: copyItem},
              {name: 'Вырезать', hint: 'Ctrl+X', action: cutItem},
              {name: 'Вставить', hint: 'Ctrl+V', action: pasteItem},
              {name: 'Дублировать', hint: 'Alt+Shift+D', action: duplicateItem},
              {name: 'Создать файл', hint: 'Ctrl+Insert', action: addFile},
              {name: 'Создать папку', hint: 'Alt+Insert', action: addFolder},
              {name: 'Переименовать', hint: 'F2', action: renameItem},
              {name: 'Удалить', hint: 'Delete', action: deleteItem},
              ]
          },
          {
            targets: 'context-tree-root',
            items: [
              {name: 'Вставить', hint: 'Ctrl+V', action: pasteItem},
              {name: 'Создать файл', hint: 'Ctrl+Insert', action: addFile},
              {name: 'Создать папку', hint: 'Alt+Insert', action: addFolder},
              ]
          },
          ]"></ContextMenu>
  </div>
</template>

<script>
  import ContextMenu from "../../ContextMenu.vue";
  import Item from "./Item.vue";
  import {deepClone} from "../../../utils/utils.js";
  import {nextTick} from "vue";

  export default {
    components: {ContextMenu, Item},

    props: {
      name: {
        type: String,
        default: "",
      },
      items: {
        type: [],
        default: [],
        required: true,
      },
    },

    data() {
      return {
        reactiveItems: this.$props.items, // to make items reactive
        copyedItem: {el: null, mode: ""}, // todo: make non-reactive
        selectedItem: {el: null, item: {}}, // todo: make non-reactive
        openedItem: {el: null, item: {}}, // todo: make non-reactive
        canOpenFiles: true, // todo: make non-reactive
        highlightedFiles: {}, // todo: make non-reactive
      }
    },

    async mounted() {
      this.loadFromLocalStorage();
      this.sortFilesRecursive();

      await nextTick();
      const path = localStorage.getItem('openedFilePath');
      if (path !== null) {
        this.openFile(this.getElByPath(path.split(',')));
      } else {
        this.openFile(this.$refs.root.children[1]);
      }
    },

    methods: {
      sortFiles(list = this.reactiveItems, isNeedSave = true) {
        list.sort((a, b) => {
          const isAFile = (typeof a.value === 'string');
          const isBFile = (typeof b.value === 'string');
          if (isAFile === isBFile) {
            return a.name.localeCompare(b.name);
          } else if (isAFile) {
            return 1;
          } else {
            return -1;
          }
        });

        if (isNeedSave)
          this.saveToLocalStorage();
      },
      sortFilesRecursive(list = this.reactiveItems) {
        this.sortFiles(list);
        list.forEach(el => {
          if (typeof el.value !== 'string')
            this.sortFilesRecursive(el.value, false);
        });

        this.saveToLocalStorage();
      },

      // --- Controls by clicks on context menu
      getPathByItem(item, where = this.reactiveItems, pathPrefix = []) {
        for (let i = where.length-1; i >= 0; i--) {
          const curItem = where[i];
          if (curItem === item) {
            return pathPrefix.concat([i]);
          }
          if (typeof curItem.value !== 'string') {
            const res = this.getPathByItem(item, curItem.value, pathPrefix.concat([i]));
            if (res)
              return res;
          }
        }
        return null;
      },
      getElByPath(path) {
        let curRoot = this.$refs.root;
        path.forEach(idx => {
          curRoot = curRoot.children[Number(idx) + 1];
        });
        return curRoot;
      },
      getItemPath(el) {
        if (!el)
          return [];
        let attr = el.getAttribute('data-idx-path');

        if (!attr)
          return [];
        return attr = attr.split(',');
      },
      getItem(path) {
        let list = this.reactiveItems;
        if (!path.length) {
          return {list: [{name: "ROOT", value: this.reactiveItems}], idx: 0};
        }
        path.slice(0,-1).forEach((idx) => {
          list = list[idx].value;
        });
        return {list: list, idx: path[path.length - 1]};
      },

      async addSomething(el, promptMsg, itemValue) {
        const name = await this.$store.state.modal.prompt(promptMsg);
        if (name === null)
          return;

        const path = this.getItemPath(el);
        if (!path.length) { // add to root
          this.reactiveItems.push({name: name, value: itemValue})
          this.sortFiles();
          return;
        }
        // add into some folder
        const {list, idx} = this.getItem(this.getItemPath(el));
        let toPush = list[idx].value;
        if (typeof toPush === 'string') // selected item is a file
          toPush = list; // let's push to item's folder
        toPush.push({name: name, value: itemValue});
        this.sortFiles(toPush);
      },

      async deleteItem(el) {
        const {list, idx} = this.getItem(this.getItemPath(el));

        const conf = await this.$store.state.modal.confirm('Точно удаляем?', list[idx].name);
        if (!conf)
          return false;

        this.$emit('deleteFile', list[idx]);

        list.splice(idx, 1);
        this.sortFiles(list);

        return true;
      },

      addFile(el) {
        this.addSomething(el, 'Введите имя файла', "");
      },
      addFolder(el) {
        this.addSomething(el, 'Введите имя папки', []);
      },

      async renameItem(el) {
        const {list, idx} = this.getItem(this.getItemPath(el));
        const name = await this.$store.state.modal.prompt('Во что переименуем?', 'Было: ' + list[idx].name, list[idx].name);
        if (name === null)
          return;

        list[idx].name = name;
        this.sortFiles(list);

        this.$emit('renameFile', list[idx]);
      },

      copyItem(el) {
        this.copyedItem.el = el;
        this.copyedItem.mode = 'copy';
      },
      cutItem(el) {
        this.copyedItem.el = el;
        this.copyedItem.mode = 'cut';
      },
      pasteItem(el) {
        if (this.copyedItem.el === null)
          return;
        const {list: listPaste, idx: idxPaste} = this.getItem(this.getItemPath(el));
        const {list: listCopy, idx: idxCopy} = this.getItem(this.getItemPath(this.copyedItem.el));

        let toPush = listPaste[idxPaste].value;
        if (typeof toPush === 'string') // selected item is a file
          toPush = listPaste; // let's push to item's folder
        toPush.push(deepClone(listCopy[idxCopy]));
        this.sortFiles(toPush);

        if (this.copyedItem.mode === 'cut') {
          listCopy.splice(idxCopy, 1); // delete selected element
          this.copyedItem.el = null; // drop selection
        }
      },
      duplicateItem(el) {
        const {list, idx} = this.getItem(this.getItemPath(el));
        list.push(deepClone(list[idx]));
        this.sortFiles(list);
      },

      // --- Select and open files
      toggleAndSaveFileClass(el, toSave, className, list = undefined, idx = undefined) {
        if (toSave.el !== null) {
          toSave.el.classList.remove(className);
        }
        el.classList.add(className);
        if (list === undefined || idx === undefined) {
          const res = this.getItem(this.getItemPath(el));
          list = res.list; idx = res.idx;
        }
        toSave.el = el;
        toSave.item = list[idx];
      },
      selectFile(el) {
        this.toggleAndSaveFileClass(el, this.selectedItem, 'selected');
      },
      openFile(el) {
        if (!this.canOpenFiles)
          return;

        const path = this.getItemPath(el);
        const {list, idx} = this.getItem(path);
        if (typeof list[idx].value !== 'string') { // el is a folder
          this.toggleExpandEl(el);
          return;
        }
        localStorage.setItem('openedFilePath', path.join(','));
        this.toggleAndSaveFileClass(el, this.openedItem, 'opened', list, idx);
        this.$emit("openFile", this.openedItem.item);
      },
      openFileByItem(item) {
        this.openFile(this.getElByPath(this.getPathByItem(item)));
      },

      getSource(prefix = "", list = this.reactiveItems) {
        const source = {};
        if (prefix !== '')
          prefix += '/';
        list.forEach((item) => {
          if (typeof item.value === 'string') {
            // removing spaces from an empty line (for linter)
            const prevLength = item.value;
            item.value = item.value.replaceAll(/  *\n/g, '\n')
            if (prevLength !== item.value.length && item === this.openedItem.item) {
              this.$emit('editorSetText', item.value)
            }

            source[prefix + item.name] = item.value;
          } else {
            Object.assign(source, this.getSource(prefix + item.name, item.value));
          }
        });
        return source;
      },

      // --- Local storage work
      saveToLocalStorage() {
        localStorage.setItem('filesTree', JSON.stringify(this.reactiveItems));
      },
      loadFromLocalStorage() {
        const list = JSON.parse(localStorage.getItem('filesTree'));
        if (list && list.length) {
          this.loadTree(list);
        }
      },
      loadTree(list) {
        this.reactiveItems = list;
        this.sortFilesRecursive();
      },

      // --- Controls by keys
      proxyFileFoo(foo, dropSelection = false) {
        if (this.selectedItem.el === null)
          return;
        const result = foo(this.selectedItem.el);
        if (result && dropSelection) {
          this.selectedItem.el.classList.remove('selected');
          this.selectedItem.el = null;
          this.selectedItem.item = null;
        }
      },
      proxyFileFooNotNull(foo) {
        if (this.selectedItem.el === null) {
          foo(this.$el.querySelector('#tree'));
          return;
        }
        foo(this.selectedItem.el);
      },

      // --- Arrow keys
      selectPrevious() {
        let el = this.selectedItem.el;
        if (!el)
          return;

        const prevEl = el.previousElementSibling;
        if (!prevEl) { // Stuck on top
          const previousInParent = el.parentElement.previousElementSibling;
          if (previousInParent.classList.contains('root'))
            return;
          el = previousInParent;
        } else { // Prev el is a file - ok
          el = prevEl;
        }

        if (el.tagName === 'UL') { // Prev el is a folder
          const recursiveStepDown = (el) => {
            const lastEl = el.lastElementChild;
            if (lastEl.tagName === 'UL') {
              return recursiveStepDown(lastEl);
            }
            return lastEl;
          }
          el = recursiveStepDown(el);
        }

        el.focus();
        this.selectFile(el);
      },
      selectNext() {
        let el = this.selectedItem.el;
        if (!el)
          return;

        const nextEl = el.nextElementSibling;
        if (!nextEl) { // Stuck on bottom
          const recursiveStepUp = (el) => {
            if (el.parentElement.classList.contains('root'))
              return;
            const nextInParent = el.parentElement.nextElementSibling;
            if (!nextInParent)
              return recursiveStepUp(el.parentElement.parentElement.firstElementChild);
            return nextInParent;
          }
          el = recursiveStepUp(el);
          if (el === undefined)
            return;
        } else { // Next el is a file - ok
          el = nextEl;
        }

        if (el.tagName === 'UL') // Prev el is a folder
          el = el.firstElementChild;

        el.focus();
        this.selectFile(el);
      },
      toggleExpandEl(el) {
        el.classList.toggle('expanded');
      },
      expandEl(el) {
        el.classList.add('expanded');
      },
      expandSelected() {
        if (!this.selectedItem.el)
          return;
        this.expandEl(this.selectedItem.el);
      },
      collapseEl(el) {
        el.classList.remove('expanded');
      },
      collapseSelected() {
        if (!this.selectedItem.el)
          return;
        this.collapseEl(this.selectedItem.el);
      },

      lockOpeningFiles() {
        this.canOpenFiles = false;
        this.$el.classList.add('blocked');
      },
      unlockOpeningFiles() {
        this.canOpenFiles = true;
        this.$el.classList.remove('blocked');
      },

      stringPathToPath(path, where = this.reactiveItems) {
        path = path.split('/');
        const resultPath = [];
        let item;
        path.forEach(filename => {
          if (item === undefined)
            throw new Error("Path isn't correct. Trying to find next file in file, not in folder");

          const fileIdx = where.findIndex(el => el.name === filename);
          resultPath.push(fileIdx);
          if (fileIdx === -1)
            throw new Error("Path isn't correct. Can't find file with given name");
          item = where[fileIdx];
          where = item.value;
        });
        return {path: resultPath, item: item};
      },


      hueFromName (name) {
        let a = 1;
        for (let i = 0; i < name.length; i++) {
          a = 17 * (a + name.charCodeAt(i)) % 360;
        }
        return a / 360;
      },
      hsl2hex(h, s, l) {
        if (s === 0) { return this.rgb2hex(l, l, l); }
        let var2 = l < 0.5 ? l * (1+s) : (l+s) - (s*l);
        let var1 = 2 * l - var2;
        let hue2rgb = function (hue) {
          if (hue < 0) { hue += 1; }
          if (hue > 1) { hue -= 1; }
          if (6*hue < 1) { return var1 + (var2-var1)*6*hue; }
          if (2*hue < 1) { return var2; }
          if (3*hue < 2) { return var1 + (var2-var1)*6*(2/3 - hue); }
          return var1;
        };
        return this.rgb2hex(hue2rgb(h+1/3), hue2rgb(h), hue2rgb(h-1/3));
      },
      rgb2hex (r, g, b, a = 0) {
        function digits (n) {
          const m = Math.round(255*n).toString(16);
          return m.length === 1 ? '0'+ m : m;
        }
        return '#' + digits(r) + digits(g) + digits(b) + digits (a);
      },

      highlightFile(pathToFile, userName) {
        const {path} = this.stringPathToPath(pathToFile);
        const newEl = this.getElByPath(path);

        const color = this.hsl2hex(this.hueFromName(userName), 0.75, 0.5);

        const oldEl = this.highlightedFiles[userName];
        oldEl?.classList.remove('highlighted');

        this.highlightedFiles[userName] = newEl;
        newEl.style.setProperty('--color', color);
        newEl.classList.add('highlighted');
      },
    }
  }
</script>
