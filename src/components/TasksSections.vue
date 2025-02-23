<template>
  <div class="overflow-hidden">
    <section class="flex w-full mb-6">
      <input
        type="text"
        id="task"
        class="w-full lg:w-5/6 px-3 bg-zinc-700 border-b-neutral-500 rounded-md h-[3rem]"
        placeholder="Enter Your Task ..."
        v-model="newTaskDescription"
        @keypress.enter="addTask"
      />
      <BaseButton class="w-1/6 hidden lg:inline-block" @click="addTask"
        >Enter</BaseButton
      >
    </section>
    <article class="overflow-auto">
      <section
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
export default {
  props: ["list"],
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
    },
    toggleFinishedVisibility() {
      this.visibelFinishedTasks = !this.visibelFinishedTasks;
    },
    addTask() {
      const crationDate = Date.now();
      const newTask = {
        relatedList: this.list,
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
</style>
