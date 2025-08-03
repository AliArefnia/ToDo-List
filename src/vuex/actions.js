const API_KEY = import.meta.env.VITE_API_KEY;
const URL = import.meta.env.VITE_URL;
let timer;

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
    return context.dispatch("auth", { ...payload, mode: "signUp" });
  },
  async logIn(context, payload) {
    return context.dispatch("auth", { ...payload, mode: "logIn" });
  },

  async auth(context, payload) {
    const mode = payload.mode;

    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    if (mode === "logIn") {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

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
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const responseData = await response.json();

      if (!response.ok) {
        const error =
          new Error(responseData.error?.message) || "Failed to authenticate!";
        throw error;
      }

      // const tokenExpirationTime = 20000;
      const tokenExpirationTime = responseData.expiresIn * 1000;
      const tokenExpirationDate = Date.now() + tokenExpirationTime;
      const refreshToken = responseData.refreshToken;
      const userId = responseData.localId;

      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("tokenExpirationDate", tokenExpirationDate);

      timer = setTimeout(() => {
        context.dispatch("tryLogin");
      }, tokenExpirationTime - 60000);

      context.commit("setUser", {
        token: responseData.idToken,
        userId: userId,
        refreshToken: refreshToken,
        tokenExpirationDate: tokenExpirationDate,
      });
    } catch (error) {
      console.error("API Error:", error.message);
      throw error;
    }
  },

  async tryLogin(context) {
    const userId = localStorage.getItem("userId");
    const refreshToken = localStorage.getItem("refreshToken");
    const tokenExpirationDate = localStorage.getItem("tokenExpirationDate");

    const tokenExpiration = +tokenExpirationDate - Date.now();
    if (tokenExpiration < 0 || !refreshToken || !userId) {
      return context.dispatch("logOut");
    }

    context.commit("setNewTokensReceived", false);
    await context.dispatch("getNewTokens", { refreshToken, userId });
    context.commit("setNewTokensReceived", true);

    const newTokenExpirationDate = localStorage.getItem("tokenExpirationDate");
    const newTokenExpiration = +newTokenExpirationDate - Date.now();

    timer = setTimeout(() => {
      context.dispatch("tryLogin");
    }, newTokenExpiration - 60000);
  },

  logOut(context) {
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

  async getNewTokens(context, payload) {
    try {
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: payload.refreshToken,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.error?.message === "TOKEN_EXPIRED") {
          return context.dispatch("logOut");
        }
        const error =
          new Error(responseData.error?.message) || "Failed to authenticate!";
        throw error;
      }

      const tokenExpirationDate = Date.now() + responseData.expires_in * 1000;
      // const tokenExpirationDate = Date.now() + 20000;
      context.commit("setUser", {
        token: responseData.id_token,
        userId: payload.userId,
        refreshToken: responseData.refresh_token,
        tokenExpirationDate: tokenExpirationDate,
      });

      localStorage.setItem("refreshToken", responseData.refresh_token);
      localStorage.setItem("tokenExpirationDate", tokenExpirationDate);
    } catch (error) {
      console.log("error in getting new token ");
    }
  },

  scheduleTokenRefresh(context, { refreshToken, userId }) {
    clearTimeout(timer);

    const newTokenExpirationDate = localStorage.getItem("tokenExpirationDate");
    const newTokenExpiration = +newTokenExpirationDate - Date.now();

    if (newTokenExpiration > 60000) {
      timer = setTimeout(() => {
        context.dispatch("getNewTokens", { refreshToken, userId });
      }, newTokenExpiration - 60000);
    }
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
