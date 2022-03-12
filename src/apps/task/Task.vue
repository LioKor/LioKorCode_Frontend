<template>
  <div class="task-and-editor">
    <TaskInfo ref="taskInfo" />

    <div id="slideLine" class="slide-line"><div class="dots">⋮</div></div>

    <Editor ref="editor" />
  </div>
</template>

<script>
import TaskInfo from "./TaskInfo.vue";
import Editor from './Editor.vue'

import { slidingInit } from '../../utils/slideModule';

export default {
  components: { TaskInfo, Editor },

  mounted() {
    // todo: refactor to Vue
    const slideLine = document.getElementById('slideLine')
    slidingInit(this.$refs.taskInfo.$el, this.$refs.editor.$el, slideLine)
  }
}
</script>