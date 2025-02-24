<template>
  <div class="flex flex-col overflow-auto h-full">
    <!-- <section class="flex flex-col overflow-auto basis-3/4"> -->
    <section class="flex flex-col overflow-auto basis-3/4">
      <p
        class="text-gray-400"
        v-if="!this.isLoading && tasksLists.length === 0 && !this.errorMessage"
      >
        You can add list here...
      </p>
      <p class="text-gray-400" v-if="this.errorMessage">
        {{ this.errorMessage }}
      </p>
      <p class="text-gray-400" v-if="this.isLoading">Loading Your lists...</p>
      <BaseSpinner v-if="this.isLoading"></BaseSpinner>
      <BaseRouterLinkList
        v-if="!this.isLoading"
        :to="`/taskLists/${tasklist.name}`"
        v-for="tasklist in tasksLists"
        :key="tasklist.name"
        :list="tasklist.name"
        >{{ tasklist.name }}</BaseRouterLinkList
      >
    </section>
    <!-- <section class="overflow-hidden mt-2 basis-1/4"> -->
    <section class="overflow-hidden mt-2 flex-auto">
      <input
        type="text"
        id="taskList"
        class="w-full lg:w-5/6 px-3 bg-zinc-700 rounded-md h-[40px] outline-none"
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
      errorMessage: null,
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
      } catch (error) {
        this.errorMessage = "Can't get Your lists, pleas try again using VPN!";
      }
      this.isLoading = false;
    },
  },
  created() {
    this.loadTasksLists();
  },
};
</script>
