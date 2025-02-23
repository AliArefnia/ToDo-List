<template>
  <div>
    <RouterLink
      :to="`/taskLists/${tasklist}`"
      v-for="tasklist in taskLists"
      :key="tasklist"
      :list="tasklist"
      >{{ tasklist }}</RouterLink
    >
  </div>
</template>

<script>
import TaskItems from "./TaskItems.vue";

export default {
  components: { TaskItems },
  data() {
    return {
      taskLists: ["t1", "t2", "t3"],
    };
  },
};
</script>
