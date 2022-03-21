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

  <div class="previews-container">
    <TaskPreview v-for="task in tasks" :task="task" path-modifier="/edit"></TaskPreview>
  </div>
</template>

<script>
  import TaskPreview from "../task previews/TaskPreview.vue";
  import Header from "./Header.vue";

  export default {
    components: { Header, TaskPreview },

    data() {
      return {
        tasks: [],
      }
    },
    async mounted() {
      this.tasks = await this.getMyTasks();
    },
    methods: {
      getMyTasks: async function() {
        const tasks = await this.$store.state.api.getMyTasks();
        if (!tasks.ok_) {
          alert("Не удалось получить список заданий");
          return;
        }

        return tasks;
      }
    }
  }
</script>
