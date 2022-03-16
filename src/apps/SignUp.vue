<style lang="stylus">
  @require './../styles/forms.styl'
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
              <input name="username" type="text" class="form-control" required>
              <div class="muted">Минимум 3 символа, только буквы, цифры и _</div>
              <div class="muted">Будет использоваться как часть адреса: login@liokor.ru</div>
            </div>
            <div class="form-group" id="passwordGroup">
              <label>ПАРОЛЬ*<span class="error-text" id="passwordErrorText"></span></label>
              <input name="password" type="password" class="form-control" required>
              <div class="muted">{{ passwordRequirements }}</div>
            </div>
            <div class="form-group" id="passwordConfirmGroup">
              <label>ПОДТВЕРЖДЕНИЕ ПАРОЛЯ*<span class="error-text" id="passwordConfirmErrorText"></span></label>
              <input name="passwordConfirm" type="password" class="form-control" required>
            </div>
            <div class="form-group" id="fullnameGroup">
              <label>ПОЛНОЕ ИМЯ<span class="error-text" id="fullnameErrorText"></span></label>
              <input name="fullname" type="text" class="form-control" placeholder="Иван Иванов">
              <div class="muted">Будет отображаться у получателей писем</div>
            </div>
            <div class="form-group" id="reserveEmailGroup">
              <label>ЗАПАСНОЙ EMAIL<span class="error-text" id="reserveEmailErrorText"></span></label>
              <input name="reserveEmail" type="email" class="form-control" placeholder="wolf@liokor.ru">
              <div class="muted">Используется для восстановления пароля, если не указан - восстановить пароль крайне сложно</div>
              <div class="form-group">
                <input type="submit" class="btn" value="Создать">
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
    components: { Logo }
  }
</script>
