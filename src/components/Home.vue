<template>
  <div>
    <section class="flex w-full">
      <input
        type="text"
        id="task"
        class="w-5/6 px-3 bg-zinc-700 border-b-neutral-500 rounded-md"
        placeholder="Enter Your Task ..."
        v-model="newTaskDescription"
      />
      <BaseButton class="w-1/6" @click="addTask">Enter</BaseButton>
      <!-- <BaseButton class="w-1/6" @click="getingTasks">get tasks</BaseButton> -->
    </section>
    <section class="pendingTasks">
      <div>
        <p class="mt-6">Pending Tasks</p>
      </div>
      <ul>
        <li v-for="task in tasks">
          <Tasks
            :task="task"
            :key="task.id"
            @taskDone="taskDoneSt"
            @deleteTask="deleteTask"
          ></Tasks>
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
  data() {
    return {
      newTaskDescription: null,
      tasks: [],
      isLoading: false,
    };
  },
  methods: {
    deleteTask(taskId) {
      this.$store.dispatch("deleteTask", taskId);
      this.tasks = this.tasks.filter((task) => taskId !== task.id);
    },
    addTask() {
      const newTask = {
        isFinished: false,
        description: this.newTaskDescription,
      };
      this.tasks.unshift(newTask);
      console.log(this.tasks);
      this.$store.dispatch("sendTasks", newTask);
    },
    async loadTasks() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("receiveTasks");
      } catch (error) {}
      this.isLoading = false;
      this.tasks = this.$store.getters.getTasks;
    },
  },
  created() {
    this.loadTasks();
  },
};
</script>
