<template>
  <div
    class="flex my-4 justify-between items-center border-2 border-zinc-500 rounded-md px-4 py-2"
  >
    <p :class="{ 'text-red-500': taskDone }">{{ task.description }}</p>
    <div class="">
      <BaseCrossbutton @click="deleteTask"></BaseCrossbutton>
      <BaseTickButton @click="taskIsDone"></BaseTickButton>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      taskDone: false,
    };
  },
  props: ["task"],
  emits: ["delete-task", "task-done"],
  methods: {
    deleteTask() {
      this.$emit("delete-task", this.task.id);
    },
    taskIsDone() {
      this.$emit("task-done", this.task.id);
      this.$store.dispatch("toggleTaskStatus", {
        taskId: this.task.id,
        isFinished: !this.task.isFinished,
      });
      this.taskDone = true;
    },
  },
};
</script>
