<style lang="stylus">
  #router
    overflow-x hidden
    overflow-y auto
    height 100vh
</style>

<template>
  <div id="router">
    <router-view></router-view>
  </div>

  <SlideLine class="vertical" el1="router" el2="rooms" />

  <Rooms />
</template>

<script>
  import SlideLine from './SlideLine.vue';
  import Rooms from './Rooms/Rooms.vue';

  export default {
    components: { SlideLine, Rooms },

    async mounted() {
    },
  }
</script>
