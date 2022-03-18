<style lang="stylus">
  @import "../../styles/constants.styl"

  background = linear-gradient(20deg, color1, color3)

  #solutions
    background background
    position relative
    overflow-y scroll
    table
      width 50%
      border-collapse collapse
      tr
        td
          text-align center
          padding 10px
          border 1px solid monokai-bg-light
        td.passed
          background #2e502e
        td.checking
          background #483f29
        td.error
          background #4b302e
</style>

<template>
  <div id="solutions" class="scrollable">
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
  export default {
    data() {
      return {
        solutions: [],
      }
    },
    async mounted() {
      let solutionsInfo = await this.getSolutions(1);
      solutionsInfo = solutionsInfo.slice(solutionsInfo.length - 5, solutionsInfo.length).reverse()

      solutionsInfo.forEach(solution => {
        solution.status = this.getSolutionStatusClass(solution.CheckResult);
        solution.receivedDatetime = "20.02.2022 17:45";
      });

      this.solutions = solutionsInfo;
      console.log(solutionsInfo);
    },
    methods: {
      addSolution(solution) {
        this.solutions = this.solutions.slice(0, this.solutions.length - 1);

        solution.status = this.getSolutionStatusClass(solution.checkResult);

        // todo: remove this code after backend is fixed
        solution.id = '?'
        solution.receivedDatetime = "20.02.2022 17:45";
        // end of removal

        this.solutions.unshift(solution);
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
        const solutions = await this.$store.state.api.getSolutions(id);
        if (!solutions.ok_) {
          alert("Не получилось получить решения")
          return [];
        }

        return solutions;
      },
    }
  }
</script>
