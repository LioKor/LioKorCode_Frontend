<style lang="stylus">
  @import "../../../styles/constants.styl"

  font-size = 16px

  .tree-container
    background color2
  .tree
    padding 5px
    margin 0
    overflow-x hidden
    li
      margin-left 20px
      pointer-events visible
      color textColor3
      font-size font-size
      position relative
      outline none
      z-index 0
      cursor default
    li:before
      position absolute
      left -500px
      width 1000px
      height (font-size + 2)
      z-index -1
    li:hover
      color textColor1
    li:hover:before
      content ""
      background color1mostLighter
    li.name
      margin-left 0
    li.name.root
      list-style none
    li:selected
      color textColor1
    li.selected:before
      content ""
      background color3
    li.selected:focus:before
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
</style>

<template>
  <div id="tree" class="tree-container">
    <ul class="tree context-tree-root root"
      @keyp.delete="proxyFileFoo(deleteItem, true)"
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
              {name: 'Copy', hint: 'Ctrl+C', action: copyItem},
              {name: 'Cut', hint: 'Ctrl+X', action: cutItem},
              {name: 'Paste', hint: 'Ctrl+V', action: pasteItem},
              {name: 'Duplicate', hint: 'Alt+Shift+D', action: duplicateItem},
              {name: 'Rename', hint: 'F2', action: renameItem},
              {name: 'Delete', hint: 'Delete', action: deleteItem},
              ]
          },
          {
            targets: 'context-tree-folder',
            items: [
              {name: 'Copy', hint: 'Ctrl+C', action: copyItem},
              {name: 'Cut', hint: 'Ctrl+X', action: cutItem},
              {name: 'Paste', hint: 'Ctrl+V', action: pasteItem},
              {name: 'Duplicate', hint: 'Alt+Shift+D', action: duplicateItem},
              {name: 'Add file', hint: 'Ctrl+Insert', action: addFile},
              {name: 'Add folder', hint: 'Alt+Insert', action: addFolder},
              {name: 'Rename', hint: 'F2', action: renameItem},
              {name: 'Delete', hint: 'Delete', action: deleteItem},
              ]
          },
          {
            targets: 'context-tree-root',
            items: [
              {name: 'Paste', hint: 'Ctrl+V', action: pasteItem},
              {name: 'Add file', hint: 'Ctrl+Insert', action: addFile},
              {name: 'Add folder', hint: 'Alt+Insert', action: addFolder},
              ]
          },
          ]"></ContextMenu>
  </div>
</template>

