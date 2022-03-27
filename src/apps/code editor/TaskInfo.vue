<style lang="stylus">
  @import "../../styles/constants.styl"

  background = linear-gradient(30deg, #0e2028 0%, #2e3f44 40%, #0c2129 100%) repeat scroll 0% 0%;

  #taskInfo
    background background
    td
    th
      border 1px solid monokai-bg-lightest
</style>

<template>
  <div id="taskInfo" class="task scrollable">
    <h2>{{ name }}</h2>
    <!--h3>Описание:</h3-->
    <p>{{ description }}</p>

    <div v-if="stdinDescription">
      <h4>Входные данные:</h4>
      <p>{{ stdinDescription }}</p>
    </div>
    <div v-if="stdoutDescription">
      <h4>Выходные даные:</h4>
      <p>{{ stdoutDescription }}</p>
    </div>
    <div v-if="notes">
      <h4>Подсказки:</h4>
      <p>{{ notes }}</p>
    </div>

    <h3>Примеры тестов:</h3>
    <table id="examplesTable">
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
      id: {
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
      const taskInfo = await this.getTask(this.$props.id);

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
          alert("Не получилось получить задание")
          return {};
        }
        return taskInfo;
      },
    }
  }
</script>
