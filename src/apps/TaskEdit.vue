<style lang="stylus">
  @require '../styles/constants.styl'

  cross-size = 20px
  cross-lines-width = 14%
  cross-color = color5
  .cross {
    width cross-size
    height cross-size
    transform: rotate(45deg);
    position: relative;
    display: inline-block;
    transition all 0.3s ease
    border-radius 50%
  }
  .cross:hover
    transform: rotate(135deg) scale(1.1);
  .cross:hover:before,
  .cross:hover:after
    background cross-color

  .cross:before, .cross:after {
    content: "";
    position: absolute;
    z-index: -1;
    background: cross-color;
  }
  .cross:before {
    top: 0;
    left: 50%;
    width: cross-lines-width;
    margin-left (- cross-lines-width / 2)
    height: 100%;
  }
  .cross:after {
    top: 50%;
    left: 0;
    height: cross-lines-width;
    margin-top (- cross-lines-width / 2)
    width: 100%;
  }

  .addable-list
    padding 0
    list-style none
    > li
      margin-top 10px
      margin-bottom 10px
      display flex
      justify-content space-between
      align-items center

      :last-child
        margin-bottom 0
      :first-child
        margin-top 0

      > input
        flex 1
        width 100%
        padding 10px
        box-sizing border-box
        float left
      > .radio
        margin-left 20px
        margin-right 5px
      > .button
        opacity 1
        transition all 0.3s ease
        overflow hidden
        height 40px
        box-sizing border-box
        float right
        display flex
        align-content center
        justify-content center
        .arrow.right
          margin-left 5px
      > div:last-child
        width 20%
        margin-left 20px
      > div:not(:last-child)
        margin-right 20px
      > div.closed
        opacity 0
        width 0
        padding-left 0
        padding-right 0
        margin-left 0
        margin-right 0
        pointer-events none
      > .orderid
        display flex
        align-items center
        margin-right 5px
        color textColor1
        font-size 20px
      > .move-buttons
        > .button
          padding 0 15px
    > li:first-child
      > .move-buttons
        > .button:first-child
          opacity 0.2
          pointer-events none
    > li:last-child
      > .move-buttons
        > .button:last-child
          opacity 0.2
          pointer-events none

  .btn.delete
    display flex
    align-content center
    justify-content center
    background color3
    padding 8px
  .btn.delete:hover
    background color4
  .btn.thin
    padding-top 2px
    padding-bottom 2px

</style>

<template>
  <div class="standalone-form fullwidth">
    <router-link to="/tasks/my" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>
    </router-link>

    <div class="title">
      <div class="primary">Изменить задание</div>
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
          <label>ПОЯСНЕНИЯ<span class="error-text"></span></label>
          <textarea class="form-control" v-model="task.hints"></textarea>
        </div>
        <div class="form-group">
          <label>ТЕСТЫ<span class="error-text"></span></label>
          <ul id="tasks-list" class="addable-list roll-closed" ref="testsList">
            <li v-for="(test, idx) in task.tests">
              <span class="orderid">{{ idx+1 }}</span>
              <div class="btn delete" @click="deleteTest(idx)"><span class="cross"></span></div>
              <input type="text" placeholder="Входные данные" class="form-control" v-model="test[0]">
              <input type="text" placeholder="Выходные данные" class="form-control" v-model="test[1]">
            </li>
            <div class="btn thin" @click="addTest">Добавить тест</div>
          </ul>
        </div>
        <div class="form-group">
          <div class="btn" @click="updateTaskInfo($route.params.taskId, task.toNetwork())">Сохранить</div>
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
  import {openRoll} from "../utils/show-hide";

  export default {
    data() {
      return {
        task: new Task(),
        tests: "",
      }
    },

    async mounted() {
      this.task.set(await this.getTask(this.$route.params.taskId));
      this.tests = JSON.stringify(this.task.tests);
      openRoll(this.$refs.testsList);
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

      async deleteTask(id) {
        if (!confirm("Точно удаляем задание?"))
          return;

        const result = await this.$store.state.api.deleteTask(id);
        if (!result.ok_) {
          alert("Не получилось удалить задание");
          return;
        }
        this.$router.push('/tasks/my');
      },

      addTest() {
        // Обычно это делалось через template, но хз, как во Vue это надо.
      },

      deleteTest() {
        // Будет getElementById
      }
    }
  }
</script>
