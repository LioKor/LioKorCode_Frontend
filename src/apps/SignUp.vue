<style lang="stylus">
</style>

<template>
<!--  <Logo />-->

  <div class="signup">
    <div class="content">
      <div class="standalone-form">
        <div class="title">
          <div class="primary">Регистрация</div>
        </div>
        <div class="form">
          <form id="signupForm" novalidate>
            <div class="form-group" id="usernameGroup">
              <label>ЛОГИН*<span class="error-text" id="usernameErrorText"></span></label>
              <input v-model="username" type="text" class="form-control" required autocomplete="on">
              <div class="muted">Минимум 3 символа, только буквы, цифры и _</div>
            </div>
            <div class="form-group" id="passwordGroup">
              <label>ПАРОЛЬ*<span class="error-text" id="passwordErrorText"></span></label>
              <input v-model="password" type="password" class="form-control" required autocomplete="off">
              <div class="muted">В пароле должно быть много всяких символов, но его надо не забыть</div>
            </div>
            <div class="form-group" id="passwordConfirmGroup">
              <label>ПОДТВЕРЖДЕНИЕ ПАРОЛЯ*<span class="error-text" id="passwordConfirmErrorText"></span></label>
              <input v-model="passwordConfirm" type="password" class="form-control" required autocomplete="off">
            </div>
            <div class="form-group" id="fullnameGroup">
              <label>ПОЛНОЕ ИМЯ<span class="error-text" id="fullnameErrorText"></span></label>
              <input v-model="fullname" type="text" class="form-control" placeholder="Иван Иванов" autocomplete="on">
            </div>
            <div class="form-group" id="reserveEmailGroup">
              <label>ЗАПАСНОЙ EMAIL<span class="error-text" id="reserveEmailErrorText"></span></label>
              <input v-model="email" type="email" class="form-control" placeholder="wolf@liokor.ru" autocomplete="on">
              <div class="muted">Используется для восстановления пароля, если не указан - восстановить пароль крайне сложно</div>
              <div class="form-group">
                <div @click="signUp" class="btn">Создать</div>
                <div class="muted">Уже с нами? <router-link to="/signin" class="router-link">Войти</router-link></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Logo from './Logo.vue'

  export default {
    components: { Logo },

    data() {
      return {
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
        fullname: "",
      }
    },

    methods: {
      async signUp() {
        //todo: username and email validations

        if (this.password !== this.passwordConfirm) {
          alert("Пароли не совпадают");
          return;
        }

        const response = await this.$store.state.api.signUp(this.username, this.email, this.password, this.fullname);
        if (!response.ok_) {
          alert("Не удалось создать пользователя");
          return;
        }
        await this.$store.dispatch('GET_USER');
        this.$router.push('/profile');
      }
    }
  }
</script>
