<template>
  <div class="lg:text-center flex flex-col h-full">
    <h1 class="w-full text-6xl mb-3">Welcome</h1>
    <h2 class="w-full text-3xl text-red-500">Here is Your ToDo-List</h2>
    <ul class="flex flex-col border-b-2 border-b-neutral-500 mb-3 py-3">
      <RouterLink to="today" class="my-1">
        <Sun class="inline mr-2" color="gold"></Sun>Today</RouterLink
      >
      <RouterLink to="AllTasks" class="my-1"
        ><Infinity class="inline mr-2" color="pink"></Infinity> All
        Tasks</RouterLink
      >
      <RouterLink to="importantTasks" class="my-1"
        ><Star class="inline mr-2" color="red"></Star> Important
        Tasks</RouterLink
      >
    </ul>
    <TasksLists></TasksLists>
  </div>
</template>

<script>
import TasksLists from "./TasksLists.vue";
import { Sun, Star, Infinity } from "lucide-vue-next";
export default {
  components: { TasksLists, Sun, Star, Infinity },
  created() {
    console.log(this.$route);
  },
};
</script>
