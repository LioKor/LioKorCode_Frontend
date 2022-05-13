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

    .task-edit
      position absolute
      color textColor1
      right 0
      z-index 10

    .text-container
      display block
      width 100%
      height 100%
      text-decoration none
      overflow hidden

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
      .author
        color textColor1
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
  /*.preview:last-child
    .decoration
      right -100%*/
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


  .previews-container.width-720
    .preview:nth-child(2n + 1)
      width (taskWidth * 2)
      margin-right 60px
    .preview:nth-child(2n + 1)::before
      left (- taskHeight / 2)
    .preview:nth-child(2n + 2)
      padding-right 0
      margin-left 60px
    .preview:nth-child(2n + 2)::before
      right -300%
    .preview:nth-child(1)
      margin-right 50%

  .previews-container.width-1080
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

  .previews-container.width-1440
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

  .previews-container.width-1800
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

  .previews-container.width-more-1800
    --additional-width 0
    .preview:nth-child(1)
    .preview:nth-child(5n + 4)
      padding-left 0
    .preview:nth-child(1)::before
    .preview:nth-child(5n + 4)::before
      left (- taskHeight / 2)
    .preview:nth-child(5n + 3)
      padding-right 0
      margin-right var(--additional-width)
    .preview:nth-child(3)
      margin-right 'calc(%s + var(--additional-width) - %s)' % ((preview-margin + (taskWidth + preview-margin * 2) * 2) (taskWidth))
    .preview:nth-child(5n + 3)::before
        right -99999px
</style>

<template>
  <div class="preview">
    <router-link :to="`/task/edit/${task.id}`" class="task-edit svg-button" v-if="task.creatorId === $store.state.user.id">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
      </svg>
    </router-link>

    <router-link :to="`/task/${task.id}`" class="text-container">
      <div class="title-container">
        <div>
          <span class="id">{{ task.id }}</span><span class="title">{{ task.name }}</span>
        </div>
        <div class="author">
          Автор: {{ task.creator }}
        </div>
      </div>
      <div class="description">{{ task.description }}</div>
      <div class="decoration">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </router-link>
  </div>
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
