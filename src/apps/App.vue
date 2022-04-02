<style lang="stylus">
</style>

<template>
  <router-view></router-view>
</template>

<script>
  import Modal from "../utils/Modal.vue";

  export default {
    components: { Modal },

    mounted() {
      this.$store.state.modal = Modal;
    }
  }
</script>
