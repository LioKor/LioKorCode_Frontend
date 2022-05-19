<style lang="stylus">
  @require '../styles/constants.styl'

  avatar-size = 100px
  svg-size = 30px
  .profile
    .avatar
      position relative
      width avatar-size
      margin 0 auto
      margin-bottom 5px
      display flex
      align-items center
      justify-content center
      flex-direction row-reverse
      .cover
        position absolute
        top 0
        width avatar-size
        height avatar-size
        line-height avatar-size
        border-radius 50%
        margin 0 auto
        background mix(black, transparent, 70%)
        opacity 0
        cursor pointer
        transition all 0.2s ease
        color textColor1
      .cover:hover
        opacity 0.9
      .cover::before
        content ""
        position absolute
        inset 0
        left (- svg-size - 10px)
        border-radius (avatar-size / 2)
        z-index -1
      img
        border-radius 50%
        width avatar-size
        height avatar-size
        border 1px solid color4
        position relative
      svg
        min-width svg-size
        min-height svg-size
        margin 0 10px
        z-index 10
      .save-group
      svg.delete
        opacity 0
        transition all 0.4s ease
        cursor pointer
      .save-group
        pointer-events none
      svg.save
        fill colorSuccess
      svg.delete
        fill colorError
      svg.cancel
        min-width unset
        min-height unset
        width (svg-size - 6px)
        height (svg-size - 6px)
        fill mix(colorError, white, 80%)

      .save-group.visible
      .cover:hover ~ svg.delete
      svg.delete:hover
          opacity 1
          pointer-events all
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
                  <div class="save-group" :class="{visible: avatarDataUrl !== undefined}">
                    <svg class="svg-button save" @click="saveAvatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M42 13.85V39Q42 40.2 41.1 41.1Q40.2 42 39 42H9Q7.8 42 6.9 41.1Q6 40.2 6 39V9Q6 7.8 6.9 6.9Q7.8 6 9 6H34.15ZM39 15.2 32.8 9H9Q9 9 9 9Q9 9 9 9V39Q9 39 9 39Q9 39 9 39H39Q39 39 39 39Q39 39 39 39ZM24 35.75Q26.15 35.75 27.675 34.225Q29.2 32.7 29.2 30.55Q29.2 28.4 27.675 26.875Q26.15 25.35 24 25.35Q21.85 25.35 20.325 26.875Q18.8 28.4 18.8 30.55Q18.8 32.7 20.325 34.225Q21.85 35.75 24 35.75ZM11.65 18.8H29.55V11.65H11.65ZM9 15.2V39Q9 39 9 39Q9 39 9 39Q9 39 9 39Q9 39 9 39V9Q9 9 9 9Q9 9 9 9Z"/></svg>
                    <svg class="svg-button cancel" @click="cancelAvatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M12.45 37.65 10.35 35.55 21.9 24 10.35 12.45 12.45 10.35 24 21.9 35.55 10.35 37.65 12.45 26.1 24 37.65 35.55 35.55 37.65 24 26.1Z"/></svg>
                  </div>
                  <img :src="avatarDataUrl || $store.state.user.avatarUrl" alt="">
                  <div class="cover" @click="loadAvatar">
                      Изменить
                  </div>
                  <svg class="svg-button delete" @click="deleteAvatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M19.75 33.35 24 29.1 28.25 33.35 30.35 31.25 26.1 27 30.35 22.75 28.25 20.65 24 24.9 19.75 20.65 17.65 22.75 21.9 27 17.65 31.25ZM15 39H33Q33 39 33 39Q33 39 33 39V15H15V39Q15 39 15 39Q15 39 15 39ZM10.5 11V8H17.2L19.2 6H28.8L30.8 8H37.5V11ZM15 42Q13.8 42 12.9 41.1Q12 40.2 12 39V12H36V39Q36 40.2 35.1 41.1Q34.2 42 33 42ZM15 39H33Q33 39 33 39Q33 39 33 39H15Q15 39 15 39Q15 39 15 39Z"/></svg>
              </div>
              <div class="primary">{{ username }}</div>
          </div>
          <div class="form">
              <form novalidate>
                  <input name="avatarDataURL" type="hidden">

                  <div class="form-group">
                    <label>ЛОГИН<span class="error-text"></span></label>
                    <input name="username" type="text" class="form-control" :value="username" autocomplete="off" readonly>
                  </div>

                  <div class="form-group" :class="{ error: errorsInfo.fullname }" @input="errorsInfo.fullname = ''" @keydown.enter.prevent="updateUserInfo">
                      <label>ПОЛНОЕ ИМЯ<span class="error-text">{{ errorsInfo.fullname }}</span></label>
                      <input name="fullname" type="text" class="form-control" v-model="fullname" autocomplete="off">
                  </div>

                  <div class="form-group" :class="{ error: errorsInfo.email }" @input="errorsInfo.email = ''" @keydown.enter.prevent="updateUserInfo">
                      <label>EMAIL<span class="error-text">{{ errorsInfo.email }}</span></label>
                      <input name="reserveEmail" type="email" class="form-control" v-model="email" autocomplete="off">
                      <!-- <div class="muted">Необходимо будет подтвердить на старом и новом ящиках</div> -->
                  </div>

                  <div class="form-group">
                    <div class="btn" :class="{ 'btn-disabled': !enabledInfo}" @click="updateUserInfo">Сохранить</div>
                  </div>

                  <div class="roll-closed" ref="changePasswordFields" @keydown.enter.prevent="changePassword">
                    <div class="form-group" :class="{ error: errorsPassword.oldPassword }" @input="errorsPassword.oldPassword = ''">
                      <label>СТАРЫЙ ПАРОЛЬ<span class="error-text">{{ errorsPassword.oldPassword }}</span></label>
                      <input name="oldPassword" type="password" class="form-control" v-model="oldPassword" autocomplete="off">
                      <div class="muted">Если вы не задавали пароль - оставьте поле пустым</div>
                    </div>
                    <div class="form-group" :class="{ error: errorsPassword.newPassword }" @input="errorsPassword.newPassword = ''; errorsPassword.confirmPassword = ''">
                      <label>НОВЫЙ ПАРОЛЬ<span class="error-text">{{ errorsPassword.newPassword }}</span></label>
                      <input name="newPassword" type="password" class="form-control" v-model="newPassword" autocomplete="off">
                    </div>
                    <div class="form-group" :class="{ error: errorsPassword.confirmPassword }" @input="errorsPassword.newPassword = ''; errorsPassword.confirmPassword = ''">
                      <label>ПОДТВЕРЖДЕНИЕ<span class="error-text">{{ errorsPassword.confirmPassword }}</span></label>
                      <input name="newPassword" type="password" class="form-control" v-model="confirmPassword" autocomplete="off">
                    </div>
                  </div>

                  <div class="form-group">
                      <div class="btn" :class="{ 'btn-disabled': !enabledPassword}" @click="changePassword">Сменить пароль</div>
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
  import getImageAsDataURL from "@korolion/get-image-as-dataurl";

  export default {
    components: { Logo },

    data() {
      return {
        username: this.$store.state.user.username,
        email: this.$store.state.user.email,
        avatarDataUrl: undefined,
        fullname: this.$store.state.user.fullname,

        oldPassword: '',
        newPassword: '',
        confirmPassword: '',

        errorsInfo: {},
        enabledInfo: true,

        errorsPassword: {},
        enabledPassword: true,
      }
    },

    methods: {
      async __updateUserInfoAction() {
        const response = await this.$store.state.api.updateUser({
          email: this.email,
          fullname: this.fullname,
        });

        if (response.ok_) {
          this.$store.state.popups.success("Данные успешно изменены");
          return;
        }

        const status = response.status_;
        if (status === 400) {
          this.errorsInfo.fullname = 'Некорректное полное имя!';
          this.errorsInfo.email = 'Или некорректный email... Мы точно не знаем)';
        } else {
          this.$store.state.popups.error('Не удалось изменить данные', 'Произошла непредвиденная ошибка!');
        }
      },

      async updateUserData() {
        // todo: update data without getting user
        await this.$store.dispatch('GET_USER');
      },

      async updateUserInfo() {
        if (!this.enabledInfo) {
          return;
        }
        this.enabledInfo = false;

        this.errorsInfo = {};
        await this.__updateUserInfoAction();

        this.enabledInfo = true;
      },

      async saveAvatar() {
        if (this.avatarDataUrl === undefined)
          return;

        const response = await this.$store.state.api.updateAvatar(this.avatarDataUrl);
        if (response.ok_) {
          await this.updateUserData();
          this.avatarDataUrl = undefined;
          return;
        }
        this.$store.state.popups.error("Не удалось обновить аватар");
      },
      cancelAvatar() {
        this.avatarDataUrl = undefined;
      },
      async deleteAvatar() {
        const response = await this.$store.state.api.deleteAvatar();
        if (response.ok_) {
          this.avatarDataUrl = undefined;
          await this.updateUserData();
          return;
        }
        this.$store.state.popups.error("Не удалось удалить аватар");
      },

      async signOut() {
        const response = await this.$store.state.api.signOut();
        if (!response.ok_) {
          this.$store.state.popups.error("Не удалось выйти из аккаунта", 'Произошла непредвиденная ошибка');
          return;
        }

        await this.$store.dispatch('DELETE_USER');
        await this.$router.push('/signin');
        this.$store.state.popups.success('Вы успешно вышли из аккаунта');
      },


      async __changePasswordAction() {
        if (this.newPassword.length === 0) {
          this.errorsPassword.newPassword = 'Пароль не может быть пустым';
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          const error = 'Пароли не совпадают';
          this.errorsPassword.newPassword = error;
          this.errorsPassword.confirmPassword = error;
          return;
        }

        const response = await this.$store.state.api.updatePassword(this.oldPassword, this.newPassword);
        if (response.ok_) {
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.$store.state.popups.success("Пароль успешно изменен");
          closeRoll(this.$refs.changePasswordFields);
          return;
        }

        const status = response.status_
        if (status === 400) {
          this.errorsPassword.oldPassword = 'Неверный старый пароль';
        } else {
          this.$store.state.popups.error('Не удалось изменить пароль', 'Произошла непредвиденная ошибка');
        }
      },


      async changePassword() {
        if (isClosedRoll(this.$refs.changePasswordFields)) {
          openRoll(this.$refs.changePasswordFields);
          return;
        }

        if (!this.enabledPassword) {
          return;
        }
        this.enabledPassword = false;

        this.errorsPassword = {};
        await this.__changePasswordAction();

        this.enabledPassword = true;
      },

      async loadAvatar() {
        this.avatarDataUrl = await getImageAsDataURL();
      }
    },
  }
</script>
