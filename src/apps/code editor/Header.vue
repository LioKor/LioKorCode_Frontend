<style lang="stylus">
  .header.header-editor
    margin-bottom 0

  .control-button:before
    background linear-gradient(#2A9922, highLightColorTransparent, transparent) 0 100% / 100% 200% no-repeat
  .control-button.warning:before
    background linear-gradient(#ffe344, transparent) 0 100% / 100% 200% no-repeat
  .control-button.danger:before
    background linear-gradient(#ff2e1f, transparent) 0 100% / 100% 200% no-repeat

  .logo
    padding 0 10px
    margin-right 15px
    @media screen and (max-width: $mobileWidth) {
      margin-right 0
    }
</style>

<template>
  <div class="header header-editor">
    <div class="topLine">
      <router-link to="/" class="mobile-hide"><div class="logo"><strong>LioKor Code</strong> <span @contextmenu="showVersion">{{ version }}</span></div></router-link>
      <router-link to="/" class="mobile-show"><div class="logo"><strong>LK Code</strong></div></router-link>
      <router-link to="/">Задания</router-link>
      <div class="control-button" v-show="!isCheckInProgress && !isCheckError" @click=checkStartEmit>Check<span class="mobile-hide"> (F9)</span></div>
      <div class="control-button warning" v-show="isCheckInProgress" :disabled="isCheckInProgress">Checking...</div>
      <div class="control-button danger" v-show="isCheckError" :disabled="isCheckError">Need auth</div>
      <div @click="$emit('openSession')">Открыть сессию</div>
      <div @click="$emit('connectSession')">Подключиться</div>

      <router-link v-if="$store.state.user.isLogined" to="/profile" class="right">{{$store.state.user.username}}</router-link>
      <router-link v-else to="/signin" class="right">Войти</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        version: VERSION,
        buildDate: (new Date(BUILD_TIMESTAMP)).toLocaleDateString('en-GB'),
        isCheckInProgress: false,
        isCheckError: false,
      }
    },

    methods: {
      showVersion() {
        this.$store.state.popups.alert(`Build date: ${this.buildDate}`)
      },
      checkStartEmit() {
        if (this.isCheckInProgress === false) {
          this.$emit('startCheck');
        }
      },
      checkBegin() {
        this.isCheckInProgress = true;
      },
      checkDone() {
        this.isCheckInProgress = false;
      },
      checkError() {
        this.isCheckError = true;
      },
    },

    mounted() {
      window.addEventListener('keydown', (ev) => {
        if (ev.key === 'F9') {
          this.checkStartEmit();
        }
      });
    }
  }
</script>
