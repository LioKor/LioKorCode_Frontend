<style lang="stylus">
  @import "../../styles/constants.styl"

  background = linear-gradient(30deg, #0e2028 0%, #2e3f44 40%, #0c2129 100%) repeat scroll 0% 0%;

  .task-info
    background background
    td
    th
      border 1px solid monokai-bg-lightest
    tr
      td
        white-space pre
</style>

<template>
  <div class="task-info task scrollable">
    <h2>{{ name }}</h2>

    <p>{{ description }}</p>

    <div v-if="stdinDescription">
      <h4>Входные данные:</h4>
      <p>{{ stdinDescription }}</p>
    </div>
    <div v-if="stdoutDescription">
      <h4>Выходные данные:</h4>
      <p>{{ stdoutDescription }}</p>
    </div>
    <div v-if="notes">
      <h4>Особые указания:</h4>
      <p>{{ notes }}</p>
    </div>

    <h3>Примеры тестов:</h3>
    <table>
      <thead>
      <tr>
        <th>stdin</th>
        <th>stdout</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="test in tests">
        <td>{{ test[0] }}</td>
        <td>{{ test[1] }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    props: {
      taskId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        name: null,
        description: null,
        stdinDescription: null,
        stdoutDescription: null,
        notes: null,

        tests: [],

        tasksList: null,
      }
    },
    async mounted() {
      const taskInfo = await this.getTask(this.$props.taskId);

      this.name = taskInfo.name;
      this.description = taskInfo.description;
      this.stdinDescription = taskInfo.stdinDescription;
      this.stdoutDescription = taskInfo.stdoutDescription;
      this.notes = taskInfo.hints;
      this.tests = taskInfo.tests;
    },
    methods: {
      async getTask(id) {
        const taskInfo = await this.$store.state.api.getTask(id);

        if (!taskInfo.ok_) {
          this.$store.state.popups.error("Не получилось получить задание")
          return {};
        }
        return taskInfo;
      },
    }
  }
</script>
