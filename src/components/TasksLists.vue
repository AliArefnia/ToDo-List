<template>
  <div class="flex flex-col overflow-auto h-full">
    <!-- <section class="flex flex-col overflow-auto basis-3/4"> -->
    <section class="flex flex-col overflow-auto basis-3/4 lg:w-5/6 lg:mx-auto">
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
    <section class="mt-4 flex-auto transition-all">
      <input
        type="text"
        id="taskList"
        class="w-full lg:w-5/6 px-3 bg-zinc-700 rounded-md h-[40px] outline-amber-50"
        placeholder="Enter Your List name here ..."
        v-model="newListName"
        @keypress.enter="addList"
        @focus="inputFocused"
        ref="inputRef"
        @keyup.enter="unfocus"
      />
      <transition name="validation">
        <p
          v-if="notValidInput"
          class="flex text-red-700 pl-3 lg:ml-[6rem] mt-2 lg:w-5/6"
        >
          Task can't be empty or too long!
        </p>
      </transition>
    </section>
  </div>
</template>

<script>
import TaskItems from "./TaskItems.vue";
import BaseRouterLinkList from "./ui/BaseRouterLinkList.vue";
import validInput from "@/helpers/Validation.js";

export default {
  components: { TaskItems, BaseRouterLinkList },
  data() {
    return {
      notValidInput: false,
      errorMessage: null,
      isLoading: false,
      newListName: "",
    };
  },
  computed: {
    tasksLists() {
      return this.$store.getters.getTasksLists;
    },
  },
  methods: {
    addList() {
      if (!validInput(this.newListName)) {
        this.notValidInput = true;
        return;
      }
      this.$store.dispatch("sendTasksLists", { name: this.newListName });
      this.newListName = "";
    },
    inputFocused() {
      this.notValidInput = false;
    },
    unfocus() {
      this.$refs.inputRef.blur();
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
<style>
.validation-enter-active,
.validation-leave-active {
  transition: all 0.3s ease-out;
}
.validation-enter-from,
.validation-leave-to {
  max-height: 0;
  opacity: 0;
}
.validation-enter-to,
.validation-leave-from {
  max-height: 100px;
  opacity: 1;
}
</style>
