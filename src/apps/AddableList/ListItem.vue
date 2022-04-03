<style lang="stylus">
  @require '../../styles/constants.styl'

  cross-size = 20px
  cross-lines-width = 14%
  cross-color = color5
  .cross {
    width cross-size
    height cross-size
    transform: rotate(45deg);
    position: relative;
    display: inline-block;
    transition all 0.3s ease
    border-radius 50%
  }
  .cross:hover
    transform: rotate(135deg) scale(1.1);
  .cross:hover:before,
  .cross:hover:after
    background cross-color

  .cross:before, .cross:after {
    content: "";
    position: absolute;
    z-index: -1;
    background: cross-color;
  }
  .cross:before {
    top: 0;
    left: 50%;
    width: cross-lines-width;
    margin-left (- cross-lines-width / 2)
    height: 100%;
  }
  .cross:after {
    top: 50%;
    left: 0;
    height: cross-lines-width;
    margin-top (- cross-lines-width / 2)
    width: 100%;
  }

  .btn.delete
    display flex
    align-content center
    justify-content center
    background color3
    padding 8px
  .btn.delete:hover
    background color4
</style>

<template>
  <span class="orderid">{{ idx }}</span>
  <div class="btn delete" @click="$emit('deleteListItem', idx)"><span class="cross"></span></div>
  <input type="text" placeholder="Входные данные" class="form-control" ref="input1" :value="modelValue[0]" @input="updateVModel">
  <input type="text" placeholder="Выходные данные" class="form-control" ref="input2" :value="modelValue[1]" @input="updateVModel"
    @keydown.tab="addItemIfLast">
</template>

<script>
  export default {
    props: {
      idx: Number,
      modelValue: [], // aka "item"
    },

    methods: {
      updateVModel() {
        this.$emit('update:modelValue', [this.$refs.input1.value,this.$refs.input2.value]);
      },
      addItemIfLast(e) {
        if (!e.target.parentElement.nextElementSibling)
          this.$parent.addItem();
      },
    }
  }
</script>
