<template>
  <AlertModule :show="deletingTask" @close="deletingTaskDecision(false)">
    <template #header>Deleting Task</template>
    <template #default>
      <p class="!text-xl">Are You sure you want to remove the task?</p>
    </template>
    <template #actions="{ close }">
      <BaseButton
        @click="
          close;
          deletingTaskDecision(true);
        "
        class="border-2 border-rose-500 w-[5rem]"
        >Yes</BaseButton
      >
      <BaseButton
        @click="
          close;
          deletingTaskDecision(false);
        "
        class="!bg-rose-500 w-[5rem] ml-2 text-white"
        >No</BaseButton
      >
    </template>
  </AlertModule>
  <div
    class="flex my-4 justify-between items-center border-2 rounded-md px-4 py-2"
    v-bind="$attrs"
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
      deletingTask: false,
    };
  },
  props: ["task"],
  methods: {
    deleteTask() {
      this.deletingTask = true;
    },
    deletingTaskDecision(decision) {
      this.deletingTask = decision;
      if (decision === true) {
        this.$store.dispatch("deleteTask", this.task.id);
      }
      this.deletingTask = false;
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
