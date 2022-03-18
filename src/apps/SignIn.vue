<style lang="stylus">
</style>

<template>
  <Logo />

  <div class="auth">
    <div class="content">
      <div class="standalone-form">
        <div class="title">
          <div class="primary">Вход</div>
          <div class="secondary">Рады видеть вас снова!</div>
        </div>
        <div class="form">
          <form id="authForm" novalidate>
            <div class="form-group" id="usernameGroup">
              <label>ЛОГИН ИЛИ EMAIL<span class="error-text" id="usernameErrorText"></span></label>
              <input v-model="username" type="text" class="form-control" id="usernameInput" required autocomplete="on">
            </div>
            <div class="form-group" id="passwordGroup">
              <label>ПАРОЛЬ<span class="error-text" id="passwordErrorText"></span></label>
              <input v-model="password" type="password" class="form-control" required autocomplete="on">
              <!-- <div class="muted"><linkButton href="#">Забыли пароль?</linkButton> -->
            </div>
            <div class="form-group">
              <div class="btn" @click="signIn">Войти</div>
              <div class="muted">Нужен аккаунт? <router-link to="/signup" class="router-link">Создать</router-link></div>
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
        password: "",
      }
    },

    methods: {
      async signIn() {
        const response = await this.$store.state.api.signIn(this.username, this.password);
        if (!response.ok_) {
          alert("Логин или пароль не подходят");
          return;
        }

        this.$router.push('/profile');
      }
    }
  }
</script>
