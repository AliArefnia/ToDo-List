<template>
  <div class="flex flex-col overflow-hidden h-full">
    <AlertModule
      :show="deletingTaskList"
      @close="deletingTaskListDecision(false)"
    >
      <template #header>Deleting Task List</template>
      <template #default>
        <p class="!text-xl">Are You sure you want to remove the task List?</p>
      </template>
      <template #actions="{ close }">
        <BaseButton
          @click="
            close;
            deletingTaskListDecision(true);
          "
          class="border-2 border-rose-500 w-[5rem]"
          >Yes</BaseButton
        >
        <BaseButton
          @click="
            close;
            deletingTaskListDecision(false);
          "
          class="!bg-rose-500 w-[5rem] ml-2 text-white"
          >No</BaseButton
        >
      </template>
    </AlertModule>
    <!-- <section class="flex flex-col overflow-auto basis-3/4"> -->
    <TransitionGroup
      tag="section"
      name="taskList"
      class="flex flex-col overflow-auto basis-3/4"
    >
      <div id="loadingContainer" key="loadingContainer" class="text-xl">
        <p
          class="text-gray-400"
          v-if="
            !this.isLoading && tasksLists.length === 0 && !this.errorMessage
          "
        >
          You have no list! Add lists here...
        </p>
        <p v-if="this.errorMessage" class="text-gray-400">
          {{ this.errorMessage }}
        </p>
        <p v-if="this.isLoading" class="text-gray-400 mb-2">
          Loading Your lists...
        </p>
        <BaseSpinner v-if="this.isLoading"></BaseSpinner>
      </div>
      <section
        class="flex justify-between items-center w-[95%] border-b-1 border-b-neutral-800 flex-wrap lg:w-5/6 lg:mx-auto"
        v-for="tasklist in tasksListsLocal"
        v-if="!this.isLoading"
      >
        <BaseRouterLinkList
          :to="`/taskLists/${tasklist.name}`"
          :key="tasklist.name"
          :list="tasklist.name"
          class="w-5/6"
        >
          <div class="min-w-1/2 max-w-5/6 lg:max-w-full text-left">
            {{ tasklist.name }}
          </div>
        </BaseRouterLinkList>
        <ChevronLeft
          class="bg-neutral-900 w-5 h-5 rounded-full flex items-center justify-center hover:cursor-pointer transition-transform duration-300"
          :class="{ '-rotate-90': tasklist.listPanelVisible }"
          @click="switchPanelVisiblity(tasklist.id)"
        />
        <transition name="listSlide"
          ><div
            v-if="tasklist.listPanelVisible"
            class="flex w-full bg-neutral-900 justify-center"
          >
            <BaseBinbutton
              class="my-1"
              @click="tryToDeleteTaskLists(tasklist.id)"
            ></BaseBinbutton></div
        ></transition>
      </section>
    </TransitionGroup>
    <!-- <section class="overflow-hidden mt-2 basis-1/4"> -->
    <section class="mt-4 flex-auto transition-all">
      <input
        type="text"
        id="taskList"
        class="w-full lg:w-5/6 px-3 bg-zinc-700 rounded-md h-[40px] outline-amber-50"
        placeholder="Enter Your List name here ..."
        v-model="newListName"
        @keyup.enter="addList"
        @focus="inputFocused"
        ref="inputRef"
        @input="clearNotValidInput"
        autofocus
      />
      <transition name="validation">
        <p
          v-if="notValidInput"
          class="flex text-red-700 pl-3 lg:ml-[6rem] mt-2 lg:w-5/6"
        >
          List name can't be empty or too long!
        </p>
        <p
          v-else-if="repetitiveListName"
          class="flex text-red-700 pl-3 lg:ml-[6rem] mt-2 lg:w-5/6"
        >
          This List name already exists!
        </p>
      </transition>
    </section>
  </div>
</template>

<script>
import TaskItems from "./TaskItems.vue";
import BaseRouterLinkList from "./ui/BaseRouterLinkList.vue";
import validInput from "@/helpers/ValidationTaskListLength";

