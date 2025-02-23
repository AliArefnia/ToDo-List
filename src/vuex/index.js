import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      tasks: [],
      finishedTasks: [],
      pendingTasks: [],
      taskLists: [],
    };
  },

  actions: {
    async sendTasks(context, payload) {
      const task = payload;

      const responce = await fetch(
        "https://todo-list-f0129-default-rtdb.europe-west1.firebasedatabase.app/tasks/tasks.json",
        { method: "POST", body: JSON.stringify(task) }
      );

      const responceData = await responce.json();
      if (!responce.ok) {
        const error = new Error(responceData.message || "Failed to fetch data");
        throw error;
      }
      const id = responceData.name;
      context.commit("addNewTask", { ...task, id });
    },

    async sendTasksLists(context, payload) {
      const taskList = payload;
      const responce = await fetch(
        "https://todo-list-f0129-default-rtdb.europe-west1.firebasedatabase.app/tasks/tasksLists.json",
        { method: "POST", body: JSON.stringify(taskList) }
      );

      const responceData = await responce.json();
      if (!responce.ok) {
        const error = new Error(responceData.message || "Failed to fetch data");
        throw error;
      }

      // const id = responceData.name;
      context.commit("addNewList", taskList);
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
          list: responceData[key].list,
          isFinished: responceData[key].isFinished,
          description: responceData[key].description,
        };
        tasks.push(task);
      }
      console.log(tasks);
      context.commit("setTasks", tasks);
    },

    async receiveTasksLists(context, payload) {
      const responce = await fetch(
        "https://todo-list-f0129-default-rtdb.europe-west1.firebasedatabase.app/tasks/tasksLists.json"
      );

      const responceData = await responce.json();
      if (!responce.ok) {
        const error = new Error(responceData.message || "Failed to fetch data");
        throw error;
      }

      const tasksLists = [];

      for (const key in responceData) {
        const tasksList = {
          name: responceData[key].name,
        };
        tasksLists.push(tasksList);
      }

      context.commit("setTasksLists", tasksLists);
    },

    async deleteTask(context, taskId) {
      const responce = await fetch(
        `https://todo-list-f0129-default-rtdb.europe-west1.firebasedatabase.app/tasks/tasks/${taskId}.json`,
        { method: "DELETE" }
      );
      const responceData = await responce.json();
      if (!responce.ok) {
        console.log("delete failed");
      }
      context.commit("removeTask", taskId);
      console.log("Delete done");
    },

    async toggleTaskStatus(context, { taskId, isFinished }) {
      console.log(taskId, isFinished);
      const responce = await fetch(
        `https://todo-list-f0129-default-rtdb.europe-west1.firebasedatabase.app/tasks/tasks/${taskId}.json`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFinished }),
        }
      );
      const responceData = await responce.json();
      if (!responce.ok) {
        console.error("error happened");
      }
      context.commit("updateTaskStatus", { taskId, isFinished });
    },
  },

  mutations: {
    setTasks(state, task) {
      state.tasks = task;
    },
    setTasksLists(state, tasksList) {
      state.taskLists = tasksList;
      console.log(state.taskLists);
    },
    addNewTask(state, task) {
      state.tasks.unshift(task);
      console.log(state.tasks);
    },
    addNewList(state, taskList) {
      state.taskLists.unshift(taskList);
      console.log(state.taskLists);
    },
    removeTask(state, taskId) {
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
    updateTaskStatus(state, { taskId, isFinished }) {
      const index = state.tasks.findIndex((t) => t.id === taskId);
      if (index > -1) {
        const updatedTask = {
          ...state.tasks[index],
          isFinished,
        };
        state.tasks.splice(index, 1, updatedTask);
      }
    },
  },

  getters: {
    getTasks(state) {
      return state.tasks;
    },
    getTasksLists(state) {
      return state.taskLists;
    },
    getFinishedTasks(state) {
      return state.finishedTasks;
    },
    pendingTasks: (state) => state.tasks.filter((task) => !task.isFinished),
    finishedTasks: (state) => state.tasks.filter((task) => task.isFinished),
  },
});

export default store;
