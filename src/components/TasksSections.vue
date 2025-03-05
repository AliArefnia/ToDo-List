<template>
  <div class="overflow-hidden">
    <div>
      <h2
        class="text-3xl mb-2 font-mono italic uppercase text-rose-500 px-3 bg-zinc-600 rounded-xl inline-block"
      >
        {{ list }}
      </h2>
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
          @input="clearNotValidInput"
        />
        <BaseButton class="w-1/6 hidden lg:inline-block ml-4" @click="addTask"
          >Enter</BaseButton
        >
      </section>
      <transition name="validation">
        <p v-if="notValidInput" class="flex text-red-700 pl-3 mb-4">
          Task can't be empty or too long!
        </p>
      </transition>
    </div>

    <TransitionGroup
      tag="article"
      name="mainContent"
      class="transition-all duration-500 mt-4"
      :class="{
        'overflow-auto': !this.isLoading,
        'overflow-hidden': this.isLoading,
      }"
    >
      <div
        id="loadingContainer"
        v-if="this.errorMessage || this.isLoading"
        class="text-center"
        key="loadingContainer"
      >
        <p class="text-gray-400" v-if="this.errorMessage">
          {{ this.errorMessage }}
        </p>
        <p class="text-gray-400" v-if="this.isLoading">Loading Your Tasks...</p>
        <BaseSpinner v-if="this.isLoading"></BaseSpinner>
      </div>
      <section
        v-if="!this.errorMessage && !this.isLoading"
        class="content-wrapper pt-0 lg:px-[16px] lg:box-content lg:pr-[calc(16px + 1rem)] pr-4"
      >
        <section id="pendingTasks" key="pendingTasks">
          <div
            class="flex justify-between cursor-pointer"
            @click="togglePendingVisibility()"
          >
            <p class="text-md">Pending Tasks</p>
            <ChevronLeft
              class="bg-neutral-900 w-10 h-10 rounded-full flex items-center justify-center hover:cursor-pointer transition-transform duration-300"
              :class="{ '-rotate-90': visibelPendingTasks }"
            />
          </div>
          <Transition name="slide">
            <div v-if="visibelPendingTasks" class="overflow-hidden">
              <TransitionGroup tag="ul" name="task">
                <li v-for="task in pendingTasks" :key="task.id">
                  <Tasks
                    :task="task"
                    :key="task.id"
                    class="border-zinc-500"
                  ></Tasks>
                </li>
              </TransitionGroup>
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
            </div>
          </Transition>
        </section>
        <section
          id="FinishedTasks"
          key="FinishedTasks"
          class="transition-all duration-500 ease-in"
        >
          <div
            class="flex mt-6 justify-between cursor-pointer"
            @click="toggleFinishedVisibility()"
          >
            <p class="text-md">Finished Tasks</p>
            <ChevronLeft
              class="bg-neutral-900 w-10 h-10 rounded-full flex items-center justify-center hover:cursor-pointer transition-transform duration-300"
              :class="{ '-rotate-90': visibelFinishedTasks }"
            ></ChevronLeft>
          </div>
          <Transition name="slide">
            <div v-if="visibelFinishedTasks" class="overflow-hidden">
              <TransitionGroup tag="ul" name="task">
                <li
                  v-for="task in finishedTasks"
                  :key="task.id"
                  class="line-through decoration-1 text-neutral-500"
                >
                  <Tasks
                    :task="task"
                    :key="task.id"
                    class="border-green-900"
                  ></Tasks>
                </li>
              </TransitionGroup>
              <p
                v-if="finishedTasks.length === 0"
                class="text-neutral-600 text-center"
              >
                You Havn't any Finished Task Yet
              </p>
            </div>
          </Transition>
        </section>
      </section>
    </TransitionGroup>
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
      isLoading: true,
      notValidInput: false,
      visibelPendingTasks: true,
      visibelFinishedTasks: true,
      receiveTimer: null,
    };
  },
  methods: {
    togglePendingVisibility() {
      this.visibelPendingTasks = !this.visibelPendingTasks;
    },
    toggleFinishedVisibility() {
      this.visibelFinishedTasks = !this.visibelFinishedTasks;
    },
    addTask() {
      if (!validInput(this.newTaskDescription)) {
        this.notValidInput = true;
        return;
      }
      const crationDate = Date.now();
      const newTask = {
        creationDate: crationDate,
        description: this.newTaskDescription,
        isFinished: false,
        list: this.list === "All Tasks" ? "today" : this.list,
      };
      this.$store.dispatch("sendTasks", newTask);
      this.newTaskDescription = "";
    },
    clearNotValidInput() {
      this.notValidInput = false;
    },
    inputFocused() {
      this.notValidInput = false;
    },

    async loadTasks() {
      clearInterval(this.receiveTimer);
      this.isLoading = true;
      try {
        await this.$store.dispatch("receiveTasks", this.list);
      } catch (error) {
        this.errorMessage = "Can't get Your Tasks, Pleas try again using VPN!";
      }
      this.isLoading = false;
    },
  },

  created() {
    this.receiveTimer = setInterval(() => {
      console.log("interval called");
      if (this.$store.getters.getNewTokensReceived) {
        this.loadTasks();
      }
    }, 1000);
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

.task-enter-active {
  transition: all 0.5s ease-out;
}
.task-leave-active {
  transition: all 0.3s ease-in;
  position: absolute;
}
.task-enter-from {
  transform: translateX(-30px);
  max-height: 0;
  opacity: 0;
}
.task-leave-to {
  transform: translateX(30px);
  max-height: 0;
  opacity: 0;
}
.task-enter-to,
.task-leave-from {
  transform: translateX(0);
  max-height: 100px;
  opacity: 1;
}
.task-move {
  transition: transform 0.8s ease;
}

.mainContent-enter-from {
  opacity: 0;
}
.mainContent-enter-to {
  opacity: 1;
}
.mainContent-enter-active {
  transition: all 0.5s ease-out;
}
</style>
