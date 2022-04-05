<style lang="stylus">
  @require '../styles/constants.styl'
  @require '../styles/forms.styl'

  close-btn-size = 25px

  .modal-background
    position fixed

    top 0
    width 100%
    height 100vh
    z-index 999

    background-color colorShadow

    .confirm-button
      width 45%
      display inline-block
      margin-left 2.5%
      margin-right 2.5%

    .close-btn
      position absolute
      color textColor2
      text-shadow textLightingNormal2
      right 20px
      top 10px
      width close-btn-size
      height close-btn-size
      transition all 0.3s ease
      cursor pointer
    .close-btn:hover
      color textColor1
      text-shadow textLightingNormal1

</style>
<template>
  <div v-show="isShowed" class="modal-background">
    <span class="close-btn modal-close" @click="__close(null)">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/></svg>
    </span>

    <form class="standalone-form" novalidate @submit.prevent="__submit()">
      <span class="close-btn" @click="__close(null)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/></svg>
      </span>

      <div class="title">
        <div class="primary">{{ title }}</div>
        <div class="secondary">{{ description }}</div>
      </div>

      <div class="form">
        <div v-if="type === 'prompt'" class="form-group">
          <input type="text" v-model="text" class="form-control">
        </div>

        <div class="form-group">
          <input class="btn submit" v-if="type !== 'confirm'" type="submit" value="Ок">
          <div v-else class="confirm-buttons">
            <button @click="__submit(true)" class="confirm-button btn submit" ref="buttonYes">Да</button>
            <button @click="__submit(false)" class="confirm-button btn btn-danger">Нет</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: "",
        title: "",
        description: "",
        isShowed: false,
        text: "",
      };
    },

    methods: {
      async __createModal(title, description = '', type='alert') {
        this.isShowed = true;
        this.type = type;
        this.title = title;
        this.description = description;

        const promise = new Promise((resolve) => {
          this.resolvePromise = resolve;
        });

        if (this.isShowed)
          return this.promise;

        this.promise = promise;
        return promise;
      },
      __close(result) {
        if (!this.isShowed)
          return;

        this.resolvePromise(result);
        this.isShowed = false;
        this.text = "";
      },
      __submit(result) {
        if (!this.isShowed)
          return;

        if (this.type === 'prompt') {
          this.resolvePromise(this.text);
        } else {
          this.resolvePromise(result);
        }
        this.isShowed = false;
        this.text = "";
      },

      prompt(title, description, defaultText) {
        this.text = defaultText;
        return this.__createModal(title, description, 'prompt');
      },
      confirm(title, description) {
        return this.__createModal(title, description, 'confirm');
      },
      alert(title, description) {
        return this.__createModal(title, description, 'alert');
      },
    }
  }
</script>
