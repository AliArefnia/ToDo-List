export default {
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
      if (payload) {
        if (responceData[key].list === payload) {
          const task = {
            id: key,
            list: responceData[key].list,
            isFinished: responceData[key].isFinished,
            description: responceData[key].description,
          };
          tasks.push(task);
        }
      }
      if (!payload) {
        const task = {
          id: key,
          list: responceData[key].list,
          isFinished: responceData[key].isFinished,
          description: responceData[key].description,
        };
        tasks.push(task);
      }
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
        id: key,
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
};
