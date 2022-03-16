<style lang="stylus">
  #versionSpan
    cursor pointer
</style>

<template>
  <div class="top">
    <div class="mobile-hide"><div class="logo"><strong>LioKor Code</strong> <span id="versionSpan" @click="showVersion">{{ version }}</span></div></div>
    <div class="mobile-show"><div class="logo"><strong>LK Code</strong></div></div>

    <router-link to="/" class="control-button">Tasks</router-link>
<!--    <div id="openButton" class="control-button">Open<span class="mobile-hide"> (Drag&Drop)</span></div>-->
<!--    <div id="saveButton" class="control-button">Save<span class="mobile-hide"> (Ctrl+S)</span></div>-->
<!--    <div id="runButton" class="control-button">Run<span class="mobile-hide"> (F8)</span></div>-->
    <div class="control-button" v-show="!checkInProgress" @click=checkBegin>Check<span class="mobile-hide"> (F9)</span></div>
    <div class="control-button warning" v-show="checkInProgress" :disabled="checkInProgress">Checking...</div>

    <router-link to="/signin" class="control-button">Logout</router-link>
<!--    <div id="terminateButton" style="display: none;" class="control-button warning">Cancel check<span class="mobile-hide"> (Ctrl+F9)</span></div>-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        version: VERSION,
        buildDate: (new Date(BUILD_TIMESTAMP)).toLocaleDateString('en-GB'),
        checkInProgress: false,
      }
    },
    methods: {
      showVersion() {
        alert(`Build date: ${this.buildDate}`)
      },
      checkBegin() {
        if (this.checkInProgress === false) {
          this.checkInProgress = true;
          this.$emit('check-event');
        }
      },
      checkDone() {
        this.checkInProgress = false;
      },
    },
    mounted() {
      window.addEventListener('keydown', (ev) => {
        if (ev.key === 'F9') {
          this.checkBegin()
        }
      });
    }
  }
</script>
