<style lang="stylus">
  @import "../../styles/constants.styl"

  .preview
    min-width 200px
    max-width 300px
    height 150px
    padding 10px
    margin 10px
    background linear-gradient(30deg, color3, color2)
    background-size 200%
    background-position-x 100%
    border color3 1px solid
    border-radius 20px
    overflow hidden
    text-decoration none
    transition background-position-x 0.2s ease
    .id
      margin-right 10px
    .title
    .id
      color textColor1
    .description
      color textColor3
      padding 10px
  .preview:hover
    background-position-x 0
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
      console.log(this.task);
    },
    methods: {
    }
  }
</script>
