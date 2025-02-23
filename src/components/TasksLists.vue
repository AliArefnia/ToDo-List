<template>
  <div>
    <RouterLink
      :to="`/taskLists/${tasklist.name}`"
      v-for="tasklist in tasksLists"
      :key="tasklist.name"
      :list="tasklist.name"
      >{{ tasklist.name }}</RouterLink
    >
    <input
      type="text"
      id="task"
      class="w-full lg:w-5/6 px-3 bg-zinc-700 border-b-neutral-500 rounded-md h-[3rem]"
      placeholder="Enter Your List name here ..."
      v-model="newListName"
      @keypress.enter="addList"
    />
  </div>
</template>

<script>
import TaskItems from "./TaskItems.vue";

export default {
  components: { TaskItems },
  data() {
    return {
      isLoading: false,
      newListName: null,
    };
  },
  computed: {
    tasksLists() {
      return this.$store.getters.getTasksLists;
    },
  },
  methods: {
    addList() {
      this.$store.dispatch("sendTasksLists", { name: this.newListName });
    },
    async loadTasksLists() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("receiveTasksLists");
      } catch (error) {}
      this.isLoading = false;
    },
  },
  created() {
    this.loadTasksLists();
  },
};
</script>
