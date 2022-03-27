<style lang="stylus">
</style>

<template>
  <div class="standalone-form fullwidth">
    <router-link to="/tasks/my" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>
    </router-link>

    <div class="title">
      <div class="primary">Создать задание</div>
    </div>
    <div class="form">
      <form novalidate>
        <div class="form-group">
          <label>НАЗВАНИЕ<span class="error-text"></span></label>
          <input type="text" class="form-control" v-model="task.name">
        </div>
        <div class="form-group">
          <label>ОПИСАНИЕ<span class="error-text"></span></label>
          <textarea class="form-control" v-model="task.description"></textarea>
        </div>
        <div class="form-group">
          <label>ОПИСАНИЕ ВХОДНЫХ ДАННЫХ<span class="error-text"></span></label>
          <textarea class="form-control" v-model="task.stdinDescription"></textarea>
        </div>
        <div class="form-group">
          <label>ОПИСАНИЕ ВЫХОДНЫХ ДАННЫХ<span class="error-text"></span></label>
            <textarea class="form-control" v-model="task.stdoutDescription"></textarea>
        </div>
        <div class="form-group">
          <label>ПОДСКАЗКИ<span class="error-text"></span></label>
          <textarea class="form-control" v-model="task.hints"></textarea>
        </div>
        <div class="form-group">
          <label>ТЕСТЫ<span class="error-text"></span></label>
          <AddableList v-model="task.tests" ref="list"></AddableList>
          <div class="btn thin" @click="addTestToList">Добавить тест</div>
        </div>
        <div class="form-group">
          <div class="btn" @click="createTask(task.toNetwork())">Создать</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import Task from "../models/task.js";
  import AddableList from "./AddableList/AddableList.vue";

  export default {
    components: {AddableList},

    data() {
      return {
        task: new Task(),
      }
    },

    methods: {
      async createTask(taskInfo) {
        const result = await this.$store.state.api.createTask(taskInfo);

        if (!result.ok_) {
          alert("Не получилось создать задание");
          return {};
        }
        this.$router.push('/tasks/my');
      },

      addTestToList() {
        this.$refs.list.addItem();
      },
    }
  }
</script>
