<style lang="stylus">
  line-width = 15px
  line-color = #E0E0E0
  points-font-size = 20px

  .slide-line
    position relative
    display flex
    justify-content center
    align-items center

    background-color line-color

    font-size points-font-size

  .slide-line.vertical
    cursor ew-resize
    height 100%
    width line-width
  .slide-line.vertical:before
    content "⋮"

  .slide-line.horizontal
    cursor ns-resize
    width 100%
    height line-width
  .slide-line.horizontal:before
    content "⋯"
</style>

<template>
  <div id="slideLine" class="slide-line"
       @mousedown="startSlide"
       @touchstart="startSlide"
  ></div>
</template>

<script>
  export default {
    data() {
      return {
        leftBlock: HTMLElement, // TODO: make non-reactive
        rightBlock: HTMLElement, // TODO: make non-reactive
        el: HTMLElement, // TODO: make non-reactive
        isInSlide: false, // TODO: make non-reactive
      }
    },
    props: {
      el1: {
        type: String,
        required: true,
      },
      el2: {
        type: String,
        required: true,
      }
    },
    mounted() {
      this.leftBlock = document.getElementById(this.el1);
      this.rightBlock = document.getElementById(this.el2);
      if (this.$el.classList.contains('horizontal')) {
        this.mode = "height";
      } else if (this.$el.classList.contains('vertical')) {
        this.mode = "width";
      }

      this.isInSlide = false;
      this.el = this.$el;

      window.addEventListener('mouseup', this.endSlide);
      window.addEventListener('touchend', this.endSlide);
      window.addEventListener('mousemove', this.slideEvent);
      window.addEventListener('touchmove', this.slideEvent);

      this.applySlide(window.localStorage.getItem(this.mode) || 30)
    },
    methods: {
      applySlide(leftPercentage) {
        if (leftPercentage <= 2) { // due to padding can't hide if only width is 0
          this.leftBlock.style.display = 'none';
          this.rightBlock.style[this.mode] = '100%';
          this.el.style[this.mode] = '50px';
        } else if (leftPercentage >= 98) {
          this.leftBlock.style[this.mode] = '100%';
          this.rightBlock.style.display = 'none';
          this.el.style[this.mode] = '50px';
        } else {
          this.leftBlock.style.removeProperty('display');
          this.leftBlock.style[this.mode] = leftPercentage + '%';
          this.el.style[this.mode] = null;

          this.rightBlock.style.removeProperty('display');
          this.rightBlock.style[this.mode] = (100 - leftPercentage) + '%';
        }
      },
      startSlide() {
        this.isInSlide = true;
        document.body.style.setProperty('user-select', 'none');
        document.body.style.setProperty('cursor', 'pointer');
      },
      endSlide() {
        if (this.isInSlide) {
          this.isInSlide = false;
          document.body.style.removeProperty('user-select');
          document.body.style.removeProperty('cursor');

          let leftPercentage = 0;
          if (this.rightBlock.style.display === 'none') {
            leftPercentage = 100;
          } else if (this.leftBlock.style.display !== 'none') {
            leftPercentage = this.leftBlock.style[this.mode].slice(0, this.leftBlock.style[this.mode].length - 1);
          }

          window.localStorage.setItem(this.mode, leftPercentage.toString());
        }
      },
      slideEvent(e) {
        if (this.isInSlide) {
          let percPos;
          switch (this.mode) {
            case 'width':
              //const maxWidth = this.leftBlock.scrollWidth + this.el.scrollWidth + this.rightBlock.scrollWidth;
              const maxWidth = window.innerWidth;
              percPos = Math.round(e.pageX / maxWidth * 100);
              break;
            case 'height':
              //const maxHeight = this.leftBlock.scrollHeight + this.el.scrollHeight + this.rightBlock.scrollHeight;
              const maxHeight = window.innerHeight;
              percPos = Math.round(e.pageY / maxHeight * 100);
              break;
          }
          this.applySlide(percPos);
        }
      }
    }
  }
</script>
