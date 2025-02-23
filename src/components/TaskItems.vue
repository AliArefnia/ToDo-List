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
      console.log(this.taskListName);
      return "/taskLists" + this.taskListName;
    },
  },
  created() {
    const taskListName = this.$route.params.taskListItem;
    const allTasks = this.$store.getters.getTasks;
    console.log(allTasks);
    this.pendingTasks = allTasks.filter((task) => task.list === taskListName);
    console.log(this.pendingTasks);
  },
};
</script>
