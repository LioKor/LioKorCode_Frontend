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

    .sidePart
      z-index 2
      position relative
      margin-left auto
      width 60%
      margin-right -20%
      padding-right 20%
      height sidePartHeight
      right 0
    .sidePart:after
      content ""
      background headerBG
      border-bottom-left-radius borderRadiusBottom
      box-shadow shadow
      border-left empColor solid 3px
      border-top transparent solid borderRadiusTop*2
      position absolute
      left 0
      right 0
      top -1px
      bottom 0
      transform skew(degree)
      z-index -1
    .sidePart:before
      content ""
      position absolute
      width borderRadiusTop
      height borderRadiusTop
      left (- borderRadiusTop - sidePartHeight/4 + borderRadiusTop/4)
      top 0
      background  linear-gradient(to bottom, headerBG, transparent) 50% 0 / 100% 10px no-repeat, radial-gradient(circle at 0 100%, transparent 55%, black 70%, empColor 70% 72%, headerBG 78%) no-repeat
      transform skew(degree)

    .sidePart
      padding-top 50px
      div
        margin 15px 40px 15px 0
        font-size 25px
        color textColor3
      div:nth-child(1)
        margin-left 20px
      div:nth-child(2)
        margin-left 40px
      div:nth-child(3)
        margin-left 60px
      div:nth-child(4)
        margin-left 80px
</style>

<template>
  <div class="header">
    <div class="topLine">
      <router-link to="#">Туда</router-link>
      <router-link to="#">Сюда</router-link>
      <router-link to="#">Обратно</router-link>

      <router-link to="#" class="right">Твоё имя</router-link>
    </div>
    <div class="sidePart">
      <div>Выполнено: 1/5</div>
      <div>Осталось: 10</div>
      <div>Оценка: 4</div>
      <div>Курс: 3/20</div>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>
