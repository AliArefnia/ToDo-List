const API_KEY = "AIzaSyAfvqTdgLhk7_mKxAp2X4iKef1KxKV1I18";

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
      if (payload !== "All Tasks") {
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
      if (payload === "All Tasks") {
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

  async deleteTaskList(context, taskListId) {
    const responce = await fetch(
      `https://todo-list-f0129-default-rtdb.europe-west1.firebasedatabase.app/tasks/tasksLists/${taskListId}.json`,
      { method: "DELETE" }
    );
    const responceData = await responce.json();
    if (!responce.ok) {
      console.log("delete failed");
    }
    context.commit("removeTaskList", taskListId);
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

  async signUp(context, payload) {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );
      const responseData = await response.json();

      if (!response) {
        console.log(responseData);
        const error =
          new Error(responseData.message) || "Failed to authenticate!";
        throw error;
      }

      console.log(responseData);

      context.commit("setUser", {
        token: responseData.token,
        userId: responseData.localId,
        tokenExpiration: responseData.expiresIn,
      });
    } catch {}
  },
};
