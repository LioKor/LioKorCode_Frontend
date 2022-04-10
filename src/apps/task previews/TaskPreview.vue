<style lang="stylus">
  @import "../../styles/constants.styl"

  taskHeight = 200px
  taskWidth = 300px
  shadow = -5px 5px 10px colorShadow
  shadow-hover = -10px 10px 20px colorShadow
  border-color = black
  preview-margin = 30px

  colorHover = #9b1616
  border-title-color = wheat
  border-title-width = 1px

  degree = -30deg

  preview-background = linear-gradient(60deg, gradColor2 0%, mix(color4, transparent) 50%, colorHover 50%, color5 100%)

  .preview
    overflow visible
    position relative
    width taskWidth
    height taskHeight
    padding 20px 50px 20px 60px
    margin preview-margin
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
  .preview::before
    content ""
    position absolute
    inset 0
    transform skewX(degree)
    background preview-background
    background-size 300% 100%
    background-position-x 0
    border border-color 1px solid
    transition all 0.2s ease, background-position-x 1s cubic-bezier(0.2, 1, 0.5, 1)
    box-shadow shadow
    z-index -1
  .preview:hover::before
    box-shadow shadow-hover
    background-position-x -50%


  .preview
    .decoration
      position absolute
      inset 1px
      opacity 1
      transition all 0.3s cubic-bezier(0.57, 0.17, 0, 0.9)
      transform skewX(degree)
      animation 0.4s inset-from--10px
      > *
        position absolute
        background decColor1
      > *:nth-child(1)
        top 0
        right 20px
        width 13px
        height 25px
        background decColor2
        box-shadow shadow2
      > *:nth-child(3)
        bottom 60px
        left 0
        width 5px
        height 40px
  .preview:last-child
    .decoration
      right -10000px
  .preview:hover
    .decoration
      inset -10px
      opacity 0
  .preview:nth-child(2n + 1)
    .decoration
      > *:nth-child(1)
        top 10px
        right 0
        width 80px
        height 10px
        background decColor2
      > *:nth-child(2)
        top 20px
        right 0
        width 30px
        height 3px
      > *:nth-child(3)
        bottom 0
        left 100px
        width 10px
        height 30px
        box-shadow shadow2
      > *:nth-child(4)
        bottom 0
        left 120px
        width 5px
        height 13px
        box-shadow shadow2
  .preview:nth-child(3n)
    .decoration
      > *:nth-child(1)
        top 0
        right 20px
        width 13px
        height 25px
        background decColor2
        box-shadow shadow2
      > *:nth-child(2)
        top 0
        right 40px
        width 5px
        height 15px
        box-shadow shadow2
      > *:nth-child(3)
        bottom 0
        left 0
        width 15px
        height 30px
      > *:nth-child(4)
        bottom 0
        left 0
        width 130px
        height 10px
  .preview:nth-child(4n)
    .decoration
      > *:nth-child(1)
        top unset
        bottom 60px
        left 0
        width 70px
        height 10px
        background decColor2
      > *:nth-child(2)
        top unset
        bottom 50px
        left 0
        width 100px
        height 3px
      > *:nth-child(3)
        left unset
        bottom 0
        right 20px
        width 30px
        height 40px
        box-shadow shadow2
      > *:nth-child(4)
        bottom 0
        right 60px
        width 15px
        height 20px
        box-shadow shadow2

  @keyframes inset-from--10px
    0%
      inset -10px
      opacity 0

  @media (max-width: 758px)
    .preview:nth-child(1)
      margin-right 50%
    .preview
      width (taskWidth * 2)
      margin-right 60px
    .preview::before
      left (- taskHeight / 2)
  @media (min-width: 758px) and (max-width: 1118px)
    .preview:nth-child(2n + 2)
      padding-left 0
    .preview:nth-child(2n + 2)::before
      left (- taskHeight / 2)
    .preview:nth-child(2n + 1)
      padding-right 0
    .preview:nth-child(2n + 1)::before
      right -300%
    .preview:nth-child(1)
      margin-right 50%
      width (taskWidth * 2)
    .preview:nth-child(1)::before
      right 0
      left (- taskHeight / 2)
  @media (min-width: 1118px) and (max-width: 1478px)
    .preview:nth-child(2)
      margin-right preview-margin + (taskWidth + preview-margin * 2)
    .preview:nth-child(1)
    .preview:nth-child(3n + 3)
      padding-left 0
    .preview:nth-child(1)::before
    .preview:nth-child(3n + 3)::before
      left (- taskHeight / 2)
    .preview:nth-child(3n + 2)
      padding-right 0
    .preview:nth-child(3n + 2)::before
      right -300%
  @media (min-width: 1478px)
    .preview:nth-child(2)
      margin-right preview-margin + (taskWidth + preview-margin * 2) * 2
    .preview:nth-child(1)
    .preview:nth-child(4n + 3)
      padding-left 0
    .preview:nth-child(1)::before
    .preview:nth-child(4n + 3)::before
      left (- taskHeight / 2)
    .preview:nth-child(4n + 2)
      padding-right 0
    .preview:nth-child(4n + 2)::before
      right -300%
</style>

<template>
  <router-link :to="'/task' + (task.isMy ? '/edit/' : '/') + task.id" id="taskPreview" class="preview">
    <div class="title-container">
      <span class="id">{{ task.id }}</span><span class="title">{{ task.name }}</span>
    </div>
    <div class="description">{{ task.description }}</div>
    <div class="decoration">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
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
