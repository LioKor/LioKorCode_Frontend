<style lang="stylus">
  .btn-contoured
    padding-top 7px
    padding-bottom 7px
    margin-left 15px
    margin-right 10px
    svg
      margin-top 2px
      height 18px
      opacity 0.7
      transition all 0.2s
  .btn-contoured:hover
    svg
      opacity 1
      transform scale(1.1)

  .addable-list
    margin-bottom 0
</style>

<template>
  <div class="standalone-form fullwidth">
    <router-link to="/" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>
    </router-link>

    <div class="title">
      <div class="primary">Изменить задание</div>
    </div>
    <div class="form">
      <form novalidate>
        <div class="form-bg">
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div class="form-group">
          <label>НАЗВАНИЕ<span class="error-text"></span></label>
          <input type="text" class="form-control" v-model="task.name">
        </div>
        <div class="form-group">
          <label>ОПИСАНИЕ<span class="error-text"></span></label>
          <textarea class="form-control scrollable" v-model="task.description"></textarea>
        </div>
        <div class="form-group">
          <label>ОПИСАНИЕ ВХОДНЫХ ДАННЫХ<span class="error-text"></span></label>
          <textarea class="form-control scrollable" v-model="task.stdinDescription"></textarea>
        </div>
        <div class="form-group">
          <label>ОПИСАНИЕ ВЫХОДНЫХ ДАННЫХ<span class="error-text"></span></label>
            <textarea class="form-control scrollable" v-model="task.stdoutDescription"></textarea>
        </div>
        <div class="form-group">
          <label>ОСОБЫЕ УКАЗАНИЯ<span class="error-text"></span></label>
          <textarea class="form-control scrollable" v-model="task.hints"></textarea>
        </div>
        <div class="form-group">
          <label>ТЕСТЫ<span class="error-text"></span></label>
          <AddableList v-model="task.tests" ref="list"></AddableList>
          <div class="btn btn-contoured" @click="addTestToList">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="10 10 28 28"><path d="M22.5 38V25.5H10V22.5H22.5V10H25.5V22.5H38V25.5H25.5V38Z"/></svg>
          </div>
        </div>
        <div class="form-group">
          <div class="btn" @click="updateTaskInfo($route.params.taskId, task.toNetwork())">Сохранить</div>
        </div>
        <div class="form-group">
          <router-link :to="'/task/' + task.id" class="btn" >Перейти к решению</router-link>
        </div>
        <div class="form-group">
          <div class="btn btn-danger" @click="deleteTask($route.params.taskId)">Удалить задание</div>
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

    async mounted() {
      this.task.set(await this.getTask(this.$route.params.taskId));
      this.tests = JSON.stringify(this.task.tests);
    },

    methods: {
      async getTask(id) {
        const taskInfo = await this.$store.state.api.getTask(id);

        if (!taskInfo.ok_) {
          this.$store.state.popups.error("Не получилось получить задание")
          return {};
        }
        return taskInfo;
      },

      async updateTaskInfo(id, taskInfo) {
        const result = await this.$store.state.api.updateTask(id, taskInfo);

        if (!result.ok_) {
          this.$store.state.popups.error("Не получилось обновить задание");
          return {};
        }
        this.$store.state.popups.success("Обновлено");
        return result;
      },

      async deleteTask(id) {
        if (! await this.$store.state.modal.confirm("Точно удаляем задание?"))
          return;

        const result = await this.$store.state.api.deleteTask(id);
        if (!result.ok_) {
          this.$store.state.popups.error("Не получилось удалить задание");
          return;
        }
        this.$router.push('/');
      },

      addTestToList() {
        this.$refs.list.addItem();
      },
    }
  }
</script>
