<template>
  <TasksSections :list="list"></TasksSections>
</template>
<script>
export default {
  data() {
    return {
      taskLists: ["t1", "t2", "t3"],
      task: null,
    };
  },
  props: ["list"],
  methods: {
    TaskListLink() {
      console.log(this.taskListName);
      return "/taskLists" + this.taskListName;
    },
  },
  created() {
    const taskListId = this.$route.params.taskListItem;
    this.task = this.taskLists.find((task) => task === taskListId);
    this.$store.dispatch("sendTasksLists");
  },
};
</script>
