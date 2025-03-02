const API_KEY = import.meta.env.VITE_API_KEY;
const URL = import.meta.env.VITE_URL;

export default {
  async sendTasks(context, payload) {
    const task = payload;

    const responce = await fetch(`${URL}/tasks/tasks.json`, {
      method: "POST",
      body: JSON.stringify(task),
    });

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
    const responce = await fetch(`${URL}/tasks/tasksLists.json`, {
      method: "POST",
      body: JSON.stringify(taskList),
    });

    const responceData = await responce.json();
    if (!responce.ok) {
      const error = new Error(responceData.message || "Failed to fetch data");
      throw error;
    }

    // const id = responceData.name;
    context.commit("addNewList", taskList);
  },

  async receiveTasks(context, payload) {
    const responce = await fetch(`${URL}/tasks/tasks.json`);

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
    const responce = await fetch(`${URL}/tasks/tasksLists.json`);
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
    const responce = await fetch(`${URL}tasks/tasks/${taskId}.json`, {
      method: "DELETE",
    });
    const responceData = await responce.json();
    if (!responce.ok) {
      console.log("delete failed");
    }
    context.commit("removeTask", taskId);
    console.log("Delete done");
  },

  async deleteTaskList(context, taskListId) {
    const responce = await fetch(`${URL}/tasks/tasksLists/${taskListId}.json`, {
      method: "DELETE",
    });
    const responceData = await responce.json();
    if (!responce.ok) {
      console.log("delete failed");
    }
    context.commit("removeTaskList", taskListId);
    console.log("Delete done");
  },

  async toggleTaskStatus(context, { taskId, isFinished }) {
    console.log(taskId, isFinished);
    const responce = await fetch(`${URL}/tasks/tasks/${taskId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFinished }),
    });
    const responceData = await responce.json();
    if (!responce.ok) {
      console.error("error happened");
    }
    context.commit("updateTaskStatus", { taskId, isFinished });
  },

  async signUp(context, payload) {
    console.log("user signup");
    return context.dispatch("auth", { ...payload, mode: "signUp" });
  },
  async logIn(context, payload) {
    console.log("user signup");
    return context.dispatch("auth", { ...payload, mode: "logIn" });
  },

  async auth(context, payload) {
    const mode = payload.mode;

    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    if (mode === "logIn") {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });
      const responseData = await response.json();

      if (!response) {
        console.log(responseData);
        const error =
          new Error(responseData.message) || "Failed to authenticate!";
        throw error;
      }

      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);

      console.log(responseData);

      context.commit("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
        tokenExpiration: responseData.expiresIn,
      });
    } catch {}
  },

  tryLogin(context) {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (token && userId) {
      context.commit("setUser", {
        token: token,
        userId: userId,
        tokenExpiration: null,
      });
    }
  },
};
