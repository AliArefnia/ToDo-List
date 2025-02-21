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
    <section class="pendingTasks">
      <div>
        <p class="mt-6">Pending Tasks</p>
      </div>
      <ul>
        <li v-for="task in pendingTasks">
          <Tasks :task="task" :key="task.id"></Tasks>
        </li>
      </ul>
    </section>
    <section class="FinishedTasks">
      <div>
        <p class="mt-6">Finished Tasks</p>
      </div>
      <ul>
        <li
          v-for="task in finishedTasks"
          class="line-through decoration-1 text-neutral-500"
        >
          <Tasks :task="task" :key="task.id"></Tasks>
        </li>
      </ul>
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
    };
  },
  methods: {
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
