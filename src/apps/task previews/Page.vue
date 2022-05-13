<style lang="stylus">
  @require '../../styles/constants.styl'

  float-button-height = 50px

  .task-previews
    position relative
    height 100vh
    overflow hidden

    .previews-container
      display flex
      flex-wrap wrap
      position relative

    .header
      z-index 1000

    .content-container
      height 100vh
      overflow-x hidden

    .standalone-form
      margin-top sidePartHeight + 30px

  .float-button
    cursor pointer
    overflow hidden
    position absolute
    bottom 30px
    right 30px
    height float-button-height
    border-radius (float-button-height / 2)

    padding 10px
    display flex
    align-items center
    text-align center
    flex-direction row
    background decColor1
    box-shadow 3px 3px 10px colorShadowDark
    box-sizing border-box
    transition all 0.3s ease
    text-decoration none
    svg
      transition all 0.3s ease
      width 40px
      height 40px
      fill textColor2
    .hover-text
      color textColor1
      transition all 0.3s ease
      overflow hidden
      width 0
      pointer-events none
      opacity 0
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
  <div class="task-previews">
    <div class="content-container scrollable scrollable-bg">
      <Header @search="updateSearch" ref="header"></Header>

      <div class="previews-container" ref="previews">
        <TaskPreview v-for="task in tasks" :task="task" path-modifier=""></TaskPreview>
      </div>

      <div v-if="!tasks.length" class="standalone-form">
        <div class="title">
          <div v-if="!isSearchedMyTasks" class="primary">Заданий по такому запросу не найдено</div>
          <div v-else class="primary">Вы пока не создали ни одного задания</div>
        </div>
      </div>
    </div>

    <router-link to="/task/create" class="float-button" v-if="$store.state.user.isLogined">
      <div class="hover-text">Создать задание</div>
      <svg pointer-events="none" xmlns="http://www.w3.org/2000/svg"><path transform="scale(2.2) translate(-1,-1)" d="M10 3.25c.41 0 .75.34.75.75v5.25H16a.75.75 0 010 1.5h-5.25V16a.75.75 0 01-1.5 0v-5.25H4a.75.75 0 010-1.5h5.25V4c0-.41.34-.75.75-.75z"></path></svg>
    </router-link>
  </div>
</template>

<script>
  import TaskPreview from "./TaskPreview.vue";
  import Header from "./Header.vue";

  export default {
    components: { Header, TaskPreview },

    data() {
      return {
        allTasks: [],
        myTasks: [],
        tasks: [],
        myTasksReceived: false,
        isSearchedMyTasks: false,

        resizeMutex: false,
      }
    },

    async mounted() {
      this.allTasks = await this.getTasks('getTasks');
      this.tasks = this.allTasks.concat();

      window.addEventListener('resize', this.onResizeContainerQueriesPolyfill);
      this.$store.state.eventBus.on('resizeTaskPreviews', this.onResizeContainerQueriesPolyfill);
      this.onResizeContainerQueriesPolyfill();
    },
    unmounted() {
      window.removeEventListener('resize', this.onResizeContainerQueriesPolyfill);
      this.$store.state.eventBus.off('resizeTaskPreviews', this.onResizeContainerQueriesPolyfill);
    },

    methods: {
      async getTasks(apiRequestName, silent = false) {
        const tasks = await this.$store.state.api[apiRequestName]();
        if (!tasks.ok_) {
          if (!silent)
            this.$store.state.popups.error("Не удалось получить список заданий");
          return [];
        }

        return tasks;
      },
      async updateSearch(text, options) {
        text = text.toLowerCase();
        this.tasks = [];

        let tasksToSearch = this.allTasks;
        this.isSearchedMyTasks = false;
        if (options.my === true) {
          if (!this.myTasksReceived) {
            this.myTasks = await this.getTasks('getMyTasks', true)
            this.myTasksReceived = true
          }
          this.isSearchedMyTasks = true;
          tasksToSearch = this.myTasks;
        }
        tasksToSearch.forEach(task => {
          if (String(task.id).includes(text) || task.name.toLowerCase().includes(text))
            this.tasks.push(task);
        });
      },

      onResizeContainerQueriesPolyfill(sliderLeftPercentage) {
        if (this.resizeMutex)
          return;
        this.resizeMutex = true;

        console.log(sliderLeftPercentage)
        if (typeof sliderLeftPercentage === 'number')
          this.$refs.header.roomsOpenedState = sliderLeftPercentage < 98;

        const el = this.$refs.previews;
        const width = el.clientWidth;
        const classes = ['width-720', 'width-1080', 'width-1440', 'width-1800', 'width-more-1800'];
        function setClass(idx) {
          if (!el.classList.contains(classes[idx])) {
            classes.forEach(cls => el.classList.remove(cls));
            el.classList.add(classes[idx]);
          }
        }
        if (width < 720) {
          setClass(0);
        } else if (width < 1080) {
          setClass(1);
        } else if (width < 1440) {
          setClass(2);
        } else if (width < 1800) {
          setClass(3);
        } else {
          setClass(4);
          el.style.setProperty('--additional-width', (width - 1800) + 'px');
        }

        setTimeout(() => this.resizeMutex = false, 20);
      }
    }
  }
</script>
