<style lang="stylus">
</style>

<template>
  <div class="header">
    <div class="topLine">
      <router-link to="/">Все задания</router-link>
<!--      <router-link to="#">Туда</router-link>-->
<!--      <router-link to="#">Сюда</router-link>-->

      <router-link v-if="$store.state.user.isLogined" to="/profile" class="right">{{$store.state.user.username}}</router-link>
      <router-link v-else to="/signin" class="right">Войти</router-link>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>
