<style lang="stylus">
  @import "../../../styles/constants.styl"

  #tree
    background color2
    padding 5px
    margin 0
    li
      margin-left 20px
      pointer-events visible
      color textColor3
    li:hover
      background color4
      color textColor1
    li.name
      margin-left 0
    li.name.folder
      list-style georgian
    li.name.root
      list-style none
    ul
      margin 0
      padding 0
      margin-left 10px
      padding-left 10px
      background linear-gradient(color4, transparent) no-repeat
      background-size 2px calc(100% - 20px)
      background-position 0 20px
</style>

<template>
  <ul id="tree" class="context-tree-root" @addFile="addFile" @addFolder="addFolder">
    <li tabindex="1" class="name root context-tree-root" data-idx-path="">{{name}}</li>
    <Item v-for="(item, idx) in reactiveItems" :item="item" :idx-path="[idx]"></Item>
  </ul>

  <ContextMenu :menus="[
        {
          targets: 'context-tree-file',
          items: [
            {name: 'Copy', action: copyItem},
            {name: 'Cut', action: cutItem},
            {name: 'Duplicate', action: duplicateItem},
            {name: 'Rename', action: renameItem},
            {name: 'Delete', action: deleteItem},
            ]
        },
        {
          targets: 'context-tree-folder',
          items: [
            {name: 'Copy', action: copyItem},
            {name: 'Cut', action: cutItem},
            {name: 'Paste', action: pasteItem},
            {name: 'Duplicate', action: duplicateItem},
            {name: 'Add file', action: addFile},
            {name: 'Add folder', action: addFolder},
            {name: 'Rename', action: renameItem},
            {name: 'Delete', action: deleteItem},
            ]
        },
        {
          targets: 'context-tree-root',
          items: [
            {name: 'Paste', action: pasteItem},
            {name: 'Add file', action: addFile},
            {name: 'Add folder', action: addFolder},
            ]
        },
        ]"></ContextMenu>
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
        selectedItem: {path: [], mode: ""}, // todo: make non-reactive
      }
    },

    mounted() {
      this.sortFiles();
    },

    methods: {
      sortFiles(list = this.reactiveItems) {
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
      },

      getItemPath(el) {
        let attr = el.getAttribute('data-idx-path');

        if (!attr)
          return [];
        return attr = attr.split(',');
      },
      findItem(path) {
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
        console.log(path);
        if (!path.length) { // add to root
          this.reactiveItems.push({name: name, value: itemValue})
          this.sortFiles();
          return;
        }
        // add into some folder
        const {list, idx} = this.findItem(this.getItemPath(el));
        list[idx].value.push({name: name, value: itemValue});
        this.sortFiles(list[idx].value);
      },

      deleteItem(el) {
        const conf = confirm('Точно удаляем?');
        if (!conf)
          return;

        const {list, idx} = this.findItem(this.getItemPath(el));
        list.splice(idx, 1);
      },

      addFile(el) {
        this.addSomething(el, 'Введите имя файла', "");
      },
      addFolder(el) {
        this.addSomething(el, 'Введите имя папки', []);
      },

      renameItem(el) {
        const name = prompt('Во что переименуем?');
        if (name === null)
          return;

        const {list, idx} = this.findItem(this.getItemPath(el));
        list[idx].name = name;
        this.sortFiles(list);
      },

      copyItem(el) {
        this.selectedItem.path = this.getItemPath(el);
        this.selectedItem.mode = 'copy';
        console.log(this.selectedItem.path);
      },
      cutItem(el) {
        this.selectedItem.path = this.getItemPath(el);
        this.selectedItem.mode = 'cut';
      },
      pasteItem(el) {
        if (!this.selectedItem.path.length)
          return;
        const {list: listPaste, idx: idxPaste} = this.findItem(this.getItemPath(el));
        const {list: listCopy, idx: idxCopy} = this.findItem(this.selectedItem.path);

        listPaste[idxPaste].value.push(deepClone(listCopy[idxCopy])); // insert copy
        this.sortFiles(listPaste[idxPaste].value);

        if (this.selectedItem.mode === 'cut') {
          listCopy.splice(idxCopy, 1); // delete selected element
          this.selectedItem.path = []; // drop selection
        }
      },
      duplicateItem(el) {
        const {list, idx} = this.findItem(this.getItemPath(el));
        list.push(deepClone(list[idx]));
        this.sortFiles(list);
      }
    }
  }
</script>
