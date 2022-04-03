<style lang="stylus">
  @import '../../styles/constants.styl'

  .previews-container
    display flex
    flex-wrap wrap
    position relative

  .header
    z-index 999

  float-button-height = 50px
  .float-button
    cursor pointer
    overflow hidden
    position fixed
    bottom 30px
    right 30px
    height float-button-height
    border-radius (float-button-height / 2)

    padding 10px
    display flex
    align-items center
    text-align center
    flex-direction row
    background color2
    box-shadow 3px 3px 5px colorShadow
    box-sizing border-box
    transition all 0.3s ease
    svg
      transition all 0.3s ease
      width 40px
      height 40px
      fill textColor2
    .hover-text
      transition all 0.3s ease
      overflow hidden
      width 0
      pointer-events none
      opacity 0
      text-decoration none
  .float-button:hover
    box-shadow 5px 5px 8px colorShadow
    .hover-text
      width 120px
      opacity 1
    svg
      transform scale(1.1)
      fill textColor1
</style>

<template>
  <Header></Header>

  <div class="previews-container">
    <div v-if="!tasks.length" class="standalone-form">
      <div class="title">
        <div v-if="$store.state.user.isLogined" class="primary">Вы пока не создали ни одного задания</div>
        <div v-else>
          <div class="primary">Вы не вошли в аккаунт</div>
          <router-link to="/signin" class="secondary">Войти</router-link>
        </div>
      </div>
    </div>

    <TaskPreview v-for="task in tasks" :task="task" path-modifier="/edit"></TaskPreview>
  </div>

  <router-link to="/task/create" class="float-button" v-if="$store.state.user.isLogined">
    <div class="hover-text">Добавить задание</div>
    <svg pointer-events="none" xmlns="http://www.w3.org/2000/svg"><path transform="scale(2.2) translate(-1,-1)" d="M10 3.25c.41 0 .75.34.75.75v5.25H16a.75.75 0 010 1.5h-5.25V16a.75.75 0 01-1.5 0v-5.25H4a.75.75 0 010-1.5h5.25V4c0-.41.34-.75.75-.75z"></path></svg>
  </router-link>
</template>

<script>
  import TaskPreview from "../task previews/TaskPreview.vue";
  import Header from "./Header.vue";

  export default {
    components: { Header, TaskPreview },

    data() {
      return {
        tasks: [],
      }
    },
    async mounted() {
      if (!this.$store.state.user.isLogined)
        return;
      this.tasks = await this.getMyTasks();
    },
    methods: {
      getMyTasks: async function() {
        const tasks = await this.$store.state.api.getMyTasks();
        if (!tasks.ok_) {
          this.$store.state.popups.error("Не удалось получить список заданий");
          return [];
        }

        return tasks;
      }
    }
  }
</script>
