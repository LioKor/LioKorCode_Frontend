<style lang="stylus">
  #router
    overflow-x hidden
    overflow-y auto
    height 100vh
</style>

<template>
  <div id="router" class="scrollable">
    <router-view></router-view>
  </div>

  <SlideLine class="vertical" el1="router" el2="rooms" uid="rooms" initial-value="100"
             @slider-moved="emitSliderMoved" />

  <Rooms id="rooms"/>

  <Modal ref="modal"></Modal>
  <Popups ref="popups"></Popups>
</template>

<script>
  import Modal from "../utils/Modal.vue";
  import Popups from "../utils/Popups.vue";

  import SlideLine from './SlideLine.vue';
  import Rooms from './Rooms/Rooms.vue';
  import EventBus from "./EventBus";


  export default {
    components: { Modal, Popups, SlideLine, Rooms },

    mounted() {
      this.$store.state.modal = this.$refs.modal;
      this.$store.state.popups = this.$refs.popups;
      this.$store.state.eventBus = new EventBus();
    },

    methods: {
      emitSliderMoved() {
        this.$store.state.eventBus?.emit('resizeTaskPreviews', {});
      }
    }
  }
</script>
