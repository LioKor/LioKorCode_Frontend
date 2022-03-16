<style lang="stylus">
  @require './../styles/forms.styl'
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
              <input name="username" type="text" class="form-control" id="usernameInput" required autocomplete="on">
            </div>
            <div class="form-group" id="passwordGroup">
              <label>ПАРОЛЬ<span class="error-text" id="passwordErrorText"></span></label>
              <input name="password" type="password" class="form-control" required autocomplete="on">
              <!-- <div class="muted"><linkButton href="#">Забыли пароль?</linkButton> -->
            </div>
            <div class="form-group">
              <input type="submit" class="btn" @click="signIn" value="Войти">
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

    methods: {
      signIn: function() {
        this.$router.push('/');
      }
    }
  }
</script>
