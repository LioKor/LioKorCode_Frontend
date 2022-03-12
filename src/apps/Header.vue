<style>
  #versionSpan {
    cursor: pointer;
  }
</style>

<template>
  <div class="top">
    <div class="mobile-hide"><div class="logo"><strong>LioKor Code</strong> <span id="versionSpan" @click="showVersion">{{ version }}</span></div></div>
    <div class="mobile-show"><div class="logo"><strong>LK Code</strong></div></div>

<!--    <div id="openButton" class="control-button">Open<span class="mobile-hide"> (Drag&Drop)</span></div>-->
<!--    <div id="saveButton" class="control-button">Save<span class="mobile-hide"> (Ctrl+S)</span></div>-->
<!--    <div id="runButton" class="control-button">Run<span class="mobile-hide"> (F8)</span></div>-->
<!--    <div id="checkButton" class="control-button">Check<span class="mobile-hide"> (F9)</span></div>-->
<!--    <div id="terminateButton" style="display: none;" class="control-button warning">Cancel check<span class="mobile-hide"> (Ctrl+F9)</span></div>-->
  </div>
</template>

<script>
  import { BUILD_TIMESTAMP } from '../build_info';

  export default {
    data() {
      return {
        version: VERSION,
        buildDate: (new Date(BUILD_TIMESTAMP)).toLocaleDateString('en-GB')
      }
    },
    methods: {
      showVersion: function() {
        alert(`Build date: ${this.buildDate}`)
      }
    }
  }
</script>