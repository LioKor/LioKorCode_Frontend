<style lang="stylus">
  size = 96px
  .profile
    .avatar
      position relative
      width size
      margin 0 auto
      margin-bottom 5px
      .cover
        position absolute
        top 0
        width size
        height size
        line-height size
        border-radius (size / 2 - 1) // to fix avatar outside of div
        margin 0 auto
        color textColor1
        background-color clBackground
        opacity 0
        cursor pointer
        transition all 0.2s ease
      .cover:hover
        opacity 0.9
      img
        border-radius size
        width size
        height size
</style>

<template>
  <Logo />
  <div class="profile">
      <div class="standalone-form profile">
          <router-link to="/" class="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>
          </router-link>

          <div class="title">
              <div class="avatar">
                  <img :src="avatarUrl" alt="">
                  <div class="cover">
                      Изменить
                  </div>
              </div>
              <div class="primary">{{ username }}</div>
          </div>
          <div class="form">
              <form novalidate>
                  <input name="avatarDataURL" type="hidden">

                  <div class="form-group">
                    <label>ЛОГИН<span class="error-text"></span></label>
                    <input name="username" type="text" class="form-control" :value="username" autocomplete="off">
                  </div>
                  <div class="form-group">
                      <label>ПОЛНОЕ ИМЯ<span class="error-text"></span></label>
                      <input name="fullname" type="text" class="form-control" :value="fullname" autocomplete="off">
                  </div>
                  <div class="form-group">
                      <label>ЗАПАСНОЙ E-MAIL<span class="error-text"></span></label>
                      <input name="reserveEmail" type="email" class="form-control" :value="email" autocomplete="off">
                      <!-- <div class="muted">Необходимо будет подтвердить на старом и новом ящиках</div> -->
                  </div>
                  <div class="form-group">
                    <div class="btn" @click="updateUserInfo">Сохранить</div>
                  </div>
                  <div class="roll-closed" ref="changePasswordFields">
                    <div class="form-group">
                      <label>СТАРЫЙ ПАРОЛЬ<span class="error-text"></span></label>
                      <input name="oldPassword" type="password" class="form-control" :value="oldPassword" autocomplete="off">
                    </div>
                    <div class="form-group">
                      <label>НОВЫЙ ПАРОЛЬ<span class="error-text"></span></label>
                      <input name="newPassword" type="password" class="form-control" :value="newPassword" autocomplete="off">
                    </div>
                  </div>
                  <div class="form-group">
                      <div class="btn" @click="changePassword">Сменить пароль</div>
                  </div>
                  <div class="form-group">
                      <div @click="signOut" class="btn btn-danger">Выйти</div>
                  </div>
              </form>
          </div>
      </div>
  </div>
</template>


<script>
  import Logo from './Logo.vue'
  import {closeRoll, isClosedRoll, openRoll} from "../utils/show-hide";

  export default {
    components: { Logo },

    data() {
      return {
        username: this.$store.state.user.username,
        email: this.$store.state.user.email,
        avatarUrl: this.$store.state.user.avatarUrl,
        fullname: this.$store.state.user.fullname,
        oldPassword: "",
        newPassword: "",
      }
    },

    methods: {
      async updateUserInfo() {
        const response = await this.$store.state.api.updateUser({
          username: this.username,
          email: this.email,
          avatarUrl: this.avatarUrl,
          fullname: this.fullname,
        });
        if (!response.ok_) {
          alert("Не удалось изменить данные");
          return;
        }
        alert("Данные изменены");
        this.$router.push('/signin');
      },
      async signOut() {
        const response = await this.$store.state.api.signOut();
        if (!response.ok_) {
          alert("Не удалось выйти из аккаунта. Пiпався, розбiйник? А всё...");
          return;
        }
        await this.$store.dispatch('DELETE_USER');
        this.$router.push('/signin');
      },
      async changePassword() {
        if (isClosedRoll(this.$refs.changePasswordFields)) {
          openRoll(this.$refs.changePasswordFields);
          return;
        }
        const response = await this.$store.state.api.updatePassword(this.oldPassword, this.newPassword);
        if (!response.ok_) {
          alert("Не удалось сменить пароль");
          return;
        }
        alert("Пароль изменен");
        closeRoll(this.$refs.changePasswordFields);
      }
    },
  }
</script>
