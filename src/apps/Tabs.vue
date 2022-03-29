<style lang="stylus">
  @import "../styles/constants.styl"

  //tab-width = 25px
  bg-color = color2
  tab-color = color2
  tab-color-hover = color1mostLighter
  tab-color-select = color3
  border-color = color4

  text-color = textColor3
  text-color-hover = textColor1
  text-font-size = 18px
  padding-top = 7px
  padding-sides = 10px

  .tabs
    position relative
    display flex
    background-color bg-color
    font-size text-font-size
    margin 0
    padding 0
    list-style none
    overflow hidden

  .tabs.vertical
    flex-direction column
    height 100%
    .tab
      width 100%
      writing-mode vertical-lr
      transform rotate(180deg)
    .tab:before
      transform skewY(30deg)
      background linear-gradient(90deg, transparent 0, border-color 50%, transparent 70%) 50% 100% / 200% 1px no-repeat, linear-gradient(90deg, transparent 0%, border-color 50%, transparent 80%) 50% 0% / 200% 1px no-repeat, tab-color
    .tab:first-child:before
      bottom -1000%

  .tabs.horizontal
    flex-direction row
    width 100%
    .tab
      height 100%
    .tab:before
      transform skewX(30deg)
      background linear-gradient(transparent 0, border-color 50%, transparent 70%) 100% 50% / 1px 200% no-repeat, linear-gradient(transparent 0%, border-color 50%, transparent 80%) 0% 50% / 1px 200% no-repeat, tab-color
    .tab:first-child:before
      left -1000%

  .tabs
    .tab
      color text-color
      padding padding-sides padding-top padding-sides 0
      box-sizing border-box
      cursor default
      z-index 0
    .tab:before
      content ""
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      z-index -1
    .tab:hover
      color text-color-hover
    .tab:hover:before
      background tab-color-hover
    .tab.selected
      color text-color-hover
    .tab.selected:before
      background tab-color-select

  .close-tab-svg
    width 14px
    stroke textColor3
    border-radius 50%
    padding 2px
  .close-tab-svg:hover
    stroke color1
    background grey
</style>

<template>
  <ul id="tabs" class="tabs">
    <li v-for="item in items" @click="item.action($event); selectTab($event)" class="tab">
      {{item.name}}
      <svg v-if="item.closable !== false" @click.capture.stop="deleteTab" xmlns="http://www.w3.org/2000/svg" class="close-tab-svg" viewBox="0 0 10 10"><path d="M 10,0 L 0,10 M 0,0 L 10,10"></path></svg>
    </li>
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
        selectedEl: HTMLElement,
      }
    },

    mounted() {
      this.selectedEl = this.$el.firstElementChild;
      this.selectedEl.classList.add('selected');
    },
    methods: {
      selectTab(e) {
        this.selectedEl.classList.remove('selected');
        const newEl = e.target;
        newEl.classList.add('selected');
        this.selectedEl = newEl;
      },
      deleteTab(e) {
        e.target.parentElement.remove();
      }
    }
  }
</script>
