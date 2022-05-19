<style lang="stylus">
  @import "../../../styles/constants.styl"

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
      @keyup.delete="proxyFileFoo(deleteItemByHtmlElement, true)"
      @keyup.ctrl.c="proxyFileFoo(copyItemByHtmlElement)"
      @keyup.ctrl.x="proxyFileFoo(cutItemByHtmlElement)"
      @keyup.ctrl.v="proxyFileFoo(pasteItemByHtmlElement)"
      @keyup.alt.shift.d="proxyFileFoo(duplicateItemByHtmlElement)"
      @keyup.f2.prevent="proxyFileFoo(renameItem)"
      @keyup.ctrl.insert.prevent="proxyFileFooNotNull(addFileByHtmlElement)"
      @keyup.alt.insert.prevent="proxyFileFooNotNull(addFolderByHtmlElement)"
      @keydown.up.prevent="selectPrevious"
      @keydown.down.prevent="selectNext"
      @keydown.right.prevent="expandSelected"
      @keydown.left.prevent="collapseSelected"
      @keydown.enter="proxyFileFoo(openFileByHtmlElement)"
      >
      <li tabindex="1" class="name root context-tree-root" data-idx-path="">{{name}}</li>
      <Item v-for="(item, idx) in reactiveItems" :item="item" :idx-path="[idx]" @open-file="openFileByHtmlElement" @select-file="selectFileByHtmlElement"></Item>
    </ul>

    <ContextMenu :menus="[
          {
            targets: 'context-tree-file',
            items: [
              {name: 'Копировать', hint: 'Ctrl+C', action: copyItemByHtmlElement},
              {name: 'Вырезать', hint: 'Ctrl+X', action: cutItemByHtmlElement},
              {name: 'Вставить', hint: 'Ctrl+V', action: pasteItemByHtmlElement},
              {name: 'Дублировать', hint: 'Alt+Shift+D', action: duplicateItemByHtmlElement},
              {name: 'Переименовать', hint: 'F2', action: renameItem},
              {name: 'Удалить', hint: 'Delete', action: deleteItemByHtmlElement},
              ]
          },
          {
            targets: 'context-tree-folder',
            items: [
              {name: 'Копировать', hint: 'Ctrl+C', action: copyItemByHtmlElement},
              {name: 'Вырезать', hint: 'Ctrl+X', action: cutItemByHtmlElement},
              {name: 'Вставить', hint: 'Ctrl+V', action: pasteItemByHtmlElement},
              {name: 'Дублировать', hint: 'Alt+Shift+D', action: duplicateItemByHtmlElement},
              {name: 'Создать файл', hint: 'Ctrl+Insert', action: addFileByHtmlElement},
              {name: 'Создать папку', hint: 'Alt+Insert', action: addFolderByHtmlElement},
              {name: 'Переименовать', hint: 'F2', action: renameItem},
              {name: 'Удалить', hint: 'Delete', action: deleteItemByHtmlElement},
              ]
          },
          {
            targets: 'context-tree-root',
            items: [
              {name: 'Вставить', hint: 'Ctrl+V', action: pasteItemByHtmlElement},
              {name: 'Создать файл', hint: 'Ctrl+Insert', action: addFileByHtmlElement},
              {name: 'Создать папку', hint: 'Alt+Insert', action: addFolderByHtmlElement},
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
      }
    },

    async mounted() {
      this.loadFromLocalStorage();
      this.sortFilesRecursive();

      await nextTick();
      const lastOpenedFilePath = localStorage.getItem('openedFilePath');
      if (lastOpenedFilePath !== null) {
        const lastOpenedFileEl = this.getHtmlElementByPath(lastOpenedFilePath.split(','));
        if (lastOpenedFileEl !== undefined) {
          this.openFileByHtmlElement(lastOpenedFileEl);
          return;
        }
      }
      // Open first file in can't open last saved path
      this.openFileByHtmlElement(this.$refs.root.children[1]);
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

      /** --- Get entities by other entities. We have:
        path: [2, 3, 1, ...] - it is indexes of folders from the root
        stringPath: "folder1/folder2/folder3/item.txt" - equivalent of indexes path
        item: {name: "file.txt", value: "file text"} or
              {name: "folder", value: [<array of items>]}
        HtmlElement: HtmlElement that is linked to some item. Always has attribute data-path="<indexes path>"
      **/
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
      getPathAndItemByStringPath(stringPath, where = this.reactiveItems) {
        stringPath = stringPath.split('/');
        const nullRes = {path: [], item: null};
        const res = {path: [], item: null};

        for (const curName of stringPath) {
          if (typeof where === 'string') {
            throw Error("String path trying to go inside file like as folder");
          }

          const curIdx = where.findIndex(curItem => curItem.name === curName);
          if (curIdx === -1) {
            return nullRes;
          }

          res.path = res.path.concat([curIdx]);
          res.item = where[curIdx];
        }
        return res;
      },
      getHtmlElementByPath(path) {
        let curRoot = this.$refs.root;
        path.forEach(idx => {
          curRoot = curRoot.children[Number(idx) + 1];
        });
        return curRoot;
      },
      getHtmlElementPath(el) {
        if (!el)
          return [];
        let attr = el.getAttribute('data-idx-path');

        if (!attr)
          return [];
        return attr = attr.split(',');
      },
      getItemByPath(path) {
        let list = this.reactiveItems;
        if (!path.length) {
          return {list: [{name: "ROOT", value: this.reactiveItems}], idx: 0};
        }
        path.slice(0,-1).forEach((idx) => {
          list = list[idx].value;
        });
        return {list: list, idx: path[path.length - 1]};
      },
      getStringPathByPath(path) {
        let list = this.reactiveItems;
        let res = '';
        path.forEach((idx) => {
          res += '/' + list[idx].name;
          list = list[idx].value;
        });
        return res.length ? res.slice(1) : res;
      },
      getOpenedItemStringPath() {
        return this.getStringPathByPath(this.getHtmlElementPath(this.openedItem.el));
      },

      // --- Controls by clicks on context menu
      async addFileOrFolder(el, promptMsg, itemValue) {
        const name = await this.$store.state.modal.prompt(promptMsg);
        if (name === null)
          return;

        const path = this.getHtmlElementPath(el);
        if (!path.length) { // add to root
          this.reactiveItems.push({name: name, value: itemValue})
          this.sortFiles();
          return;
        }
        // add into some folder
        const {list, idx} = this.getItemByPath(this.getHtmlElementPath(el));
        let toPush = list[idx].value;
        if (typeof toPush === 'string') // selected item is a file
          toPush = list; // let's push to item's folder
        toPush.push({name: name, value: itemValue});
        this.sortFiles(toPush);
      },

      async deleteItemByHtmlElement(el) {
        const {list, idx} = this.getItemByPath(this.getHtmlElementPath(el));

        const conf = await this.$store.state.modal.confirm('Точно удаляем?', list[idx].name);
        if (!conf)
          return false;

        this.$emit('deleteFile', list[idx]);

        list.splice(idx, 1);
        this.sortFiles(list);

        return true;
      },

      addFileByHtmlElement(el) {
        this.addFileOrFolder(el, 'Введите имя файла', "");
      },
      addFolderByHtmlElement(el) {
        this.addFileOrFolder(el, 'Введите имя папки', []);
      },

      async renameItem(el) {
        const {list, idx} = this.getItemByPath(this.getHtmlElementPath(el));
        const name = await this.$store.state.modal.prompt('Во что переименуем?', 'Было: ' + list[idx].name, list[idx].name);
        if (name === null)
          return;

        list[idx].name = name;
        this.sortFiles(list);

        this.$emit('renameFile', list[idx]);
      },

      copyItemByHtmlElement(el) {
        this.copyedItem.el = el;
        this.copyedItem.mode = 'copy';
      },
      cutItemByHtmlElement(el) {
        this.copyedItem.el = el;
        this.copyedItem.mode = 'cut';
      },
      pasteItemByHtmlElement(el) {
        if (this.copyedItem.el === null)
          return;
        const {list: listPaste, idx: idxPaste} = this.getItemByPath(this.getHtmlElementPath(el));
        const {list: listCopy, idx: idxCopy} = this.getItemByPath(this.getHtmlElementPath(this.copyedItem.el));

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
      duplicateItemByHtmlElement(el) {
        const {list, idx} = this.getItemByPath(this.getHtmlElementPath(el));
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
          const res = this.getItemByPath(this.getHtmlElementPath(el));
          list = res.list; idx = res.idx;
        }
        toSave.el = el;
        toSave.item = list[idx];
      },
      selectFileByHtmlElement(el) {
        this.toggleAndSaveFileClass(el, this.selectedItem, 'selected');
      },
      openFileByHtmlElement(el) {
        if (!this.canOpenFiles)
          return;

        const path = this.getHtmlElementPath(el);
        const {list, idx} = this.getItemByPath(path);
        if (typeof list[idx].value !== 'string') { // el is a folder
          this.toggleExpandEl(el);
          return;
        }
        localStorage.setItem('openedFilePath', path.join(','));
        this.toggleAndSaveFileClass(el, this.openedItem, 'opened', list, idx);
        this.$emit("openFileText", this.openedItem.item);
      },
      openFileByItem(item) {
        this.openFileByHtmlElement(this.getHtmlElementByPath(this.getPathByItem(item)));
      },

      getSourceCode(prefix = "", list = this.reactiveItems) {
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
            Object.assign(source, this.getSourceCode(prefix + item.name, item.value));
          }
        });
        return source;
      },
      parseSourceCode(sourceCode) {
        const filesList = [];

        for (const [strPath, content] of Object.entries(sourceCode)) {
          const path = strPath.split('/');

          function recursiveCreate(list = filesList) {
            const el = list.find(file => file.name === path[0]);

            if (el !== undefined) { // file already exists
              if (typeof el.value !== 'string') { // existing file is directory
                if (path.length === 1) // we're trying to add file instead directory
                  throw Error('Trying to add file instead existing directory');
                // go into existing directory
                path.splice(0, 1);
                recursiveCreate(el.value);
                return;
              }
              // existing file is a file
              if (path.length > 1) // we're trying to add directory instead file
                throw Error('Trying to add directory instead existing file');
              // create file and exit
              list.push({name: path[0], value: content});
              return;
            }
            // file not exists
            if (path.length > 1) { // add directory and go inside it
              const newDir = {name: path[0], value: []};
              list.push(newDir);
              path.splice(0, 1);
              recursiveCreate(newDir.value);
              return;
            }
            // create file and exit
            list.push({name: path[0], value: content});
          }

          recursiveCreate();
        }
        return filesList;
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
        this.selectFileByHtmlElement(el);
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
        this.selectFileByHtmlElement(el);
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
      }
    }
  }
</script>
