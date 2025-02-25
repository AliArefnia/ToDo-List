<template>
  <div class="overflow-hidden">
    <div>
      <section class="flex w-full mb-2">
        <input
          type="text"
          id="task"
          class="w-full lg:w-5/6 px-3 bg-zinc-700 border-b-neutral-500 rounded-md h-[3rem] outline-amber-50"
          placeholder="Enter Your Task ..."
          v-model="newTaskDescription"
          @keypress.enter="addTask()"
          @focus="inputFocused"
          ref="inputRef"
          @keyup.enter="unfocus"
        />
        <BaseButton class="w-1/6 hidden lg:inline-block" @click="addTask"
          >Enter</BaseButton
        >
      </section>
      <transition name="validation">
        <p v-if="notValidInput" class="flex text-red-700 pl-3 mb-4">
          Task can't be empty or too long!
        </p>
      </transition>
    </div>
    <article
      class="transition-all duration-500 mt-4"
      :class="{
        'overflow-auto': !this.isLoading,
        'overflow-hidden': this.isLoading,
      }"
    >
      <p class="text-gray-400" v-if="this.errorMessage">
        {{ this.errorMessage }}
      </p>
      <p class="text-gray-400" v-if="this.isLoading">Loading Your Tasks...</p>
      <BaseSpinner v-if="this.isLoading"></BaseSpinner>
      <section
        v-if="!this.errorMessage && !this.isLoading"
        class="content-wrapper pt-0 lg:px-[16px] lg:box-content lg:pr-[calc(16px + 1rem)] pr-4"
      >
        <section id="pendingTasks">
          <div
            class="flex justify-between cursor-pointer"
            @click="togglePendingVisibility()"
          >
            <p class="text-lg">Pending Tasks</p>
            <ChevronLeft
              class="bg-neutral-900 w-10 h-10 rounded-full flex items-center justify-center hover:cursor-pointer transition-transform duration-300"
              :class="{ '-rotate-90': visibelPendingTasks }"
            />
          </div>
          <Transition name="slide">
            <ul v-if="visibelPendingTasks" class="overflow-hidden">
              <li v-for="task in pendingTasks">
                <Tasks
                  :task="task"
                  :key="task.id"
                  class="border-zinc-500"
                ></Tasks>
              </li>
              <p
                v-if="pendingTasks.length === 0 && finishedTasks.length !== 0"
                class="text-neutral-600 text-center"
              >
                Congrats! You Have no pending Task
              </p>
              <p
                v-if="pendingTasks.length === 0 && finishedTasks.length === 0"
                class="text-neutral-600 text-center"
              >
                You Havn't added any Task
              </p>
            </ul>
          </Transition>
        </section>
        <section id="FinishedTasks">
          <div
            class="flex mt-6 justify-between cursor-pointer"
            @click="toggleFinishedVisibility()"
          >
            <p class="text-lg">Finished Tasks</p>
            <ChevronLeft
              class="bg-neutral-900 w-10 h-10 rounded-full flex items-center justify-center hover:cursor-pointer transition-transform duration-300"
              :class="{ '-rotate-90': visibelFinishedTasks }"
            ></ChevronLeft>
          </div>
          <Transition name="slide">
            <ul v-if="visibelFinishedTasks" class="overflow-hidden">
              <li
                v-for="task in finishedTasks"
                class="line-through decoration-1 text-neutral-500"
              >
                <Tasks
                  :task="task"
                  :key="task.id"
                  class="border-green-900"
                ></Tasks>
              </li>
              <p
                v-if="finishedTasks.length === 0"
                class="text-neutral-600 text-center"
              >
                You Havn't any Finished Task Yet
              </p>
            </ul>
          </Transition>
        </section>
      </section>
    </article>
  </div>
</template>

<script>
import validInput from "@/helpers/Validation.js";

export default {
  props: ["list"],
  computed: {
    pendingTasks() {
      return this.$store.getters.pendingTasks;
    },
    finishedTasks() {
      return this.$store.getters.finishedTasks;
    },
  },
  data() {
    return {
      errorMessage: null,
      newTaskDescription: "",
      isLoading: false,
      notValidInput: false,
      visibelPendingTasks: true,
      visibelFinishedTasks: true,
    };
  },
  methods: {
    togglePendingVisibility() {
      this.visibelPendingTasks = !this.visibelPendingTasks;
    },
    toggleFinishedVisibility() {
      this.visibelFinishedTasks = !this.visibelFinishedTasks;
    },
    addTask(event) {
      console.log(event);
      if (!validInput(this.newTaskDescription)) {
        this.notValidInput = true;
        return;
      }
      const crationDate = Date.now();
      const newTask = {
        creationDate: crationDate,
        description: this.newTaskDescription,
        isFinished: false,
        list: this.list ?? "today",
      };
      this.$store.dispatch("sendTasks", newTask);
      this.newTaskDescription = "";
      event.target.blur();
    },
    unfocus() {
      this.$refs.inputRef.blur();
    },
    inputFocused() {
      this.notValidInput = false;
    },

    async loadTasks() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("receiveTasks", this.list || null);
      } catch (error) {
        this.errorMessage = "Can't get Your Tasks, Pleas try again using VPN!";
      }
      this.isLoading = false;
    },
  },

  created() {
    this.loadTasks();
  },
  beforeUnmount() {
    this.$store.commit("clearTasks");
    console.log("taskCleared");
  },
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
}
.slide-enter-to,
.slide-leave-from {
  max-height: 100vh;
  opacity: 1;
  transform: translateY(0) scaleY(1);
}

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
