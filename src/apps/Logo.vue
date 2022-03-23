<style lang="stylus">
  @require '../styles/constants.styl'

  header
    max-height auto
    transition max-height ease-out 0.2s
    overflow hidden
  header.lite
    height logo-height
    line-height logo-height
    div.logo
      padding logo-padding 0
      display flex
      margin 0 auto
      width logo-width
      text-align center
      div.image
        padding-top (logo-padding - 5px)
        img
          height image-height
      div.text
        padding-left logo-padding
        color textColor1
        font-family Consolas
        font-size 2.5rem
        letter-spacing .4rem
</style>

<template>
  <header class="lite mobile-hide">
    <div class="logo">
      <div class="image">
        <img src="../images/liokor_logo.png" alt="logo">
      </div>
      <div class="text">
        <span>CODE</span>
      </div>
    </div>
  </header>
</template>

<script>
  export default {

  }
</script>
