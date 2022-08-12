<style lang="stylus" scoped>
  #router
    overflow-x hidden
    overflow-y auto
    height 100vh
    position relative
    > *
      position absolute
      width 100%

  .side-button
    opacity 0
    transition opacity 0.3s ease
    pointer-events none
  .side-button.show
    pointer-events all
</style>

<template>
  <div id="router" class="scrollable">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <SlideLine class="vertical rooms-slide-line" el1="router" el2="rooms" uid="rooms" initial-value="100" :user-interactive="!$store.state.isMobile"
             @slider-moved="emitSliderMoved" ref="slider"/>

  <Rooms id="rooms"/>

  <Modal ref="modal"/>
  <Popups ref="popups"/>

  <SideButton class="right" :class="{show: !isMobileRoomsOpened && $store.state.isMobile}" @click="openRooms"/>
  <SideButton class="left" :class="{show: isMobileRoomsOpened && $store.state.isMobile}" @click="closeRooms"/>
</template>

<style scoped>
.fade-left-enter-active {
  transition: opacity 0.3s ease;
}
.fade-left-leave-active {
  transition: all 0.5s ease;
}
.fade-left-enter-from {
  opacity: 0;
}
.fade-left-enter-to {
  opacity: 1;
}
.fade-left-leave-from {
  left: 0%;
}
.fade-left-leave-to {
  left: -100%;
  opacity: 0;
  transform: scale(0.8);
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s ease;
}
.slide-left-enter-to {
  right: 0;
}
.slide-left-enter-from {
  right: -100%;
}
.slide-left-leave-to {
  left: -100%;
  transform: scale(0.8);
}
.slide-left-leave-from {
  left: 0;
}


.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
}
.slide-right-enter-to {
  left: 0;
}
.slide-right-enter-from {
  left: -100%;
}
.slide-right-leave-to {
  right: -100%;
  transform: scale(0.5);
}
.slide-right-leave-from {
  right: 0;
}


.scale-slide-left-enter-active,
.scale-slide-left-leave-active {
  transition: all 0.5s ease;
}
.scale-slide-left-enter-from {
  left: -100%;
}
.scale-slide-left-enter-to {
  left: 0%;
}
.scale-slide-left-leave-from {
  transform: scale(1);
}
.scale-slide-left-leave-to {
  transform: scale(0.8);
  opacity: 0;
}


.scale-slide-right-enter-active,
.scale-slide-right-leave-active {
  transition: all 0.5s ease;
}
.scale-slide-right-enter-from {
  right: -100%;
}
.scale-slide-right-enter-to {
  right: 0%;
}
.scale-slide-right-leave-from {
  transform: scale(1);
}
.scale-slide-right-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>

<script>
  import Modal from "../utils/Modal.vue";
  import Popups from "../utils/Popups.vue";

  import SlideLine from './SlideLine.vue';
  import Rooms from './Rooms/Rooms.vue';
  import EventBus from "./EventBus";
  import SideButton from "./SideButton.vue";

  const MOBILE_WIDTH = 700;

  export default {
    components: { Modal, Popups, SlideLine, Rooms, SideButton },
    data() {
      return {
        isMobileRoomsOpened: false,
        transitionName: 'scale-slide-left',
      }
    },

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
        this.$refs.slider.applySlideSmoothly(70);
      },

      checkMobileWidth() {
        const mobileCopy = this.$store.state.isMobile;
        this.$store.state.isMobile = window.innerWidth <= MOBILE_WIDTH;
        if (mobileCopy !== this.$store.state.isMobile) {
          this.$store.state.eventBus?.emit('mobile', this.$store.state.isMobile);
          this.changeMobileCallback();
        }
      },

      changeMobileCallback() {
        if (this.$store.state.isMobile) {
          this.$refs.slider.userInteractiveOff();
          this.$refs.slider.applySlideSmoothly(100);
          this.isMobileRoomsOpened = false;
        } else {
          this.$refs.slider.userInteractiveOn();
        }
      },

      openRooms() {
        this.isMobileRoomsOpened = true;
        this.$refs.slider.applySlideSmoothly(0);
      },
      closeRooms() {
        this.isMobileRoomsOpened = false;
        this.$refs.slider.applySlideSmoothly(100);
      }
    },

    watch: {
      $route(to, from) {
        console.log(/\/task\/\d*/.test(to.path), to.path)
        this.transitionName = 'scale-slide-right';
        if (from.path === '/signin' && to.path === '/signup') {
          this.transitionName = 'slide-right';
        } else if (from.path === '/signup' && to.path === '/signin') {
          this.transitionName = 'slide-left';

        } else if (to.path === '/') {
          this.transitionName = 'fade-left';
          if (/\/task\/\d+/g.test(from.path))
            this.transitionName = 'fade';
        } else if (/\/task\/\d+/g.test(to.path)) {
            this.transitionName = 'fade-left';
            if (from.path === '/')
              this.transitionName = 'fade';

        } else if (to.path === '/profile')
          this.transitionName = 'scale-slide-left';
      }
    },
  }
</script>
