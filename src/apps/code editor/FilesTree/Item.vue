<style lang="stylus">
  @import "../../../styles/constants.styl"

</style>

<template>
  <li tabindex="1" v-if="typeof item.value === 'string'" class="context-tree-file" :data-idx-path="idxPath"
      @dblclick="$emit('openFile', $el)"
      @mousedown="(e) => {if (e.detail > 1) e.preventDefault(); /*disable user select on 2 or more clicks*/ }"
      @click="$emit('selectFile', $el)"
      @contextmenu="$emit('selectFile', $el)">
    {{item.name}}
  </li>
  <ul v-else>
    <li tabindex="1" class="name folder context-tree-folder expanded" :data-idx-path="idxPath" v-if="item.name"
        @dblclick="$event.target.classList.toggle('expanded')"
        @mousedown="(e) => {if (e.detail > 1) e.preventDefault(); /*disable user select on 2 or more clicks*/ }"
        @click="$emit('selectFile', $el.firstChild)"
        @contextmenu="$emit('selectFile', $el.firstChild)">
      {{item.name}}
    </li>
    <Item ref="innerItems" v-for="(innerItem, idx) in item.value" :item="innerItem" :idx-path="idxPath.concat(idx)"
          @select-file="(el) => {$emit('selectFile', el)}"
          @open-file="(el) => {$emit('openFile', el)}"
    ></Item>
  </ul>
</template>

<script>
  export default {
    name: "Item",

    props: {
      item: {
        type: Object,
        required: true,
      },
      idxPath: {
        type: Array,
        required: true,
      }
    }
  }
</script>
