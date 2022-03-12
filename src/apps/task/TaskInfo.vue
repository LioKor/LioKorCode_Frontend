<template>
  <div id="taskInfo" class="task">
    <div>
      <label><strong>Tasks:</strong>
        <select v-model="selectedTaskName" @change="taskSelected">
          <option v-for="taskName of tasksList">{{ taskName }}</option>
        </select>
      </label>
    </div>

    <h2>{{ name }}</h2>
    <h3>Description</h3>
    <p>{{ description }}</p>

    <div v-if="argsDescription">
      <h4>Args description</h4>
      <p>{{ argsDescription }}</p>
    </div>
    <div v-if="returnDescription">
      <h4>Return description</h4>
      <p>{{ returnDescription }}</p>
    </div>
    <div v-if="notes">
      <h4>Notes</h4>
      <p>{{ notes }}</p>
    </div>

    <!--
    <h3>Test examples:</h3>
    <table id="examplesTable">
      <thead>
      <tr>
        <th>args</th>
        <th>return</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="test in tests">
        <td>{{ test[0] }}</td>
        <td>{{ test[1] }}</td>
      </tr>
      </tbody>
    </table>
    -->
  </div>
</template>

<script>
  import ApiRequest from "../../utils/requests";

  export default {
    data() {
      return {
        name: null,
        description: null,
        argsDescription: null,
        returnDescription: null,
        notes: null,

        tests: [],

        tasksList: null,

        api: null, // TODO: non-reactive
      }
    },
    mounted() {
      this.api = new ApiRequest('http://code.liokor.com/api/v1');

      const taskInfo = this.getTask(1);

      this.name = taskInfo.name;
      this.description = taskInfo.description;
      this.argsDescription = taskInfo.stdinDescription;
      this.returnDescription = taskInfo.stdoutDescription;
      this.notes = taskInfo.hints;
      this.tests = taskInfo.tests;
    },
    methods: {
      async getTask(id) {
        //const response = this.api.get(`/task/${id}`);
        const response = await fetch(`/task/${id}`, {method: 'GET'})
        if (!response.ok) {
          alert("Не получилось получить задание")
          return {};
        }

        const res = await response.json();
        return res;
      },
    }
  }
</script>
