<style lang="stylus">
</style>

<template>
  <router-view></router-view>
</template>

<script>
  import Header from './Header.vue'
  import Task from './solution/Task.vue'
  import SlideLine from './SlideLine.vue'
  import Solution from './solution/Solutions.vue'

  export default {
    components: { Header, Task, SlideLine, Solution },
  }
</script>
