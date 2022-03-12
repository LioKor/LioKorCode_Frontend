<template>
  <Header />
  <Task />

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
  }
</script>
