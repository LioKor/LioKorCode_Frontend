<style lang="stylus">
@import "../styles/constants.styl"

arrow-size = 20px
button-height = 50px
button-width = button-height - 10px

bg-color = mix(color2, transparent, 70%)
border-color = color3
border-width = 1px
border-radius = (button-height / 2)
arrow-color = textColor1

.side-button
  position absolute
  z-index 10
  background bg-color
  width button-width
  height button-height
  padding ((button-height - arrow-size) / 2)
  padding-left 10px
  border-color border-color
  svg
    fill arrow-color
    height arrow-size

.side-button.right
  right 0
  top 50%
  transform translateY(-50%)
  border-width border-width 0 border-width border-width
  border-style solid
  border-radius border-radius 0 0 border-radius
  svg
    transform rotate(180deg)
.side-button.right::before
.side-button.right::after
  content ""
  width (border-radius * 1)
  height (border-radius * 1)
  position absolute
  right 0
.side-button.right::after
  top (- border-radius)
  background radial-gradient(circle at 0 0, transparent 70%, border-color 70%, border-color 72%, bg-color 72%)
.side-button.right::before
  bottom (- border-radius)
  background radial-gradient(circle at 0 100%, transparent 70%, border-color 70%, border-color 72%, bg-color 72%)


.side-button.left
  left 0
  top 50%
  transform translateY(-50%)
  border-width border-width border-width border-width 0
  border-style solid
  border-radius 0 border-radius border-radius 0
  svg
    transform rotate(0deg)
.side-button.left::before
.side-button.left::after
  content ""
  width (border-radius * 1)
  height (border-radius * 1)
  position absolute
  left 0
.side-button.left::after
  top (- border-radius)
  background radial-gradient(circle at 100% 0, transparent 70%, border-color 70%, border-color 72%, bg-color 72%)
.side-button.left::before
  bottom (- border-radius)
  background radial-gradient(circle at 100% 100%, transparent 70%, border-color 70%, border-color 72%, bg-color 72%)

//.side-button.top
//  top 0
//  left 50%
//  transform translateX(-50%)
//  svg
//    transform rotate(-90deg)
//.side-button.bottom
//  bottom 0
//  left 50%
//  transform translateX(-50%)
//  svg
//    transform rotate(90deg)
</style>

<template>
  <div class="side-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="6 6 12 12"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
  </div>
</template>

<script>
export default {

}
</script>
