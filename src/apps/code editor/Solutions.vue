<style lang="stylus">
  @import "../../styles/constants.styl"

  background = linear-gradient(20deg, color1, color3)

  #solutions
    background background
    overflow-y scroll
    table
      width 85%
      border-collapse collapse
      tr
        td
          text-align center
          padding 10px
          border 1px solid color3
        td.passed
          background #365e36
        td.checking
          background #72633d
        td.notFull
          background #5b3e31
        td.error
          background #4b302e
        td.message
          max-width 200px
          text-align left
</style>

<template>
  <div id="solutions" class="scrollable">
    <table>
      <tr v-for="solution in solutions" class="withHint" :data-hint="solution.message">
        <td v-if="solution.status === 'passed'" class="passed">{{ solution.id }}</td>
        <td v-else-if="solution.status === 'checking'" class="checking">{{ solution.id }}</td>
        <td v-else-if="solution.status === 'notFull'" class="notFull">{{ solution.id }}</td>
        <td v-else-if="solution.status === 'error'" class="error">{{ solution.id }}</td>

        <td>{{ solution.datetime }}</td>
        <td>{{ solution.testsPassed }} / {{ solution.testsTotal }}</td>
        <td>{{ solution.checkTime }} <span v-show="solution.checkTime">s</span></td>
        <td class="message" v-html="solution.checkError"></td>
      </tr>
    </table>
  </div>
</template>

<script>
  import Solution from "../../models/solution";

  export default {
    props: {
      id: {
        type: Number,
        required: true
      }
    },

    data() {
      return {
        solutions: [],
        addedSolutions: 0, //todo: non-reactive
      }
    },

    async mounted() {
      if (!this.$store.state.user.isLogined) {
        return;
      }

      let solutionsInfo = await this.getSolutions(this.$props.id);
      solutionsInfo = solutionsInfo.slice(-10).reverse();

      this.solutions = [];
      solutionsInfo.forEach(solutionInfo => {
        const sol = new Solution();
        sol.set(solutionInfo);
        this.solutions.push(sol);
      });
    },

    methods: {
      addEmptySolution() {
        const solution = new Solution();
        solution.uid_ = this.addedSolutions++;

        if (this.solutions.length >= 10)
          this.solutions = this.solutions.slice(0, this.solutions.length - 1);
        this.solutions.unshift(solution);

        return solution.uid_;
      },
      replaceSolution(uid, solution) {
        const idx = this.solutions.findIndex((sol) => sol.uid_ === uid);
        if (idx === -1) {
          return;
        }
        solution.checkError = solution.checkError.replaceAll('\n', '<br>')
        this.solutions[idx].set(solution);
      },

      async getSolutions(id) {
        const solutions = await this.$store.state.api.getSolutions(id);

        if (!solutions.ok_) {
          alert("Не получилось получить решения");
          return [];
        }

        return solutions;
      },
    }
  }
</script>
