<template>
  <div id="taskBlock" class="task">
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

    <h3>Test examples:</h3>
    <table id="examplesTable">
      <thead>
      <tr>
        <th>args</th>
        <th>return</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="test in tests.slice(0, 2)">
        <td>
          <span v-for="(arg, i) in test[0]">
              {{ arg }}{{ (i < test[0].length - 1)? ', ': '' }}
          </span>
        </td>
        <td>{{ test[1] }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: null,
        description: null,
        argsDescription: null,
        returnDescription: null,
        notes: null,

        tests: [],

        tasksList: null
      }
    }
  }
</script>