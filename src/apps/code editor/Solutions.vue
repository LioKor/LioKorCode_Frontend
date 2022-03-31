<style lang="stylus">
  @import "../../styles/constants.styl"

  background = linear-gradient(20deg, color1, color3)

  #solutions
    background background
    overflow-y scroll
    .min-width
      width 1px
      white-space nowrap
    .action
      cursor pointer
    .action:hover
      color clHighlight
    table
      width calc(100% - 128px)
      border-collapse collapse
      thead
        th
          white-space nowrap
          padding 5px
          border 1px solid color3
      tr
        td
          text-align center
          padding 10px
          border 1px solid color3
        td.id
        th.id
          width 1%
        th.date
        td.date
          width 1%
          white-space nowrap
        td.ok
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
      <thead>
        <tr>
          <th class="id">id</th>
          <th>Дата проверки</th>
          <th>Тесты</th>
          <th>Время выполнения</th>
          <th>Время компиляции</th>
          <th>Сообщение</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tr v-for="solution in solutions" class="withHint" :data-hint="solution.message">
        <td :class="getStatusClass(solution.checkResult)" class="id">{{ solution.id }}</td>

        <td class="min-width">{{ solution.datetime }}</td>
        <td class="min-width">{{ solution.testsPassed }} / {{ solution.testsTotal }}</td>
        <td class="min-width">{{ solution.checkTime }} <span v-show="solution.checkTime">s</span></td>
        <td class="min-width">{{ solution.checkTime }} <span v-show="solution.checkTime">s</span></td>

        <td class="message" v-html="solution.checkError"></td>

        <td class="min-width"><span class="action" @click="openSolution(solution.id)">Открыть</span></td>
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
      getStatusClass(status) {
        if (status === 0) {
          return 'ok';
        } else if (status === 1) {
          return 'checking';
        } else {
          return 'error';
        }
      },

      openSolution(id) {
        if (confirm('Текущее решение будет уничтожено. Продолжить?')) {
          this.$emit('openSolution', id);
        }
      },
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
