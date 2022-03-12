<template>
  <div id="taskBlock" class="task-and-editor">
    <TaskInfo ref="taskInfo" />

    <SlideLine el1="taskInfo" el2="editorBlock" mode="width" class="vertical"/>

    <Editor ref="editor" />
  </div>
</template>

<script>
import TaskInfo from "./TaskInfo.vue";
import Editor from './Editor.vue'
import SlideLine from '../SlideLine.vue'

export default {
  components: { TaskInfo, Editor, SlideLine },
}
</script>
