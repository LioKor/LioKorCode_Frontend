<template>
  <Header />

  <Task />
</template>

<script>
  import Header from './Header.vue'
  import Task from './task/Task.vue'

  export default {
    components: { Header, Task },
  }
</script>