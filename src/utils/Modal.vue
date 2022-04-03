<style lang="stylus">
  @require '../styles/constants.styl'

  close-btn-size = 25px

  .modal-background
    position fixed

    top 0
    width 100%
    height 100vh
    z-index 999

    background-color colorShadow

    .modal
      margin-top 200px

      .form
        max-width 90%
        background linear-gradient(20deg, bgColor1 0%, bgColor2 50%, bgColor1 100%)

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

      .submit-container
        width 100%
        display flex
        > *
          flex 1
          margin-left 10px
          margin-right 10px
</style>
<template>
  <div v-show="isShowed" class="modal-background">
    <span class="close-btn modal-close" @click="__close(null)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/></svg>
    </span>

    <div class="form centered-horizontal">
        <span class="close-btn modal-close" @click="__close(null)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/></svg>
        </span>

        <div class="info-container">
            <div class="text-big-x">{{ title }}</div>
            <div class="text-middle">{{ description }}</div>
        </div>

        <div v-if="type === 'prompt'" class="fields-container">
            <div>
                <input type="text" v-model="text">
            </div>
        </div>

        <div class="submit-container">
            <input @click="__submit" ref="promptInput" v-if="type !== 'confirm'" type="submit" value="Ок">
            <div v-else>
                <span @click="__submit" class="button rounded">Да</span>
                <span @click="__close(false)" class="button rounded modal-close">Нет</span>
            </div>
        </div>
    </div>
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
      __createModal(title, description = '', type='alert') {
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

        this.resolve(result);
        this.isShowed = false;
      },
      __submit() {
        if (!this.isShowed)
          return;

        if (this.type === 'prompt')
          this.resolve(this.text);
        else
          this.resolve(true);
        this.isShowed = false;
      },

      prompt(title, description) {
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
