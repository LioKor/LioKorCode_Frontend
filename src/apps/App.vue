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

  <SlideLine class="vertical rooms-slide-line" el1="router" el2="rooms" uid="rooms" initial-value="100" :is-user-interactive="!$store.state.isMobile"
             @slider-moved="emitSliderMoved" ref="slider"/>

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

  const MOBILE_WIDTH = 700;

  export default {
    components: { Modal, Popups, SlideLine, Rooms },

    mounted() {
      this.$store.state.modal = this.$refs.modal;
      this.$store.state.popups = this.$refs.popups;
      this.$store.state.eventBus = new EventBus();

      this.$store.state.eventBus.on('expandRooms', this.expandRooms);

      this.checkMobileWidth();
      window.addEventListener('resize', this.checkMobileWidth);
    },
    unmounted() {
      this.$store.state.eventBus.off('expandRooms', this.expandRooms);
      window.removeEventListener('resize', this.checkMobileWidth);
    },

    methods: {
      emitSliderMoved(val) {
        this.$store.state.eventBus?.emit('resizeTaskPreviews', val);
      },

      expandRooms() {
        this.$refs.slider.applySlideSmothly(70);
      },

      checkMobileWidth() {
        const mobileCopy = this.$store.state.isMobile;
        this.$store.state.isMobile = window.innerWidth <= MOBILE_WIDTH;
        if (mobileCopy !== this.$store.state.isMobile)
          this.$store.state.eventBus?.emit('mobile', this.$store.state.isMobile);
      }
    }
  }
</script>
