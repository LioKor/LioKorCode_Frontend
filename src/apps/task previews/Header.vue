<style lang="stylus">
</style>

<template>
  <div class="header">
    <div class="topLine">
      <router-link to="/tasks/my">Мои задания</router-link>
<!--      <router-link to="#">Туда</router-link>-->
<!--      <router-link to="#">Сюда</router-link>-->

      <router-link v-if="$store.state.user.isLogined" to="/profile" class="right">{{$store.state.user.username}}</router-link>
      <router-link v-else to="/signin" class="right">Войти</router-link>
    </div>
    <div class="sidePart">
      <div>Work in progress...</div>
      <div>Курс: 0 / 0</div>
      <div>Выполнено: 0 / 0</div>
      <div>Оценка: 0</div>
    </div>
  </div>
</template>

<script>1
  export default {

  }
</script>
