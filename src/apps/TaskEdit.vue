<template>
  <div class="standalone-form profile">
    <div class="title">
      <div class="primary">Изменить задание</div>
    </div>
    <div class="form">
      <form novalidate>
        <div class="form-group">
          <label>НАЗВАНИЕ<span class="error-text"></span></label>
          <input type="text" class="form-control" :value="task.title">
        </div>
        <div class="form-group">
          <label>ОПИСАНИЕ<span class="error-text"></span></label>
          <textarea class="form-control" :value="task.description"></textarea>
        </div>
        <div class="form-group">
          <label>ОПИСАНИЕ ВХОДНЫХ ДАННЫХ<span class="error-text"></span></label>
          <textarea class="form-control" :value="task.stdinDescription"></textarea>
        </div>
        <div class="form-group">
          <label>ОПИСАНИЕ ВЫХОДНЫХ ДАННЫХ<span class="error-text"></span></label>
            <textarea class="form-control" :value="task.stdoutDescription"></textarea>
        </div>
        <div class="form-group">
          <label>ТЕСТЫ<span class="error-text"></span></label>
          <textarea class="form-control" :value="task.tests"></textarea>
        </div>
        <div class="form-group">
          <div class="btn" @click="updateTaskInfo($route.params.taskId, task)">Сохранить</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import Task from "../models/task.js";

  export default {
    data() {
      return {
        task: new Task(),
      }
    },

    async mounted() {
      this.task.set(await this.getTask(this.$route.params.taskId));
    },

    methods: {
      async getTask(id) {
        const taskInfo = await this.$store.state.api.getTask(id);

        if (!taskInfo.ok_) {
          alert("Не получилось получить задание")
          return {};
        }
        return taskInfo;
      },

      async updateTaskInfo(id, taskInfo) {
        const result = await this.$store.state.api.updateTask(id, taskInfo);

        if (!result.ok_) {
          alert("Не получилось обновить задание");
          return {};
        }
        alert("Обновлено");
        return result;
      },
    }
  }
</script>
