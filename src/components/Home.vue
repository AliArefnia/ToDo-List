<template>
  <div>
    <section class="flex w-full">
      <input
        type="text"
        id="task"
        class="w-5/6 px-3 bg-zinc-700 border-b-neutral-500 rounded-md"
        placeholder="Enter Your Task ..."
        v-model="newTaskDescription"
        @keypress.enter="addTask"
      />
      <BaseButton class="w-1/6" @click="addTask">Enter</BaseButton>
    </section>
    <section id="pendingTasks">
      <div
        class="mt-6 flex justify-between cursor-pointer"
        @click="togglePendingVisibility()"
      >
        <p class="text-lg">Pending Tasks</p>
        <ChevronLeft
          class="bg-neutral-900 w-10 h-10 rounded-full flex items-center justify-center hover:cursor-pointer transition-transform duration-300"
          :class="{ '-rotate-90': visibelPendingTasks }"
        />
      </div>
      <Transition name="slide">
        <ul v-if="visibelPendingTasks">
          <li v-for="task in pendingTasks">
            <Tasks :task="task" :key="task.id" class="border-zinc-500"></Tasks>
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
        <ul v-if="visibelFinishedTasks" class="transition-all duration-300">
          <li
            v-for="task in finishedTasks"
            class="line-through decoration-1 text-neutral-500"
          >
            <Tasks :task="task" :key="task.id" class="border-green-900"></Tasks>
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
  </div>
</template>

<script>
import Tasks from "./Tasks.vue";
export default {
  components: {
    Tasks,
  },
  computed: {
    pendingTasks() {
      console.log(this.$store.getters.pendingTasks);
      return this.$store.getters.pendingTasks;
    },
    finishedTasks() {
      return this.$store.getters.finishedTasks;
    },
  },
  data() {
    return {
      newTaskDescription: null,
      isLoading: false,
      visibelPendingTasks: true,
      visibelFinishedTasks: true,
    };
  },
  methods: {
    togglePendingVisibility() {
      this.visibelPendingTasks = !this.visibelPendingTasks;
      console.log(this.visibelPendingTasks);
    },
    toggleFinishedVisibility() {
      this.visibelFinishedTasks = !this.visibelFinishedTasks;
      console.log(this.visibelFinishedTasks);
    },
    event(event) {
      console.log(event);
    },

    addTask() {
      const tempId = `temp-${Date.now()}`;
      const newTask = {
        isFinished: false,
        description: this.newTaskDescription,
      };
      this.$store.dispatch("sendTasks", newTask);
      this.newTaskDescription = "";
    },
    async loadTasks() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("receiveTasks");
      } catch (error) {}
      this.isLoading = false;
    },
  },

  created() {
    this.loadTasks();
  },
};
</script>

<style scoped>
/* .custom-chevron {
  @apply bg-zinc-900 w-10 h-10 rounded-full flex items-center justify-center hover:cursor-pointer transition-transform duration-300;
} */

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
  /* transform-origin: top; */
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
/* .task-lists-move {
  transition: transform 0.8s ease;
} */
</style>
