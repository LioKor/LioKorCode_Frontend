<style lang="stylus">
  @require '../styles/constants.styl'

  header
    max-height auto
    transition max-height ease-out 0.2s
    overflow hidden
  header.lite
    height logo-height
    line-height logo-height
    .logo
      padding logo-padding 0
      display flex
      margin 0 auto
      width logo-width
      text-align center
      text-decoration none
      .image
        padding-top logo-padding
        img
          height image-height
      .text
        padding-left logo-padding
        color textColor1
        font-family Arial
        font-size 2.5rem
        letter-spacing .2rem
</style>

<template>
  <header class="lite mobile-hide">
    <router-link to="/" class="logo">
      <div class="image">
        <img src="../images/liokor_logo.png" alt="logo">
      </div>
      <div class="text">
        <span>CODE</span>
      </div>
    </router-link>
  </header>
</template>

<script>
  export default {

  }
</script>
