<style lang="stylus">
  @import "../../../styles/constants.styl"

  #tree
    background color2
    padding 5px
    margin 0
    > li
      list-style none
    li
      pointer-events visible
      color textColor3
    li:hover
      background color4
      color textColor1
    ul
      margin 0
      padding-left 20px
</style>

<template>
  <ul id="tree">
    <li tabindex="1" class="tree-root">{{name}}</li>
    <Item :items="items"></Item>

    <ContextMenu :menus="[
        {
          targets: 'tree-file',
          items: [
            {name: 'Delete', action: () => {}},
            {name: 'Rename', action: () => {}},
            {name: 'Copy', action: () => {}},
            ]
        },
        {
          targets: 'tree-folder',
          items: [
            {name: 'Delete', action: () => {}},
            {name: 'Rename', action: () => {}},
            {name: 'Copy', action: () => {}},
            {name: 'Add file', action: () => {}},
            {name: 'Add folder', action: () => {}},
            ]
        },
        {
          targets: 'tree-root',
          items: [
            {name: 'Add file', action: () => {}},
            {name: 'Add folder', action: () => {}},
            ]
        },
        ]"></ContextMenu>
  </ul>
</template>

<script>
  import ContextMenu from "../../ContextMenu.vue";
  import Item from "./Item.vue";

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
      }
    },
  }
</script>
