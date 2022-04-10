<style lang="stylus">
  @require '../../styles/constants.styl'

  degree = 26.5deg

  colorHover = #9b1616
  checkbox-background = linear-gradient(60deg, gradColor2 0%, color4 50%, colorHover 50%, color5 100%)

  .search-group
    display flex
    position relative
    width 100%
    margin-left 20px
    margin-top 10px
    > div
      position relative
      padding 10px
      display flex
    > div::before
      content ""
      position absolute
      inset 0
      background decColor2
      transform skewX(degree)
      z-index -1
    > div:last-child
      flex 1
    > div:last-child::before
      background decColor2
    > div:last-child::before
      right -100%
    svg
      height 30px
      fill textColor3

    input
      width 100%
      background none
      font-size 16px
      border none
      outline none
      overflow hidden
      text-overflow ellipsis
      color textColor1
      transition all ease 0.2s
    input:focus
      padding 5px
      margin-left 5px

    input::placeholder
      color textColor5
    input:focus::placeholder
      color textColor3

    input ~ .input-bg
      position absolute
      inset 0
      z-index -1
      border-color color2
      background none
      transform skewX(degree)
      transition all ease 0.2s
    input:focus ~ .input-bg
      margin 5px
      margin-left 10px
      background color2lighter
      border-width 0 2px
      border-color color4
      border-style double

    .input-with-clear ~ .input-clear
      position absolute
      right 15px
      top 12px
      width 24px
      height 24px
      max-width 0
      transition all ease-out 0.4s
      opacity 0
      transform rotate(45deg)
    .input-with-clear:focus ~ .input-clear
      max-width 100px // to delay move after rotation
      opacity 1
      transform rotate(0)

  .checkboxes-group
    display flex
    position relative
    width 100%
    margin-left 35px
    margin-top 45px
    color textColor2
    input[type=checkbox]
      position absolute
      z-index -1
      opacity 0
    input[type=checkbox] + label
      user-select none
      display flex
      transition all 0.15s ease
    input[type=checkbox] + label::before
      content ""
      width 1em
      height 1em
      border 1px solid textColor5
      margin-right 0.5em
      background checkbox-background
      background-size 300% 100%
      background-position-x 0
      opacity 1
      transform skewX(degree)
      transition all 0.15s ease
    input[type=checkbox] + label:hover::before
      box-shadow shadow1
      border-color textColor3
    input[type=checkbox]:checked
      + label::before
        box-shadow shadow2
        background-position-x -50%
        width 3em
      + label
        color textColor1
        font-weight bold

</style>

<template>
  <div class="header">
    <div class="topLine" style="z-index: 10">
      <router-link to="/tasks/my">Мои задания</router-link>
<!--      <router-link to="#">Туда</router-link>-->
<!--      <router-link to="#">Сюда</router-link>-->

      <router-link v-if="$store.state.user.isLogined" to="/profile" class="right">{{$store.state.user.username}}</router-link>
      <router-link v-else to="/signin" class="right">Войти</router-link>
    </div>
    <div class="sidePart" style="z-index: 5">
      <div class="search-group">
        <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 520"><g><path d="M506.141,477.851L361.689,333.399c65.814-80.075,61.336-198.944-13.451-273.73c-79.559-79.559-209.01-79.559-288.569,0    s-79.559,209.01,0,288.569c74.766,74.766,193.62,79.293,273.73,13.451l144.452,144.452c7.812,7.812,20.477,7.812,28.289,0    C513.953,498.328,513.953,485.663,506.141,477.851z M319.949,319.948c-63.96,63.96-168.03,63.959-231.99,0    c-63.96-63.96-63.96-168.03,0-231.99c63.958-63.957,168.028-63.962,231.99,0C383.909,151.918,383.909,255.988,319.949,319.948z"></path></g></svg></div>
        <div>
          <input class="input-with-clear" @input="updateSearch" v-model="searchText" ref="inputSearch" type="text" placeholder="Поиск...">
          <div class="input-bg"></div>
          <svg class="input-clear svg-button" @click="$refs.inputSearch.value = ''" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m12 10.5857864 4.7928932-4.79289318c.3905243-.39052429 1.0236893-.39052429 1.4142136 0s.3905243 1.02368927 0 1.41421356l-4.7928932 4.79289322 4.7928932 4.7928932c.3905243.3905243.3905243 1.0236893 0 1.4142136s-1.0236893.3905243-1.4142136 0l-4.7928932-4.7928932-4.79289322 4.7928932c-.39052429.3905243-1.02368927.3905243-1.41421356 0s-.39052429-1.0236893 0-1.4142136l4.79289318-4.7928932-4.79289318-4.79289322c-.39052429-.39052429-.39052429-1.02368927 0-1.41421356s1.02368927-.39052429 1.41421356 0z"/></svg>
        </div>
      </div>
      <div class="checkboxes-group">
        <input id="my-tasks" @change="updateSearch" v-model="searchOptions.my" type="checkbox" name="happy" value="yes">
        <label for="my-tasks">Созданные мной</label>
      </div>

      <span class="top-decoration">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </span>
      <span class="bottom-decoration">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchText: "",
        searchOptions: {
          my: false,
        }
      }
    },

    methods: {
      updateSearch() {
        this.$emit('search', this.searchText, this.searchOptions);
      }
    },
  }
</script>
