<style lang="stylus">
  @import "../../styles/constants.styl"

  betweenItems = 30px
  headerHeight = 50px
  headerBG = color2
  highLightColor = color4
  empColor = color5

  sidePartHeight = 300px
  borderRadiusTop = 40px
  borderRadiusBottom = 20px
  degree = 26.5deg
  shadow = -5px 5px 5px black

  .header
    height headerHeight
    margin-bottom 30px
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
      *
        color textColor1
        text-decoration none
        letter-spacing 2px
        cursor pointer
        padding 0 betweenItems
        position relative
        list-style none
        display inline-block
        z-index 0
      *:first-child
        padding-left (betweenItems * 2)
        margin-left (- betweenItems)
      *.right
        float right
      *.right:last-child
        padding-right (betweenItems * 2)
        margin-right (- betweenItems)
      *:before
      *:after
        content ""
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        transform skew(-30deg)
        z-index -1
      *:after
        background linear-gradient(transparent 0, highLightColor 50%, transparent 70%) 100% 50% / 2px 200% no-repeat, linear-gradient(transparent 0%, color4 50%, transparent 80%) 0% 50% / 2px 200% no-repeat
      *:before
        background linear-gradient(highLightColor, transparent) 0 100% / 100% 200% no-repeat
        transition all 0.2s ease
      *:hover:before
        background-position-y 0
</style>

<template>
  <div class="header">
    <div class="topLine">
      <router-link to="/">Задания</router-link>
      <router-link to="#">Сюда</router-link>
      <router-link to="#">Обратно</router-link>

      <router-link to="/profile" class="right">Профиль</router-link>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>