export default {
  components: { TaskItems, BaseRouterLinkList },
  data() {
    return {
      notValidInput: false,
      repetitiveListName: false,
      errorMessage: null,
      isLoading: true,
      newListName: "",
      tasksListsLocal: [],
      receiveTimer: null,
      deletingTaskList: false,
      deletingTaskListId: null,
    };
  },

  computed: {
    tasksLists() {
      return this.$store.getters.getTasksLists.map((list) => ({
        ...list,
        listPanelVisible: false,
      }));
    },
  },

  methods: {
    tryToDeleteTaskLists(taskListId) {
      this.deletingTaskList = true;
      this.deletingTaskListId = taskListId;
    },
    deletingTaskListDecision(decision) {
      this.deletingTaskList = decision;
      if (decision === true) {
        this.deleteTaskList(this.deletingTaskListId);
      }
      this.deletingTaskList = false;
      this.deletingTaskListId = null;
    },

    deleteTaskList(taskListId) {
      try {
        this.$store.dispatch("deleteTaskList", taskListId);
      } catch (error) {
        console.error("Delete failed:", error);
      }
      const deletedListIndex = this.tasksListsLocal.findIndex(
        (list) => list.id === taskListId
      );
      this.tasksListsLocal.splice(deletedListIndex, 1);
    },

    receiveTasksLists() {
      console.log(this.tasksListsLocal);
      this.tasksListsLocal = this.$store.getters.getTasksLists;
      this.tasksListsLocal.map(
        (list) => (list.listPanelVisible = list.listPanelVisible || false)
      );
    },

    switchPanelVisiblity(tasklistId) {
      this.tasksListsLocal.map((tasklist) => {
        if (tasklist.id === tasklistId) {
          tasklist.listPanelVisible = !tasklist.listPanelVisible;
        }
      });
      console.log(this.tasksListsLocal);
    },

    async addList() {
      if (!validInput(this.newListName)) {
        this.notValidInput = true;
        return;
      }
      if (this.tasksListsLocal.find((list) => list.name === this.newListName)) {
        this.repetitiveListName = true;
        return;
      }

      await this.$store.dispatch("sendTasksLists", {
        name: this.newListName,
        id: Date.now(),
      });
      console.log(this.tasksLists);
      console.log(this.tasksListsLocal);

      this.newListName = "";
    },
    inputFocused() {
      this.notValidInput = false;
      this.repetitiveListName = false;
    },
    clearNotValidInput() {
      this.notValidInput = false;
      this.repetitiveListName = false;
    },
    async loadTasksLists() {
      clearInterval(this.receiveTimer);
      this.isLoading = true;
      try {
        await this.$store.dispatch("receiveTasksLists");
      } catch (error) {
        this.errorMessage = "Can't get Your lists, pleas try again using VPN!";
      }
      this.receiveTasksLists();
      this.isLoading = false;
    },
  },
  created() {
    this.receiveTimer = setInterval(() => {
      console.log("interval called");
      if (this.$store.getters.getNewTokensReceived) {
        this.loadTasksLists();
      }
    }, 1000);
  },
  mounted() {},
};
</script>
<style scoped>
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

.listSlide-enter-active,
.listSlide-leave-active {
  transition: all 0.3s ease-out;
}
.listSlide-enter-from,
.listSlide-leave-to {
  max-height: 0;
  opacity: 0;
}
.listSlide-enter-to,
.listSlide-leave-from {
  max-height: 100px;
  opacity: 1;
}

.taskList-enter-from,
.taskList-leave-to {
  opacity: 0;
}
.taskList-enter-to,
.taskList-leave-from {
  opacity: 1;
}
.taskList-enter-active,
.taskList-leave-active {
  transition: opacity 0.5s ease-out;
}
a {
  /* display: inline; Default, but ensures wrapping */
  word-wrap: break-word; /* Breaks long words */
  overflow-wrap: break-word; /* Alternative for better support */
}
</style>
