import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      tasks: [],
      finishedTasks: [],
      pendingTasks: [],
    };
  },

  actions: {
    async sendTasks(context, payload) {
      const tasks = context.getters.getTasks;
      const task = payload;
      console.log(tasks);

      const responce = await fetch(
        "https://todo-list-f0129-default-rtdb.europe-west1.firebasedatabase.app/tasks/tasks.json",
        { method: "POST", body: JSON.stringify(task) }
      );

      const responceData = await responce.json();
      if (!responce.ok) {
        const error = new Error(responceData.message || "Failed to fetch data");
        throw error;
      }
    },

    async receiveTasks(context, payload) {
      const responce = await fetch(
        "https://todo-list-f0129-default-rtdb.europe-west1.firebasedatabase.app/tasks/tasks.json"
      );

      const responceData = await responce.json();
      if (!responce.ok) {
        const error = new Error(responceData.message || "Failed to fetch data");
        throw error;
      }

      const tasks = [];

      for (const key in responceData) {
        const task = {
          id: key,
          description: responceData[key].description,
        };
        tasks.push(task);
      }

      context.commit("setTasks", tasks);
      context.dispatch("categorisingTasks", tasks);
    },

    async deleteTask(context, taskId) {
      const responce = await fetch(
        `https://todo-list-f0129-default-rtdb.europe-west1.firebasedatabase.app/tasks/tasks/${taskId}.json`,
        { method: "DELETE" }
      );
      const responceData = await responce.json();
      if (!responce.ok) {
        console.log("dleete failed");
      }
      // Update local state
      context.commit("removeTask", taskId);
      console.log("delete done");
      // catch (error) {
      //   console.error("Delete failed:", error);
      // }
    },
  },
  mutations: {
    setTasks(state, payload) {
      state.tasks = payload;
    },
    removeTask(state, taskId) {
      console.log("get in mutation");
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
    setFinishedTasks(state, finishedTasks) {
      state.finishedTasks = finishedTasks;
    },
    setPendingTasks(state, pendingTasks) {
      state.pendingTasks = pendingTasks;
    },
    updateTaskStatus(state, { taskId, isFinished }) {
      console.log("updatetaskstatus");
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        Object.assign(task, isFinished);
      }
    },
  },
  getters: {
    getTasks(state) {
      return state.tasks;
    },
  },
});

export default store;
