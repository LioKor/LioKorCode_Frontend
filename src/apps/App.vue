<style lang="stylus">
</style>

<template>
  <router-view></router-view>
</template>

<script>
  export default {
    components: {  },

    async mounted() {
      await this.$store.dispatch('GET_USER');
    },
  }
</script>
