<template>
  <div
    class="flex my-4 justify-between items-center border-2 rounded-md px-4 py-2"
  >
    <p>{{ task.description }}</p>
    <div class="">
      <BaseBinbutton @click="deleteTask"></BaseBinbutton>
      <BaseTickButton
        @click="toggleTaskStatus"
        :taskIsDone="tasksIsDone"
      ></BaseTickButton>
      <p></p>
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
