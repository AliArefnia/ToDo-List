<template>
  <div
    class="flex my-4 justify-between items-center border-2 rounded-md px-4 py-2"
  >
    <p class="min-w-1/2 max-w-4/6 lg:max-w-5/6">{{ task.description }}</p>
    <div id="taskButtons">
      <BaseBinbutton @click="deleteTask"></BaseBinbutton>
      <BaseTickButton
        @click="toggleTaskStatus"
        :taskIsDone="tasksIsDone"
      ></BaseTickButton>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tasksIsDone: this.task.isFinished,
    };
  },
  props: ["task"],
  methods: {
    deleteTask() {
      this.$store.dispatch("deleteTask", this.task.id);
    },
    toggleTaskStatus() {
      this.$store.dispatch("toggleTaskStatus", {
        taskId: this.task.id,
        isFinished: !this.task.isFinished,
      });
      this.tasksIsDone = !this.tasksIsDone;
    },
  },
};
</script>
