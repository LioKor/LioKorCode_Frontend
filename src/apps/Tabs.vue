<style lang="stylus">
  @import "../styles/constants.styl"

  //tab-width = 25px
  tab-color = color3
  text-color = textColor1
  text-font-size = 16px
  padding = 7px

  .tabs
    position relative
    display flex
    background-color tab-color
    font-size text-font-size
    margin 0
    padding 0
    list-style none
  .tabs.vertical
    flex-direction column
    height 100%
    //width tab-width
    > li
      width 100%
      padding padding
      padding-left 0
      box-sizing border-box
      writing-mode vertical-lr
      transform rotate(180deg)
  .tabs.horizontal
    flex-direction row
    width 100%
    height tab-width
</style>

<template>
  <ul id="tabs" class="tabs">
    <li v-for="item in items" @click="item.action">{{item.name}}</li>
  </ul>
</template>

<script>
  export default {
    props: {
      items: {
        type: [],
        default: [],
        required: true,
      },
    },

    data() {
      return {

      }
    },

    mounted() {
    },
    methods: {

    }
  }
</script>
