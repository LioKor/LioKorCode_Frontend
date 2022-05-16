<style lang="stylus">
  @require '../../styles/constants.styl'
  @require '../../styles/header.styl'

  colorHover = #9b1616
  checkbox-background = linear-gradient(60deg, gradColor2 0%, color4 50%, colorHover 50%, color5 100%)
  paginator-number-background = linear-gradient(60deg, transparent 50%, colorHover 50%, color5 100%)
  paginator-number-selected-background = headerBG
  paginator-button-background = linear-gradient(90deg, #a26c1e 0%, #4c2c79 50%, colorHover 50%, #a26c1e 100%)

  .paginator
    display flex
    justify-content space-between
    align-items center
    max-width 300px
    position relative
    div
      cursor default
      padding 0 10px
      height 20px
      line-height 20px
      position relative
      color textColor4
      text-align center
    div::before
      z-index -1
      content ""
      position absolute
      inset 0
      //background decColor2desaturated
      transform skewX(degree)
      box-shadow shadow2 inset

    div.button
      cursor pointer
      height 28px
      display flex
      align-items center
      svg
        transition all 0.4s ease
        width 16px
        fill textColor3
    div.button:hover
      svg
        fill textColor1
    div.button::before
      background paginator-button-background
      background-size 300% 100%
      background-position-x 0
      box-shadow shadow2
      transition all 0.2s ease
    div.button:hover::before
      box-shadow shadow1
      background-position-x -50%
    div.button:first-of-type::before
      border-right 1px solid color2
    div.button:last-of-type::before
      border-left 1px solid color2

    div.number
      cursor pointer
      height 22px
      line-height 22px
      transition all 0.4s ease
    div.number:hover
      color textColor1
    div.number::before
      border 1px solid color2
      box-shadow shadow2
      background paginator-number-background
      background-size 300% 100%
      background-position-x 0
      transition all 0.2s ease
    div.number:not(.selected):hover::before
      border 1px solid color1
      box-shadow shadow1
      background-position-x -50%
    div.number.selected
      cursor default
      color textColor3
    div.number.selected::before
      box-shadow shadow2 inset
      border 1px solid color3
  .paginator::before
    content ""
    position absolute
    inset 0
    z-index -1
    background decColor2
    transform skewX(degree)
</style>

<template>
  <div class="paginator">
    <div class="button" @click="setPage(page - 1)"><svg style="transform: rotate(180deg);" xmlns="http://www.w3.org/2000/svg" viewBox="6 6 12 12"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
    </div>
    <div class="number">{{ firstPage }}</div>
    <div>...</div>
    <div class="number selected">{{ page }}</div>
    <div>...</div>
    <div class="number">{{ pagesCount }}</div>
    <div class="button" @click="setPage(page + 1)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="6 6 12 12"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
    </div>
  </div>
</template>

<script>
  const searchParamPageName = 'page';
  const searchParamCountOnPageName = 'count';
  const defaultPage = 1;
  const defaultOnPageCount = 5;

  export default {
    props: {
      getPagesFoo: Function,
      currentPage: Number,
      elementsOnPage: Number,
    },

    data() {
      return {
        firstPage: 1,
        page: 1,
        onPageCount: undefined,
        pagesCount: 1,

        setPageAfterSettingPagesCount: undefined,
      }
    },

    mounted() {
      if (this.$props.currentPage === undefined) {
        const url = new URL(location.href);
        const page = url.searchParams.get(searchParamPageName);
        const count = url.searchParams.get(searchParamCountOnPageName);
        if (page === null)
          this.setPageAfterSettingPagesCount = defaultPage;
        else
          this.setPageAfterSettingPagesCount = Number(page);

        if (count === null)
          this.setOnPageCount(defaultOnPageCount);
        else
          this.setOnPageCount(Number(count));
      }

      if (this.$props.getPagesFoo !== undefined) {
        const pagesCount = this.$props.getPagesFoo();
        if (!pagesCount.ok_) {
          this.$store.state.popups.error('Не удалось получить количество страниц');
          return;
        }
        this.pagesCount = pagesCount.count;
      }
    },

    methods: {
      setPage(num, preventEmitting = false) {
        if (num < 1) {
          if (this.page === 1)
            return;
          num = 1;
        } else if (num > this.pagesCount) {
          if (this.page === this.pagesCount)
            return;
          num = this.pagesCount;
        }

        this.page = num;
        const url = new URL(location.href);
        url.searchParams.set(searchParamPageName, num);
        history.pushState(null, null, url.toString());
        if (!preventEmitting)
          this.$emit('change-page', {page: this.page, count: this.onPageCount});
      },
      setOnPageCount(num, preventEmitting = false) {
        if (num < 1) {
          return;
        }
        this.onPageCount = Math.floor(num);
        const url = new URL(location.href);
        url.searchParams.set(searchParamCountOnPageName, num);
        history.pushState(null, null, url.toString());
        if (!preventEmitting)
          this.$emit('change-on-page-count', {page: this.page, count: this.onPageCount});
      },
      setPagesCount(num, preventEmitting = false) {
        if (num < 1) {
          return;
        }
        this.pagesCount = Math.floor(num);
        if (this.setPageAfterSettingPagesCount !== undefined) {
          this.setPage(this.setPageAfterSettingPagesCount, preventEmitting);
          this.setPageAfterSettingPagesCount = undefined;
        }
        if (!preventEmitting)
          this.$emit('change-pages-count', this.pagesCount);

        if (this.page > this.pagesCount)
          this.setPage(this.pagesCount);
      }
    },
  }
</script>
