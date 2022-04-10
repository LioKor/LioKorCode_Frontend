<style lang="stylus">
</style>

<template>
  <div class="header">
    <div class="topLine" style="z-index: 10">
      <router-link to="/tasks/my">Мои задания</router-link>
<!--      <router-link to="#">Туда</router-link>-->
<!--      <router-link to="#">Сюда</router-link>-->

      <router-link v-if="$store.state.user.isLogined" to="/profile" class="right">{{$store.state.user.username}}</router-link>
      <router-link v-else to="/signin" class="right">Войти</router-link>
    </div>
    <div class="sidePart" style="z-index: 5">
      <div>Work in progress...</div>
      <div>Курс: 0 / 0</div>
      <div>Выполнено: 0 / 0</div>
      <div>Оценка: 0</div>
      <span class="top-decoration">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </span>
      <span class="bottom-decoration">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </span>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>
