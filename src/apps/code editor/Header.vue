<style lang="stylus">
  @import "../../styles/constants.styl"

  betweenItems = 15px
  headerHeight = 50px
  headerBG = color2
  highLightColor = color4
  highLightColorTransparent = mix(color4, transparent)
  empColor = color5

  sidePartHeight = 300px
  borderRadiusTop = 40px
  borderRadiusBottom = 20px
  shadow = -5px 5px 5px black

  .editor-header
    height headerHeight
    width 100%
    left 0
    top 0
    .topLine
      margin 0
      padding 0
      width 100%
      height headerHeight
      line-height headerHeight
      overflow visible
      background headerBG
      box-shadow shadow
      > *
        text-decoration none
        letter-spacing 2px
        cursor pointer
        padding 0 betweenItems
        position relative
        list-style none
        display inline-block
        z-index 0
      > *:first-child
        padding-left (betweenItems * 6)
        margin-left (- betweenItems * 5)
      > *.right
        float right
      > *.right:last-child
        padding-right (betweenItems * 6)
        margin-right (- betweenItems * 5)
      > *:before
      > *:after
        content ""
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        transform skew(-30deg)
        z-index -1
      > *:after
        background linear-gradient(transparent 0, highLightColor 50%, transparent 70%) 100% 50% / 2px 200% no-repeat, linear-gradient(transparent 0%, color4 50%, transparent 80%) 0% 50% / 2px 200% no-repeat
      > *:before
        background linear-gradient(highLightColor, transparent) 0 100% / 100% 200% no-repeat
        transition all 0.2s ease
      .control-button:before
        background linear-gradient(#2A9922, highLightColorTransparent, transparent) 0 100% / 100% 200% no-repeat
      .control-button.warning:before
        background linear-gradient(#ffe344, transparent) 0 100% / 100% 200% no-repeat
      .control-button.danger:before
        background linear-gradient(#ff2e1f, transparent) 0 100% / 100% 200% no-repeat

      > *:hover:before
        background-position-y 0

      .logo
        padding 0 10px
        margin-right 15px
        @media screen and (max-width: $mobileWidth) {
          margin-right 0
        }
</style>

<template>
  <div class="editor-header">
    <div class="topLine">
      <div class="mobile-hide"><div class="logo"><strong>LioKor Code</strong> <span id="versionSpan" @click="showVersion">{{ version }}</span></div></div>
      <div class="mobile-show"><div class="logo"><strong>LK Code</strong></div></div>
      <router-link to="/" class="control-button">Tasks</router-link>
      <div class="control-button" v-show="!isCheckInProgress" @click=checkBegin>Check<span class="mobile-hide"> (F9)</span></div>
      <div class="control-button warning" v-show="isCheckInProgress" :disabled="isCheckInProgress">Checking...</div>

      <router-link to="/signin" class="right">Профиль</router-link>

<!--      <router-link to="#">Туда</router-link>-->
<!--      <router-link to="#">Сюда</router-link>-->
<!--      <router-link to="#">Обратно</router-link>-->

<!--      <router-link to="#" class="right">Твоё имя</router-link>-->
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
      }
    },
    methods: {
      showVersion() {
        alert(`Build date: ${this.buildDate}`)
      },
      checkBegin() {
        if (this.isCheckInProgress === false) {
          this.isCheckInProgress = true;
          this.$emit('startCheck');
        }
      },
      checkDone() {
        this.isCheckInProgress = false;
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
