<template>
  <div class="flex flex-col overflow-auto">
    <!-- <section class="flex flex-col overflow-auto basis-3/4"> -->
    <section class="flex flex-col overflow-auto basis-3/4">
      <BaseRouterLinkList
        :to="`/taskLists/${tasklist.name}`"
        v-for="tasklist in tasksLists"
        :key="tasklist.name"
        :list="tasklist.name"
        >{{ tasklist.name }}</BaseRouterLinkList
      >
    </section>
    <!-- <section class="overflow-hidden mt-2 basis-1/4"> -->
    <section class="overflow-hidden mt-2 grow">
      <input
        type="text"
        id="task"
        class="w-full lg:w-5/6 px-3 bg-zinc-700 border-b-neutral-500 rounded-md h-[40px]"
        placeholder="Enter Your List name here ..."
        v-model="newListName"
        @keypress.enter="addList"
      />
    </section>
  </div>
</template>

<script>
import TaskItems from "./TaskItems.vue";
import BaseRouterLinkList from "./ui/BaseRouterLinkList.vue";

export default {
  components: { TaskItems, BaseRouterLinkList },
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
