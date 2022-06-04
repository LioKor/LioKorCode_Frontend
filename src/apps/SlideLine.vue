<style lang="stylus">
  @import "../styles/constants.styl"

  line-width = 15px
  line-bg-color = color3
  points-color = textColor1
  points-font-size = 20px

  .slide-line
    position relative
    display flex
    justify-content center
    align-items center

    background-color line-bg-color

    font-size points-font-size
  .slide-line::before
    color points-color

  .slide-line.vertical
    cursor ew-resize
    height 100%
    width line-width
  .slide-line.vertical::before
    content "⋮"

  .slide-line.horizontal
    cursor ns-resize
    width 100%
    height line-width
  .slide-line.horizontal::before
    content "⋯"
</style>

<template>
  <div class="slide-line" v-show="isUserInteractive"
       @mousedown="startSlide"
       @touchstart="startSlide"
  ></div>
</template>

<script>
  const lineWidth = 15;
  const lineBigWidth = 30;

  export default {
    data() {
      return {
        leftBlock: HTMLElement, // TODO: make non-reactive
        rightBlock: HTMLElement, // TODO: make non-reactive
        el: HTMLElement, // TODO: make non-reactive
        isInSlide: false, // TODO: make non-reactive
        isLeftCollapsed: false,
        isRightCollapsed: false,
        slideValue: this.initialValue,

        isUserInteractive: this.userInteractive,
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
      },
      uid: {
        type: String,
        required: true,
      },
      initialValue: {
        type: Number,
        validator: val => (0 <= val) && (val <= 100),
        default: 30,
      },
      userInteractive: {
        type: Boolean,
        default: true,
      },
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

      if (this.userInteractive)
        this.userInteractiveOn();

      this.applySlide(window.localStorage.getItem(this.uid + '-slide-value') || this.initialValue)
    },
    unmounted() {
      this.userInteractiveOff();
    },

    methods: {
      applySlide(leftPercentage) {
        const bigWidth = this.isUserInteractive ? lineBigWidth : 0;
        if (leftPercentage <= 2) { // due to padding can't hide if only width is 0
          this.leftBlock.style.display = 'none';
          this.rightBlock.style[this.mode] = `calc(100% - ${bigWidth}px)`;
          this.el.style[this.mode] = bigWidth + 'px';
          this.isLeftCollapsed = true;

        } else if (leftPercentage >= 98) {
          this.leftBlock.style[this.mode] = `calc(100% - ${bigWidth}px)`;
          this.rightBlock.style.display = 'none';
          this.el.style[this.mode] = bigWidth + 'px';
          this.isRightCollapsed = true;

        } else {
          this.leftBlock.style.removeProperty('display');
          this.leftBlock.style[this.mode] = leftPercentage + '%';
          this.el.style.removeProperty(this.mode);
          this.rightBlock.style.removeProperty('display');
          this.rightBlock.style[this.mode] = (100 - leftPercentage) + '%';
          this.isLeftCollapsed = false;
          this.isRightCollapsed = false;
        }

        this.slideValue = leftPercentage;
        this.$emit('sliderMoved', leftPercentage)
      },
      startSlide() {
        this.isInSlide = true;
        document.body.style.setProperty('user-select', 'none');
      },
      endSlide(forceSlideState = false) {
        if (this.isInSlide || forceSlideState) {
          this.isInSlide = false;
          document.body.style.removeProperty('user-select');

          let leftPercentage = 0;
          if (this.rightBlock.style.display === 'none') {
            leftPercentage = 100;
          } else if (this.leftBlock.style.display !== 'none') {
            leftPercentage = this.leftBlock.style[this.mode].slice(0, this.leftBlock.style[this.mode].length - 1);
          }

          window.localStorage.setItem(this.uid + '-slide-value', leftPercentage.toString());
        }
      },
      onMouseMove(e) {
        this.slideEvent(e.pageX, e.pageY);
      },
      onTouchMove(e) {
        this.slideEvent(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
      },
      slideEvent(cursorX, cursorY) {
        if (this.isInSlide) {
          let percPos, offset, cursorPos;
          switch (this.mode) {
            case 'width':
              const maxWidth = this.leftBlock.clientWidth + this.el.clientWidth + this.rightBlock.clientWidth;
              offset = this.isLeftCollapsed ? this.$el.offsetLeft : this.leftBlock.offsetLeft;
              cursorPos = (cursorX - offset);
              percPos = cursorPos / maxWidth * 100;
              break;
            case 'height':
              const maxHeight = this.leftBlock.clientHeight + this.el.clientHeight + this.rightBlock.clientHeight;
              offset = this.isLeftCollapsed ? this.$el.offsetTop : this.leftBlock.offsetTop;
              cursorPos = (cursorY - offset);
              percPos = cursorPos / maxHeight * 100;
              break;
          }
          this.applySlide(percPos);
        }
      },

      applySlideSmothly(slideValue) {
        let prevTime;
        requestAnimationFrame((time) => prevTime = time);

        const animate = (time) => {
          const frameSlide = (slideValue - this.slideValue) * 0.015 * (time - prevTime) + Number(this.slideValue);

          if (Math.abs(slideValue - frameSlide) > 0.5) {
            this.applySlide(frameSlide);
            prevTime = time;
            requestAnimationFrame(animate);
          } else {
            this.endSlide(true);
          }
        };

        requestAnimationFrame(animate);
      },

      userInteractiveOn() {
        this.isUserInteractive = true;
        window.addEventListener('mouseup', this.endSlide);
        window.addEventListener('touchend', this.endSlide);
        window.addEventListener('touchcancel', this.endSlide);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('touchmove', this.onTouchMove);
        this.applySlide(this.slideValue);
      },

      userInteractiveOff() {
        this.isUserInteractive = false;
        window.removeEventListener('mouseup', this.endSlide);
        window.removeEventListener('touchend', this.endSlide);
        window.removeEventListener('touchcancel', this.endSlide);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('touchmove', this.onTouchMove);
        this.applySlide(this.slideValue);
      }
    }
  }
</script>
