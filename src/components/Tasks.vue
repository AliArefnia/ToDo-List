<template>
  <div
    class="flex my-4 justify-between items-center border-2 border-zinc-500 rounded-md px-4 py-2"
  >
    <p>{{ task.description }}</p>
    <div class="">
      <BaseBinbutton @click="deleteTask"></BaseBinbutton>
      <BaseTickButton @click="taskIsDone"></BaseTickButton>
      <p></p>
    </div>
  </div>
</template>
<script>
export default {
  props: ["task"],
  methods: {
    deleteTask() {
      this.$store.dispatch("deleteTask", this.task.id);
    },
    taskIsDone() {
      this.$store.dispatch("toggleTaskStatus", {
        taskId: this.task.id,
        isFinished: !this.task.isFinished,
      });
    },
  },
};
</script>
