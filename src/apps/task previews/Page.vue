<style lang="stylus">
  .previews-container
    display flex
    flex-wrap wrap
</style>

<template>
  <div class="previews-container">
    <TaskPreview v-for="task in tasks" :task="task"></TaskPreview>
  </div>
</template>

<script>
  import TaskPreview from "./TaskPreview.vue";

  export default {
    components: { TaskPreview },

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
