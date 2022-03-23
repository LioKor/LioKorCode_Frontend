<style lang="stylus">
  @require '../../styles/constants.styl'

  .addable-list
    padding 0
    list-style none
    > li
      margin-top 10px
      margin-bottom 10px
      display flex
      justify-content space-between
      align-items center

      :last-child
        margin-bottom 0
      :first-child
        margin-top 0

      > input
        flex 1
        width 100%
        padding 10px
        box-sizing border-box
        float left
      > .radio
        margin-left 20px
        margin-right 5px
      > .button
        opacity 1
        transition all 0.3s ease
        overflow hidden
        height 40px
        box-sizing border-box
        float right
        display flex
        align-content center
        justify-content center
        .arrow.right
          margin-left 5px
      > div:last-child
        width 20%
        margin-left 20px
      > div:not(:last-child)
        margin-right 20px
      > div.closed
        opacity 0
        width 0
        padding-left 0
        padding-right 0
        margin-left 0
        margin-right 0
        pointer-events none
      > .orderid
        display flex
        align-items center
        margin-right 5px
        color textColor1
        font-size 20px
      > .move-buttons
        > .button
          padding 0 15px
    > li:first-child
      > .move-buttons
        > .button:first-child
          opacity 0.2
          pointer-events none
    > li:last-child
      > .move-buttons
        > .button:last-child
          opacity 0.2
          pointer-events none

  .btn.delete
    display flex
    align-content center
    justify-content center
    background color3
    padding 8px
  .btn.delete:hover
    background color4
  .btn.thin
    padding-top 2px
    padding-bottom 2px
</style>

<template>
  <ul class="addable-list" @input="">
    <li v-for="(item, idx) in modelValue">
      <ListItem v-model="modelValue[idx]" :idx="idx + 1" @deleteListItem="deleteItem"></ListItem>
    </li>
  </ul>
</template>

<script>
  import {openRoll} from "../../utils/show-hide";
  import ListItem from "./ListItem.vue";

  export default {
    components: {ListItem},
    props: {
      modelValue: [], // aka "items"
    },

    mounted() {
      //openRoll(this.$el);
    },

    methods: {
      addItem() {
        this.modelValue.push(["", ""]);
        //openRoll(this.$el);
        this.updateVModel();
      },

      deleteItem(idx) {
        this.modelValue.splice(idx - 1, 1);
        this.updateVModel();
      },

      updateVModel() {
        console.log(this.modelValue);
        this.$emit('update:modelValue', this.modelValue);
      }
    }
  }
</script>