<script>
  import ContextMenu from "../../ContextMenu.vue";
  import Item from "./Item.vue";
  import {deepClone} from "../../../utils/utils.js";

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
      }
    },

    mounted() {
      this.loadFromLocalStorage();
      this.sortFilesAndSave();
    },

    methods: {
      sortFilesAndSave(list = this.reactiveItems) {
        list.sort((a, b) => {
          const isAFile = typeof a.value === 'string';
          const isBFile = typeof b.value === 'string';
          if (isAFile === isBFile) {
            return a.name.localeCompare(b.name);
          } else if (isAFile) {
            return 1;
          } else {
            return -1;
          }
        });

        this.saveToLocalStorage();
      },

      // --- Controls by clicks on context menu
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

      addSomething(el, promptMsg, itemValue) {
        const name = prompt(promptMsg);
        if (name === null)
          return;

        const path = this.getItemPath(el);
        if (!path.length) { // add to root
          this.reactiveItems.push({name: name, value: itemValue})
          this.sortFilesAndSave();
          return;
        }
        // add into some folder
        const {list, idx} = this.getItem(this.getItemPath(el));
        let toPush = list[idx].value;
        if (typeof toPush === 'string') // selected item is a file
          toPush = list; // let's push to item's folder
        toPush.push({name: name, value: itemValue});
        this.sortFilesAndSave(toPush);
      },

      deleteItem(el) {
        const conf = confirm('Точно удаляем?');
        if (!conf)
          return false;

        const {list, idx} = this.getItem(this.getItemPath(el));
        list.splice(idx, 1);
        this.sortFilesAndSave(list);
        return true;
      },

      addFile(el) {
        this.addSomething(el, 'Введите имя файла', "");
      },
      addFolder(el) {
        this.addSomething(el, 'Введите имя папки', []);
      },

      renameItem(el) {
        const {list, idx} = this.getItem(this.getItemPath(el));
        const name = prompt('Во что переименуем?', list[idx].name);
        if (name === null)
          return;

        list[idx].name = name; //
        this.sortFilesAndSave(list);
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
        this.sortFilesAndSave(toPush);

        if (this.copyedItem.mode === 'cut') {
          listCopy.splice(idxCopy, 1); // delete selected element
          this.copyedItem.el = null; // drop selection
        }
      },
      duplicateItem(el) {
        const {list, idx} = this.getItem(this.getItemPath(el));
        list.push(deepClone(list[idx]));
        this.sortFilesAndSave(list);
      },

      // --- Select and open files
      toggleAndSaveFileClass(el, toSave, className) {
        if (toSave.el !== null) {
          toSave.el.classList.remove(className);
        }
        el.classList.add(className);
        const {list, idx} = this.getItem(this.getItemPath(el));
        toSave.el = el;
        toSave.item = list[idx];
      },
      selectFile(el) {
        this.toggleAndSaveFileClass(el, this.selectedItem, 'selected');
      },
      openFile(el) {
        this.toggleAndSaveFileClass(el, this.openedItem, 'opened');
        this.$emit("openFileText", this.openedItem.item.value);
      },

      getSource(prefix = "", list = this.reactiveItems) {
        const source = {};
        if (prefix !== '')
          prefix += '/';
        list.forEach((item) => {
          if (typeof item.value === 'string')
            source[prefix + item.name] = item.value;
          else
            Object.assign(source, this.getSource(prefix + item.name, item.value));
        });
        return source;
      },
      setOpenedFileText(text) {
        if (this.openedItem.el === null)
          return;
        this.openedItem.item.value = text;

        this.saveToLocalStorage();
      },

      // --- Local storage work
      saveToLocalStorage() {
        localStorage.setItem('filesTree', JSON.stringify(this.reactiveItems));
      },
      loadFromLocalStorage() {
        const list = JSON.parse(localStorage.getItem('filesTree'));
        if (list && list.length) {
          this.reactiveItems = list;
        }
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
      // findItem(item, list = this.reactiveItems) {
      //   for (let i = list.length-1; i >= 0; i--) {
      //     if (list[i] === item)
      //       return {list: list, idx: i};
      //     if (typeof list[i].value !== 'string') { // item is a folder
      //       const result = this.findItem(list[i].value);
      //       if (result !== null)
      //         return result;
      //     }
      //   }
      //   return null;
      // },
      selectPrevious() {
        let el = this.selectedItem.el;
        const prevEl = el.previousElementSibling;
        if (!prevEl) { // Stuck on top
          const previousInParent = el.parentElement.previousElementSibling;
          if (previousInParent.classList.contains('root'))
            return;
          el = previousInParent;
        } else if (prevEl.tagName === 'UL') { // Prev el is a folder
          el = prevEl.lastElementChild;
        } else { // Prev el is a file - ok
          el = prevEl;
        }

        el.focus();
        this.selectFile(el);
      },
      selectNext() {
        let el = this.selectedItem.el;
        const nextEl = el.nextElementSibling;
        if (!nextEl) { // Stuck on bottom
          if (el.parentElement.classList.contains('root'))
            return;
          const nextInParent = el.parentElement.nextElementSibling;
          if (!nextInParent)
            return;
          el = nextInParent;
        } else if (nextEl.tagName === 'UL') { // Next el is a folder
          el = nextEl.firstElementChild;
        } else { // Next el is a file - ok
          el = nextEl;
        }

        el.focus();
        this.selectFile(el);
      },
      expandSelected() {
        if (!this.selectedItem.el)
          return;
        this.selectedItem.el.classList.add('expanded');
      },
      collapseSelected() {
        if (!this.selectedItem.el)
          return;
        this.selectedItem.el.classList.remove('expanded');
      }
    }
  }
</script>
