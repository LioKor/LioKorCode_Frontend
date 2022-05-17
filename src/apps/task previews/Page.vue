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

  .loading
    position absolute
    left 50%
    top 50%
    width 25vh
    height 25vh
    transform translate(-50%, -50%)
    opacity 0
    pointer-events none
    background mix(textColor1, transparent, 10%)
    border-radius 50%
    box-shadow shadow1
    transition all 0.5s ease
    img
      width 100%
      height 100%
  .loading.visible
    pointer-events all
    opacity 1
</style>

<template>
  <div class="task-previews">
    <div class="content-container scrollable scrollable-bg">
      <Header @search="updateSearch" ref="header" @change-page="changePaginatorPage"></Header>

      <div class="previews-container" ref="previews">
        <TaskPreview v-for="task in tasks" :task="task" path-modifier=""></TaskPreview>
      </div>

      <div v-if="!tasks.length && !searchMutex" class="standalone-form">
        <div class="title">
          <div v-if="!searchOptions.my || searchText !== ''" class="primary">Заданий по такому запросу не найдено</div>
          <div v-else class="primary">Вы пока не создали ни одного задания</div>
        </div>
      </div>
    </div>

    <router-link to="/task/create" class="float-button" v-if="$store.state.user.isLogined">
      <div class="hover-text">Создать задание</div>
      <svg pointer-events="none" xmlns="http://www.w3.org/2000/svg"><path transform="scale(2.2) translate(-1,-1)" d="M10 3.25c.41 0 .75.34.75.75v5.25H16a.75.75 0 010 1.5h-5.25V16a.75.75 0 01-1.5 0v-5.25H4a.75.75 0 010-1.5h5.25V4c0-.41.34-.75.75-.75z"></path></svg>
    </router-link>

    <div class="loading" :class="{visible: searchMutex}"><img src="../../images/cat_loading.gif" alt=""/></div>
  </div>
</template>

<script>
  import TaskPreview from "./TaskPreview.vue";
  import Header from "./Header.vue";

  const taskHeight = 220;
  const headerHeight = 50;

  export default {
    components: { Header, TaskPreview },

    data() {
      return {
        tasks: [],

        searchText: '',
        currentPage: 1,
        onPageCount: undefined,
        searchOptions: {},

        resizeMutex: false,
        searchMutex: false,
        gottenRequestWhileSearchMutex: undefined,
      }
    },

    async mounted() {
      window.addEventListener('resize', this.onResizeContainerQueriesPolyfill);
      this.$store.state.eventBus.on('resizeTaskPreviews', this.onResizeContainerQueriesPolyfill);
      this.onResizeContainerQueriesPolyfill();

      await this.updateSearch();
    },
    unmounted() {
      window.removeEventListener('resize', this.onResizeContainerQueriesPolyfill);
      this.$store.state.eventBus.off('resizeTaskPreviews', this.onResizeContainerQueriesPolyfill);
    },

    methods: {
      async getTasks(apiRequestName, silent = false) {
        const tasks = await this.$store.state.api[apiRequestName](...(Array.from(arguments).slice(2,arguments.length)));
        if (!tasks.ok_) {
          if (!silent)
            this.$store.state.popups.error("Не удалось получить список заданий");
          return [];
        }

        return tasks;
      },
      async updateSearch(searchText, options) {
        if (this.searchMutex) {
          this.gottenRequestWhileSearchMutex = {searchText, options};
          return;
        }
        this.searchMutex = true;

        if (options !== undefined)
          this.searchOptions = options;
        if (searchText !== undefined)
          this.searchText = searchText;

        let text, count, mine, solved, page;
        if (this.searchText !== '')
          text = this.searchText;
        count = this.onPageCount;
        if (this.searchOptions.my) {
          mine = true;
        } else if (this.searchOptions.solved) {
          solved = true;
        } else if (this.searchOptions.unsolved) {
          solved = false;
        }
        page = this.currentPage;

        const tasks = await this.getTasks('getFullSearchTasks', false, text, count, mine, solved, page);
        this.tasks = tasks.tasks;

        let pages = tasks.num / this.onPageCount;
        if (tasks.num % this.onPageCount !== 0)
          pages += 1;
        this.$refs.header.$refs.paginator.setPagesCount(pages, true);

        this.searchMutex = false;
        if (this.gottenRequestWhileSearchMutex) {
          this.updateSearch(this.gottenRequestWhileSearchMutex.searchText, this.gottenRequestWhileSearchMutex.options);
          this.gottenRequestWhileSearchMutex = undefined;
        }
      },
      async changePaginatorPage(data) {
        this.currentPage = data.page;
        this.onPageCount = data.count;
        await this.updateSearch();
      },
      setOnPageCount(onPage) {
        this.onPageCount = onPage;
        this.$refs.header.$refs.paginator.setOnPageCount(onPage, true);
      },

      onResizeContainerQueriesPolyfill(sliderLeftPercentage) {
        if (this.resizeMutex)
          return;
        this.resizeMutex = true;

        if (typeof sliderLeftPercentage === 'number')
          this.$refs.header.isRoomsOpened = sliderLeftPercentage < 98;

        const el = this.$refs.previews;
        const width = el.clientWidth;
        const classes = ['width-720', 'width-1080', 'width-1440', 'width-1800', 'width-more-1800'];
        function setClass(idx, callback = ()=>{}) {
          if (!el.classList.contains(classes[idx])) {
            classes.forEach(cls => el.classList.remove(cls));
            el.classList.add(classes[idx]);
            callback();
          }
        }
        const stringsCount = Math.floor((window.innerHeight - headerHeight) / taskHeight);
        if (width < 720) {
          this.setOnPageCount(stringsCount);
          setClass(0, this.updateSearch);
        } else if (width < 1080) {
          this.setOnPageCount(stringsCount * 2 - 1);
          setClass(1, this.updateSearch);
        } else if (width < 1440) {
          this.setOnPageCount(stringsCount * 3 - 1);
          setClass(2, this.updateSearch);
        } else if (width < 1800) {
          this.setOnPageCount(stringsCount * 4 - 2);
          setClass(3, this.updateSearch);
        } else {
          setClass(4, this.updateSearch);
          this.setOnPageCount(stringsCount * 5 - 2);
          el.style.setProperty('--additional-width', (width - 1800) + 'px');
        }

        setTimeout(() => this.resizeMutex = false, 20);
      }
    }
  }
</script>
