<style lang="stylus">
  @import "../../styles/constants.styl"

  background = linear-gradient(20deg, color1, color3)

  #solutions
    background background
    overflow-y scroll
    .min-width
      width 1px
      white-space nowrap
    .min-width.small
      max-width 80px

      white-space break-spaces
      font-size 12px
    .action
      cursor pointer
    .action:hover
      color clHighlight
    table
      width 100%
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
          overflow hidden
        td.with-hint
          overflow visible
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
          <th class="min-width">id</th>
          <th class="min-width">Дата проверки</th>
          <th class="min-width">Тесты</th>
          <th class="min-width small">Время выполнения</th>
          <th class="min-width small">Время компиляции</th>
          <th>Сообщение</th>
          <th class="min-width small">Действия</th>
        </tr>
      </thead>
      <tr v-for="solution in solutions">
        <td class="min-width with-hint" :class="getStatusClass(solution.checkResult)" :data-hint="solution.message">{{ solution.id }}</td>

        <td class="min-width small">{{ solution.datetime }}</td>
        <td class="min-width">{{ solution.testsPassed }} / {{ solution.testsTotal }}</td>
        <td class="min-width">{{ solution.checkTime }} s</td>
        <td class="min-width">{{ solution.compileTime }} s</td>

        <td class="message" v-html="solution.checkMessage"></td>

        <td class="min-width small"><span class="action" @click="openSolution(solution.id)">Загрузить код</span></td>
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

      async openSolution(id) {
        if (await this.$store.state.modal.confirm('Текущее решение будет потеряно. Продолжить?')) {
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

      __solutionNToBr(solution) {
        solution.checkMessage = solution.checkMessage.replaceAll('\n', '<br>');
      },

      replaceSolution(uid, solution) {
        const idx = this.solutions.findIndex((sol) => sol.uid_ === uid);
        if (idx === -1) {
          return;
        }
        this.__solutionNToBr(solution);
        this.solutions[idx].set(solution);
      },

      async getSolutions(id) {
        const solutions = await this.$store.state.api.getSolutions(id);
        for (const solution of solutions) {
          this.__solutionNToBr(solution);
        }

        if (!solutions.ok_) {
          this.$store.state.popups.error("Не удалось получить решения");
          return [];
        }

        return solutions;
      },
    }
  }
</script>
