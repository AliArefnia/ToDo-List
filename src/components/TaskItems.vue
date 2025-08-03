<template>
  <TasksSections :list="taskListItem"></TasksSections>
</template>
<script>
export default {
  data() {
    return {
      task: null,
      pendingTasks: [],
    };
  },
  props: ["taskListItem"],
  methods: {
    TaskListLink() {
      return "/taskLists" + this.taskListName;
    },
  },
  created() {
    const taskListName = this.$route.params.taskListItem;
    const allTasks = this.$store.getters.getTasks;
    this.pendingTasks = allTasks.filter((task) => task.list === taskListName);
  },
};
</script>
