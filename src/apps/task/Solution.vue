<template>
  <div id="solutions">
    <table>
      <tr v-for="solution in solutions">
        <td v-if="solution.status === 'passed'" class="passed">{{ solution.id }}</td>
        <td v-else-if="solution.status === 'checking'" class="checking">{{ solution.id }}</td>
        <td v-else-if="solution.status === 'error'" class="error">{{ solution.id }}</td>

        <td>{{ solution.receivedDatetime }}</td>
        <td>{{ solution.testsPassed }} / {{ solution.testsTotal }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import ApiRequest from "../../utils/requests";

  export default {
    data() {
      return {
        solutions: [],

        solutionsInfo: null, // TODO: non-reactive,
        api: null,
      }
    },
    mounted() {
      this.api = new ApiRequest('http://code.liokor.com/api/v1');
      const solutionsInfo = this.getSolutions(1);

      /*solutionsInfo.forEach(solution => {
        switch (solution.checkResult) {
          case 0:
            solution.status = 'passed';
            break;
          case 1:
            solution.status = 'checking';
            break;
          case 2:
          case 3:
          case 4:
          case 5:
            solution.status = 'error';
            break;
        }
        solution.receivedDatetime = "20.02.2022 17:45";
      });
       */

      this.solutions = solutionsInfo;
    },
    methods: {
      async getSolutions(id) {
        //const response = this.api.get(`/tasks/${id}/solutions`);
        const response = await fetch(`/tasks/${id}/solutions`, {method: 'GET'})
        if (!response.ok) {
          alert("Не получилось получить решения")
          return [];
        }

        const res = await response.json();
        return res;
      },
    }
  }
</script>
