<style lang="stylus">
  @import "../../../styles/constants.styl"

</style>

<template>
  <li tabindex="1" class="tree-folder">{{name}}</li>
  <ul>
    <Item v-for="folder in folders" ref="folders" :name="folder.name" :items="folder.value"></Item>
    <li tabindex="1" v-for="file in files" class="tree-file">{{file.name}}</li>
  </ul>
</template>

<script>
  export default {
    name: "Item",

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

    data() {
      return {
        folders: [],
        files: [],
      }
    },

    async mounted() {
      this.items.forEach((item) => {
        if (typeof item.value === "string")
          this.files.push(item);
        else
          this.folders.push(item);
      });
    },

    methods: {
      getTree() {
        const tree = [];
        this.$refs.folders.forEach(folder => tree.push(folder.getTree()));
        this.files.forEach(file => tree.push(file));
        return tree;
      },
      addFolder(name = "") {
        this.folders.push({name: name, value: []});
      },
      addFile(name = "") {
        this.files.push({name: name, value: ""});
      },
    }
  }
</script>
