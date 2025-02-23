<template>
  <div class="text-center">
    <h1 class="w-full text-6xl mb-3">Welcome</h1>
    <h2 class="w-full text-3xl text-red-500">Here is Your ToDo-List</h2>
    <ul class="flex flex-col border-b-2 mb-3">
      <RouterLink to="home"> Daily Task</RouterLink>
      <!-- <RouterLink to="importantTasks"> Important Tasks</RouterLink> -->
      <RouterLink to="AllTasks"> All Tasks</RouterLink>
      <RouterLink to="importantTasks">Important Tasks</RouterLink>
    </ul>
    <TasksLists class="flex flex-col overflow-auto"></TasksLists>
  </div>
</template>

<script>
import TasksLists from "./TasksLists.vue";

export default {
  components: { TasksLists },
  created() {
    console.log(this.$route);
  },
};
</script>
