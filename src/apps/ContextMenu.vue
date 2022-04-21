<style lang="stylus">
  @require "../styles/constants.styl"

  font-size = 16px
  font-size-hints = 12px
  text-color = textColor2
  text-color-hints = textColor5
  .context-menu
    display: none;
    position: absolute;
    z-index: 10;
    padding: 12px 15px;
    width: 240px;
    background-color: mix(color2, transparent);
    border: solid 1px color4;
    box-shadow: 0 0 5px colorShadow;
    list-style: none;
    > li
      cursor: pointer;
      display: block;
      padding: 2px 6px;
      margin-bottom: 4px;
      background color3
      font-size font-size
      color text-color
      .context-item-hint
        float right
        font-size font-size-hints
        color text-color-hints
        line-height font-size
    > li:hover,
    > li:focus
      background color4
  .context-menu.active
    display: block;
</style>

<template>
  <ul v-for="(menu, menuIdx) in menus" class="context-menu in-context-menu" ref="menus" :data-menu-idx="menuIdx">
    {{menu.name}}
    <li v-for="item in menu.items" ref="items" @click.capture="item.action(contextElement); hideAllMenus();" class="context-menu-item in-context-menu">
      <span class="context-item-name">{{item.name}}</span>
      <span class="context-item-hint">{{item.hint}}</span>
    </li>
  </ul>
</template>

<script>
  import {getPosition} from "../utils/utils.js";

  export default {
    props: {
      menus: {
        type: Array,
        default: []
      }
      // [
      //   {
      //    targets: "",
      //    name: "",
      //    items: [
      //      {
      //        name: "",
      //        action: () => {}
      //      },
      //      ]
      //   }
      // ]
    },

    data() {
      return {
        contextElement: HTMLElement,
      }
    },

    mounted() {
      this.setContextClickListener();
      this.setClickListener();
      this.setKeyControlsListener();
    },

    unmounted() {
      this.removeContextClickListener();
      this.removeClickListener();
      this.removeKeyControlsListener();
    },

    methods: {
      setContextClickListener() {
        this._contextClickListener = (e) => {
          const menuIdx = this.menus.findIndex(menu => e.target.classList.contains(menu.targets));
          this.hideAllMenus();
          if (menuIdx === -1) {
            this.contextElement = undefined;
            return;
          }
          this.contextElement = e.target;
          e.preventDefault();
          this.positionMenu(e, menuIdx);
          this.showMenu(menuIdx);
        };

        window.addEventListener("contextmenu", this._contextClickListener);
      },
      removeContextClickListener() {
        window.removeEventListener("contextmenu", this._contextClickListener);
      },

      setClickListener() {
        this.clickListener = (e) => {
          if (e.target.classList.contains('in-context-menu')) {
            e.preventDefault();
            return;
          }
          if ((e.which || e.button) === 1) {
            this.hideAllMenus();
          }
        };

        window.addEventListener( "click", this.clickListener);
      },
      removeClickListener() {
        window.removeEventListener( "click", this.clickListener);
      },

      setKeyControlsListener() {
        // document.addEventListener('keydown', (e) => {
        //   switch (e.code) {
        //   case 'Escape':
        //     this.hideAllMenus();
        //     break;
        //   case 'Enter':
        //     this.hideAllMenus();
        //     break;
        //   case 'ArrowDown':
        //     // const focusEl = this.$refs.items.find(el => el.hasFocus());
        //     // if (!focusEl) {
        //     //   this.$refs[0].focus();
        //     //   return;
        //     // }
        //     // const nextEl = focusEl.nextElementSibling;
        //     // if (!nextEl)
        //     //   return;
        //     // focusEl.blur();
        //     // nextEl.focus();
        //     break;
        //   case 'ArrowUp':
        //     break;
        //   }
        // }, Modernizr.passiveeventlisteners ? {passive: true} : false);
      },
      removeKeyControlsListener() {
      },

      showMenu(menuIdx) {
        this.$refs.menus[menuIdx].classList.add('active');
      },

      hideAllMenus() {
        this.$refs.menus.forEach(el => el.classList.remove('active'));
      },

      positionMenu(e, menuIdx) {
        const
          el = this.$refs.menus[menuIdx],

          clickCoords = getPosition(e),
          clickCoordsX = clickCoords.x,
          clickCoordsY = clickCoords.y,

          menuWidth = el.offsetWidth + 4,
          menuHeight = el.offsetHeight + 4,

          windowWidth = window.innerWidth,
          windowHeight = window.innerHeight;

        if ((windowWidth - clickCoordsX) < menuWidth) {
          el.style.left = windowWidth - menuWidth + "px";
        } else {
          el.style.left = clickCoordsX + "px";
        }

        if ((windowHeight - clickCoordsY) < menuHeight) {
          el.style.top = windowHeight - menuHeight + "px";
        } else {
          el.style.top = clickCoordsY + "px";
        }
      },
    }
  }
</script>
