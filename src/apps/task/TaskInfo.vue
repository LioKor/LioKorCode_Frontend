<template>
  <div id="taskInfo" class="task">
    <h2>{{ name }}</h2>
    <h3>Description</h3>
    <p>{{ description }}</p>

    <div v-if="stdinDescription">
      <h4>stdin description</h4>
      <p>{{ stdinDescription }}</p>
    </div>
    <div v-if="stdoutDescription">
      <h4>stdout description</h4>
      <p>{{ stdoutDescription }}</p>
    </div>
    <div v-if="notes">
      <h4>Notes</h4>
      <p>{{ notes }}</p>
    </div>

    <h3>Test examples:</h3>
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
  import ApiRequest from "../../utils/requests";

  export default {
    data() {
      return {
        name: null,
        description: null,
        stdinDescription: null,
        stdoutDescription: null,
        notes: null,

        tests: [],

        tasksList: null,

        api: null, // TODO: non-reactive
      }
    },
    async mounted() {
      this.api = new ApiRequest('http://code.liokor.com/api/v1');

      const taskInfo = await this.getTask(1);

      this.name = taskInfo.name;
      this.description = taskInfo.description;
      this.stdinDescription = taskInfo.stdinDescription;
      this.stdoutDescription = taskInfo.stdoutDescription;
      this.notes = taskInfo.hints;
      this.tests = taskInfo.tests;
    },
    methods: {
      async getTask(id) {
        //const response = this.api.get(`/task/${id}`);
        const response = await fetch(`/api/v1/tasks/${id}`, { method: 'GET' })

        if (!response.ok) {
          alert("Не получилось получить задание")
          return {};
        }

        return response.json();
      },
    }
  }
</script>
