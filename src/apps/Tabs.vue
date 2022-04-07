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
  text-font-size = 16px
  tab-height = 23px
  padding-top = (tab-height - text-font-size)
  padding-sides = 10px
  padding-bottom = 4px

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
    width tab-height
    .tab
      width 100%
      writing-mode vertical-lr
      transform rotate(180deg)
      padding padding-sides padding-top padding-sides 0
    .tab:before
      transform skewY(30deg)
      background linear-gradient(90deg, transparent 0, border-color 50%, transparent 70%) 50% 100% / 200% 1px no-repeat, linear-gradient(90deg, transparent 0%, border-color 50%, transparent 80%) 50% 0% / 200% 1px no-repeat, tab-color
    .tab:first-child:before
      bottom -1000%

  .tabs.horizontal
    flex-direction row
    width 100%
    height tab-height + padding-bottom
    .tab
      height 100%
      padding padding-top padding-sides padding-bottom padding-sides
    .tab:before
      transform skewX(30deg)
      background linear-gradient(transparent 0, border-color 50%, transparent 70%) 100% 50% / 1px 200% no-repeat, linear-gradient(transparent 0%, border-color 50%, transparent 80%) 0% 50% / 1px 200% no-repeat, tab-color
    .tab:first-child:before
      left -1000%

  .tabs
    .tab
      transition all 0.2s ease
      color text-color
      box-sizing border-box
      cursor default
      position relative
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
    margin-bottom -2px
    stroke textColor5
    border-radius 50%
    padding 2px
  .close-tab-svg:hover
    stroke color1
    background grey

  .blocked
    .tab
      cursor not-allowed
</style>

<template>
  <ul class="tabs">
    <li v-for="(item, idx) in reactiveItems" :data-idx="idx" ref="items" @click="selectTab" class="tab">
      {{item.name}}
      <svg v-if="item.closable !== false" @click.stop="deleteTab" xmlns="http://www.w3.org/2000/svg" class="close-tab-svg" viewBox="0 0 10 10"><path d="M 10,0 L 0,10 M 0,0 L 10,10"></path></svg>
    </li>
  </ul>
</template>

<script>
  import {nextTick} from "vue";

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
        reactiveItems: this.items,
        selectedEl: null,
        canChangeTabs: true,
      }
    },

    mounted() {
      if (this.$refs.items) {
        this.selectedEl = this.$refs.items[0];
        this.selectedEl.classList.add('selected');
      }
    },
    methods: {
      selectTabEl(el, withAction = false) {
        if (!el)
          return;
        if (!this.canChangeTabs)
          return;

        if (this.selectedEl)
          this.selectedEl.classList.remove('selected');
        el.classList.add('selected');
        this.selectedEl = el;

        if (!withAction)
          return;
        const idx = el.getAttribute('data-idx');
        const item = this.reactiveItems[idx];
        item.action();
        //this.$emit('selectTab', item, idx);
      },
      selectTabIndex(ind) {
        this.selectTabEl(this.$refs.items[ind], true);
      },
      selectTab(e) {
        const el = e.target;
        this.selectTabEl(el, true);
      },
      findItemByUnique(uniqueValue) {
        const idx = this.reactiveItems.findIndex(tab => tab.uniqueValue === uniqueValue);
        if (idx === -1)
          return null;
        return {item: this.reactiveItems[idx], idx: idx};
      },
      deleteTabByIdx(idx) {
        this.reactiveItems.splice(idx, 1);
        //this.$emit('deleteTab', item, idx);

        if (this.reactiveItems.length === 0) {
          this.$emit('lastTabClosed');  // to clear editor after this event
        }
      },
      deleteTabByItem(uniqueValue) {
        const item = this.findItemByUnique(uniqueValue);
        if (!item)
          return;
        this.deleteTabByIdx(item.idx);
      },
      deleteTab(e) {
        if (!this.canChangeTabs)
          return;

        let el = e.target;
        while(el.tagName !== 'LI')
          el = el.parentElement;

        const idx = el.getAttribute('data-idx');
        if (this.selectedEl === el)
            this.selectTabEl(el.previousElementSibling || el.nextElementSibling, true);

        this.deleteTabByIdx(idx);
      },
      async addTab(item = {name: "", action: () => {}, closable: true, uniqueValue: undefined}, setSelected = true) {
        const existingItemIdx = this.reactiveItems.findIndex(it => it.uniqueValue === item.uniqueValue);
        if (existingItemIdx !== -1) {
          if (setSelected) {
            this.selectTabEl(this.$refs.items[existingItemIdx]);
          }
          return;
        }
        this.reactiveItems.push(item);
        await nextTick();
        this.selectTabEl(this.$refs.items[this.$refs.items.length-1]);
      },
      getSelected() {
        if (!this.selectedEl)
          return null;
        const idx = this.selectedEl.getAttribute('data-idx');
        return this.reactiveItems[idx];
      },
      updateTab(uniqueValue, name) {
        const item = this.findItemByUnique(uniqueValue);
        if (!item)
          return;
        item.item.name = name;
      },

      closeAllTabs() {
        this.reactiveItems = [];
        this.selectedEl = null;
      },

      lockChangeTabs() {
        this.canChangeTabs = false;
        this.$el.classList.add('blocked');
      },
      unlockChangeTabs() {
        this.canChangeTabs = true;
        this.$el.classList.remove('blocked');
      }
    }
  }
</script>
