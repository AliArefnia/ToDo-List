const API_KEY = import.meta.env.VITE_API_KEY;
const URL = import.meta.env.VITE_URL;

export default {
  async sendTasks(context, payload) {
    const { user, token } = getUserAuth(context);

    try {
      const responce = await fetch(
        `${URL}/users/${user}/tasks.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responceData = await responce.json();
      if (!responce.ok) {
        const error = new Error(
          responceData.message || "Failed to Create Task"
        );
        throw error;
      }
      const id = responceData.name;
      context.commit("addNewTask", { ...payload, id });
    } catch (error) {
      console.error("API Error:", error.message);
      throw error;
    }
  },

  async sendTasksLists(context, payload) {
    const { user, token } = getUserAuth(context);
    const taskList = payload;
    const responce = await fetch(
      `${URL}/users/${user}/tasksLists.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskList),
      }
    );

    const responceData = await responce.json();
    if (!responce.ok) {
      const error = new Error(responceData.message || "Failed to fetch data");
      throw error;
    }
    context.commit("addNewList", taskList);
  },

  async receiveTasks(context, payload) {
    const { user, token } = getUserAuth(context);
    const responce = await fetch(
      `${URL}/users/${user}/tasks.json?auth=${token}`,
      {
        headers: { "Content-Type": "application/json" },
      }
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
    const { user, token } = getUserAuth(context);
    const responce = await fetch(
      `${URL}/users/${user}/tasksLists.json?auth=${token}`,
      {
        headers: { "Content-Type": "application/json" },
      }
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
    const { user, token } = getUserAuth(context);
    const responce = await fetch(
      `${URL}/users/${user}/tasks/${taskId}.json?auth=${token}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responceData = await responce.json();
    if (!responce.ok) {
      console.log("delete failed");
    }
    context.commit("removeTask", taskId);
    console.log("Delete done");
  },

  async deleteTaskList(context, taskListId) {
    const { user, token } = getUserAuth(context);
    const responce = await fetch(
      `${URL}/users/${user}/tasksLists/${taskListId}.json?auth=${token}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responceData = await responce.json();
    if (!responce.ok) {
      console.log("delete failed");
    }
    context.commit("removeTaskList", taskListId);
    console.log("Delete done");
  },

  async toggleTaskStatus(context, { taskId, isFinished }) {
    const { user, token } = getUserAuth(context);
    console.log(taskId, isFinished);
    const responce = await fetch(
      `${URL}/users/${user}/tasks/${taskId}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData);
        const error =
          new Error(responseData.error?.message) || "Failed to authenticate!";
        console.log(responseData.error.message);
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
    } catch (error) {
      console.log(error.message);
      console.error("API Error:", error.message);
      throw error;
    }
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

  logOut(context) {
    console.log("logout");
    localStorage.removeItem("userId");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpirationDate");

    context.commit("setUser", {
      userId: null,
      token: null,
      refreshToken: null,
      tokenExpiration: null,
    });
    context.commit("SetAuthenticated", false);
  },
};

function getUserAuth(context) {
  const user = context.getters.getUserId;
  const token = context.getters.getToken;

  if (!user || !token) {
    throw new Error("User not authenticated");
  }

  return { user, token };
}
