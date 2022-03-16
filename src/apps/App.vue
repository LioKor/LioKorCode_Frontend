<template>
  <Header ref="header" @check-event="checkSolution" />
  <Task ref="task" />

  <SlideLine el1="taskBlock" el2="solutions" mode="height" class="horizontal"/>

  <Solution />
</template>

<script>
  import Header from './Header.vue'
  import Task from './task/Task.vue'
  import SlideLine from './SlideLine.vue'
  import Solution from './task/Solution.vue'

  export default {
    components: { Header, Task, SlideLine, Solution },

    methods: {
      checkSolution: async function() {
        const code = this.$refs.task.$refs.editor.aceEditor.getValue()
        localStorage.setItem('code', code);
        /*const response = await this.api.post('/tasks/1/solutions', {
          sourceCode: code
        });*/
        const response = await fetch(`/api/v1/tasks/1/solutions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({sourceCode: code}),
        });
        if (!response.ok) {
          alert("Не удалось отправить решение");
          this.$refs.header.checkDone()
          return
        }

        const res = await response.json();
        this.$refs.header.checkDone()
        alert('Решение отправлено. Результат: \n' + JSON.stringify(res));
      }
    },
  }
</script>
