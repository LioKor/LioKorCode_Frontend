<style lang="stylus">
</style>

<template>
  <div class="header">
    <div class="topLine">
      <router-link to="/tasks/my">Мои задания</router-link>
      <router-link to="#">Туда</router-link>
      <router-link to="#">Сюда</router-link>

      <router-link to="/profile" class="right">Профиль</router-link>
    </div>
    <div class="sidePart">
      <div>Выполнено: 1/5</div>
      <div>Осталось: 10</div>
      <div>Оценка: 4</div>
      <div>Курс: 3/20</div>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>
