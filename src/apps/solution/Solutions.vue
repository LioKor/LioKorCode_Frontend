<style lang="stylus">
  #solutions
    background-color white
</style>

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
  import api from './../../utils/api';

  export default {
    data() {
      return {
        solutions: [],
      }
    },
    async mounted() {
      let solutionsInfo = await this.getSolutions(this.$route.params.id);
      solutionsInfo = solutionsInfo.slice(solutionsInfo.length - 5, solutionsInfo.length).reverse()

      solutionsInfo.forEach(solution => {
        solution.status = this.getSolutionStatusClass(solution.CheckResult);
        solution.receivedDatetime = "20.02.2022 17:45";
      });

      this.solutions = solutionsInfo;
    },
    methods: {
      addSolution(solution) {
        this.solutions = this.solutions.slice(0, this.solutions.length - 1);

        solution.status = this.getSolutionStatusClass(solution.checkResult);

        // todo: remove this code after backend is fixed
        solution.Id = '?'
        solution.receivedDatetime = "20.02.2022 17:45";
        solution.TestsPassed = solution.testsPassed;
        solution.TestsTotal = solution.testsTotal;
        // end of removal

        this.solutions.splice(0, 0, solution);
      },
      getSolutionStatusClass(status) {
        let cls = 'error';
        if (status === 0) {
          cls = 'passed'
        } else if (status === 1) {
          cls = 'checking'
        }

        return cls;
      },
      async getSolutions(id) {
        const response = await api.get(`/tasks/${id}/solutions`);
        if (!response.ok) {
          alert("Не получилось получить решения")
          return [];
        }

        return response.json();
      },
    }
  }
</script>
