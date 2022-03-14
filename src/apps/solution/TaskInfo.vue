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
  import api from './../../utils/api';

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
        const response = await api.get(`/tasks/${id}`);

        if (!response.ok) {
          alert("Не получилось получить задание")
          return {};
        }

        return response.json();
      },
    }
  }
</script>
