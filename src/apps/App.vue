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

  <Modal ref="modal"></Modal>
  <Popups ref="popups"></Popups>
</template>

<script>
  import Modal from "../utils/Modal.vue";
  import Popups from "../utils/Popups.vue";

  import SlideLine from './SlideLine.vue';
  import Rooms from './Rooms/Rooms.vue';

  export default {
    components: { Modal, Popups, SlideLine, Rooms },

    mounted() {
      this.$store.state.modal = this.$refs.modal;
      this.$store.state.popups = this.$refs.popups;
    }
  }
</script>
