<style lang="stylus">
  .previews-container
    display flex
    flex-wrap wrap
    position relative

  .header
    z-index 999
</style>

<template>
  <Header></Header>

  <div class="two-previews previews-container">
    <TaskPreview v-for="task in tasks.slice(0, 2)" :task="task"></TaskPreview>
  </div>
  <div class="previews-container">
    <TaskPreview v-for="task in tasks.slice(1)" :task="task"></TaskPreview>
  </div>
</template>

<script>
  import TaskPreview from "./TaskPreview.vue";
  import Header from "./Header.vue";

  export default {
    components: { Header, TaskPreview },

    data() {
      return {
        tasks: [],
      }
    },
    async mounted() {
      this.tasks = await this.getTasks();
    },
    methods: {
      getTasks: async function() {
        const tasks = await this.$store.state.api.getTasks();
        if (!tasks.ok_) {
          alert("Не удалось получить список заданий");
          return;
        }

        return tasks;
      }
    }
  }
</script>
