<style lang="stylus">
  @import "../../styles/constants.styl"

  taskHeight = 200px
  taskWidth = 300px
  shadow = -5px 5px 10px colorShadow
  shadow-hover = -10px 10px 20px colorShadow
  border-color = black

  colorHover = #9b1616
  border-title-color = wheat
  border-title-width = 1px

  .preview
    overflow visible
    position relative
    width taskWidth
    height taskHeight
    padding 20px 50px 20px 60px
    margin 30px
    text-decoration none
    z-index 0
    .title-container
      background linear-gradient(90deg, transparent, border-title-color, transparent) no-repeat 50% 100% / 100% border-title-width
      padding-bottom 5px
      .id
        margin-right 5px
        padding-right 7px
        background linear-gradient(0, transparent, border-title-color, transparent) no-repeat 100% 50% / border-title-width 100%
      .title
      .id
        font-weight bold
        color textColor1
        text-shadow none
        transition text-shadow 0.5s ease
    .description
      transition color 0.5s ease
      color textColor2
      padding 10px 0 0 5px
  .preview:hover
    .title
    .id
      text-shadow -2px 2px 5px colorShadow
    .description
      color textColor1
  .preview:before
    content ""
    position absolute
    left 0
    right 0
    top 0
    bottom 0
    transform skew(-30deg)
    background linear-gradient(60deg, gradColor2 0%, color4 50%, colorHover 50%, color5 100%)
    background-size 300% 100%
    background-position-x 0
    border border-color 1px solid
    transition all 0.2s ease, background-position-x 1s cubic-bezier(0.2, 1, 0.5, 1)
    box-shadow shadow
    z-index -1
  .preview:hover:before
    box-shadow shadow-hover
    background-position-x -50%
  .preview:first-child
    padding-left 0
  .preview:first-child:before
    left (- taskHeight / 2)
  .preview:last-child
    padding-right 0
  .preview:last-child:before
    right -300%
</style>

<template>
  <router-link :to="'/task' + pathModifier + '/' + task.id" id="taskPreview" class="preview">
    <div class="title-container">
      <span class="id">{{ task.id }}</span><span class="title">{{ task.name }}</span>
    </div>
    <div class="description">{{ task.description }}</div>
    <!--div class="scale" style="--scale: {{ task.hardness }};"></div-->
  </router-link>
</template>

<script>
  export default {
    props: {
      task: {},
      pathModifier: "",
    },
    mounted() {
    },
    methods: {
    }
  }
</script>
