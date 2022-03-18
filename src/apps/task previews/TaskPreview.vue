<style lang="stylus">
  @import "../../styles/constants.styl"

  taskHeight = 200px
  taskWidth = 300px
  shadow = -5px 5px 10px colorShadow

  .preview
    overflow visible
    position relative
    width taskWidth
    height taskHeight
    padding 20px 60px
    margin 30px
    text-decoration none
    z-index 0
    .id
      margin-right 10px
    .title
    .id
      color textColor1
    .description
      color textColor3
      padding 10px
  .preview:before
    content ""
    position absolute
    left 0
    right 0
    top 0
    bottom 0
    transform skew(-30deg)
    background linear-gradient(30deg, color3, color2)
    background-size 200%
    background-position-x 100%
    border color3 1px solid
    transition background-position-x 0.2s ease
    box-shadow shadow
    z-index -1
  .preview:hover:before
    background-position-x 0
  .preview:first-child:before
    left -300%
  .preview:last-child:before
    right -300%
</style>

<template>
  <router-link :to="'/task/' + task.id" id="taskPreview" class="preview">
    <span class="id">{{ task.id }}</span><span class="title">{{ task.name }}</span>
    <div class="description">{{ task.description }}</div>
    <!--div class="scale" style="--scale: {{ task.hardness }};"></div-->
  </router-link>
</template>

<script>
  export default {
    props: {
      task: {},
    },
    mounted() {
    },
    methods: {
    }
  }
</script>
