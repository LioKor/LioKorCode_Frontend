<style lang="stylus" scoped>
  @require '../../styles/constants.styl'
  @require '../../styles/header.styl'

  colorHover = #9b1616
  checkbox-background = linear-gradient(60deg, gradColor2 0%, color4 50%, colorHover 50%, color5 100%)

  .search-group
    display flex
    width 100%
    margin-left 5px
    margin-top -22px
    > div
      position relative
      padding 10px
      display flex
    > div:last-child
      flex 1
    > div:last-child::before
      background decColor2
    > div:last-child::before
      right -100%
    svg
      height 30px
      fill textColor3

  .checkboxes-group
    display flex
    position relative
    width 100%
    margin-left 35px
    margin-top 32px
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

    #my-solved-tasks
    label[for=my-solved-tasks]
      position absolute
      top 30px
      left 48px
    #my-unsolved-tasks
    label[for=my-unsolved-tasks]
      position absolute
      top 60px
      left 63px

  .paginator
    margin-top 16px
    margin-left 33px

  .opacity-0
    opacity 0
    pointer-events none
</style>

<template>
  <div class="header">
    <div class="top-line" style="z-index: 10">
<!--      <div class="burger-menu">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" stroke="white" viewBox="0 0 130 100" stroke-width="5" stroke-linecap="round"><path d="M5,5 L125,5  M5,50 L105,50  M5,95 L85,95"/></svg>-->
<!--      </div>-->
      <router-link class="profile-button" :class="{'first-child': !$store.state.isMobile}" v-if="$store.state.user.isLogined" to="/profile">
        <img class="avatar-preview gif-hover-activate" :src="$store.state.user.avatarUrl" alt="">
        <span class="username mobile-hide">{{$store.state.user.username}}</span>
      </router-link>
      <router-link v-else to="/signin">Войти</router-link>

      <div class="mobile-hide" :class="{'opacity-0': isRoomsOpened}" @click="expandRooms">Развернуть комнаты</div>
    </div>
    <div class="side-part" style="z-index: 5">
      <div class="search-group">
        <div class="bg-decColor1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 520"><g><path d="M506.141,477.851L361.689,333.399c65.814-80.075,61.336-198.944-13.451-273.73c-79.559-79.559-209.01-79.559-288.569,0    s-79.559,209.01,0,288.569c74.766,74.766,193.62,79.293,273.73,13.451l144.452,144.452c7.812,7.812,20.477,7.812,28.289,0    C513.953,498.328,513.953,485.663,506.141,477.851z M319.949,319.948c-63.96,63.96-168.03,63.959-231.99,0    c-63.96-63.96-63.96-168.03,0-231.99c63.958-63.957,168.028-63.962,231.99,0C383.909,151.918,383.909,255.988,319.949,319.948z"></path></g></svg></div>
        <div class="relative-container bg-decColor1">
          <input class="input-air input-with-clear" @input="updateSearch" v-model="searchText" ref="inputSearch" type="text" placeholder="Поиск...">
          <div class="input-bg"></div>
          <svg class="input-clear svg-button" @click="searchText = ''; updateSearch();" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m12 10.5857864 4.7928932-4.79289318c.3905243-.39052429 1.0236893-.39052429 1.4142136 0s.3905243 1.02368927 0 1.41421356l-4.7928932 4.79289322 4.7928932 4.7928932c.3905243.3905243.3905243 1.0236893 0 1.4142136s-1.0236893.3905243-1.4142136 0l-4.7928932-4.7928932-4.79289322 4.7928932c-.39052429.3905243-1.02368927.3905243-1.41421356 0s-.39052429-1.0236893 0-1.4142136l4.79289318-4.7928932-4.79289318-4.79289322c-.39052429-.39052429-.39052429-1.02368927 0-1.41421356s1.02368927-.39052429 1.41421356 0z"/></svg>
        </div>
      </div>
      <Paginator class="paginator" ref="paginator" @change-page="throwEventNext"></Paginator>
      <div class="checkboxes-group">
        <input id="my-tasks" @change="toggleSolved('my'); updateSearch()" v-model="searchOptions.my" type="checkbox" value="yes">
        <label for="my-tasks">Созданные мной</label>

        <input id="my-solved-tasks" @change="toggleSolved('solved'); updateSearch()" v-model="searchOptions.solved" type="checkbox" value="yes">
        <label for="my-solved-tasks">Решённые</label>

        <input id="my-unsolved-tasks" @change="toggleSolved('unsolved'); updateSearch()" v-model="searchOptions.unsolved" type="checkbox" value="yes">
        <label for="my-unsolved-tasks">Не решённые</label>
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
  import Paginator from "./Paginator.vue";

  export default {
    components: { Paginator },

    data() {
      return {
        searchText: "",
        searchOptions: {
          my: false,
          solved: false,
          unsolved: false,
        },
        isRoomsOpened: false,

        paginatorPage: 3,
        paginatorPagesCount: 128,
      }
    },

    methods: {
      uncheckAllWithout(key) {
        for (const option of Object.keys(this.searchOptions))
          if (option !== key)
            this.searchOptions[option] = false;
      },
      toggleSolved(key) {
        if (this.searchOptions[key])
          this.uncheckAllWithout(key);
      },

      updateSearch() {
        this.$emit('search', this.searchText, this.searchOptions);
      },

      expandRooms() {
        this.$store.state.eventBus.emit('expandRooms');
      },

      throwEventNext(data) {
        this.$emit('change-page', data);
      }
    },
  }
</script>
