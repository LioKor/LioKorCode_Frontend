<template>
  <div id="solutions">
    <table>
      <tr v-for="solution in solutions">
        <td v-if="solution.status === 'passed'" class="passed">{{ solution.Id }}</td>
        <td v-else-if="solution.status === 'checking'" class="checking">{{ solution.Id }}</td>
        <td v-else-if="solution.status === 'error'" class="error">{{ solution.Id }}</td>

        <td>{{ solution.receivedDatetime }}</td>
        <td>{{ solution.TestsPassed }} / {{ solution.TestsTotal }}</td>
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
    async mounted() {
      this.api = new ApiRequest('http://code.liokor.com/api/v1');
      const solutionsInfo = await this.getSolutions(1);

      solutionsInfo.forEach(solution => {
        switch (solution.CheckResult) {
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

      this.solutions = solutionsInfo;
      console.log(this.solutions)
    },
    methods: {
      async getSolutions(id) {
        //const response = this.api.get(`/tasks/${id}/solutions`);
        const response = await fetch(`/api/v1/tasks/${id}/solutions`, {method: 'GET'})
        if (!response.ok) {
          alert("Не получилось получить решения")
          return [];
        }

        return response.json();
      },
    }
  }
</script>
