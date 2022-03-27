<style lang="stylus">
  @import "../../../styles/constants.styl"

</style>

<template>
  <li v-if="typeof item.value === 'string'" class="context-tree-file" :data-idx-path="idxPath">{{item.name}}</li>
  <ul v-else>
    <li tabindex="1" class="name folder context-tree-folder" :data-idx-path="idxPath" v-if="item.name">{{item.name}}</li>
    <Item ref="innerItems" v-for="(innerItem, idx) in item.value" :item="innerItem" :idx-path="idxPath.concat(idx)"></Item>
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
    },

    methods: {
      getTree() {
        const tree = [];
        this.$refs.innerItems.forEach(folder => tree.push(folder.getTree()));
        this.files.forEach(file => tree.push(file));
        return tree;
      },
    }
  }
</script>
