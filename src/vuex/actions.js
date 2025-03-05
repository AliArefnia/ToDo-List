const API_KEY = import.meta.env.VITE_API_KEY;
const URL = import.meta.env.VITE_URL;
let timer;
import { nextTick } from "vue";

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
      console.warn("task  sent");
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
    console.warn("task list sent");
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
    console.warn("task received");
  },

  async receiveTasksLists(context, payload) {
    const { user, token } = getUserAuth(context);
    console.log(user);
    console.log(token);
    const responce = await fetch(
      `${URL}/users/${user}/tasksLists.json?auth=${token}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const responceData = await responce.json();

    console.log(responceData);
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
    console.warn("task list received");
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

      const tokenExpirationTime = 20000;
      // const tokenExpirationTime = responseData.expiresIn * 1000;
      const tokenExpirationDate = Date.now() + tokenExpirationTime;

      console.log(tokenExpirationTime);

      localStorage.setItem("refreshToken", responseData.refreshToken);
      localStorage.setItem("userId", responseData.localId);
      localStorage.setItem("tokenExpirationDate", tokenExpirationDate);

      timer = setTimeout(() => {
        context.dispatch("logOut");
      }, tokenExpirationTime);

      console.log(responseData);

      context.commit("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
        refreshToken: responseData.refreshToken,
        // tokenExpiration:tokenExpirationTime,
        tokenExpirationDate: tokenExpirationDate,
      });
    } catch (error) {
      console.log(error.message);
      console.error("API Error:", error.message);
      throw error;
    }
  },

  async tryLogin(context) {
    console.warn("tryLogin called");
    const userId = localStorage.getItem("userId");
    const refreshToken = localStorage.getItem("refreshToken");
    const tokenExpirationDate = localStorage.getItem("tokenExpirationDate");

    const tokenExpiration = +tokenExpirationDate - Date.now();
    if (tokenExpiration < 0) {
      return;
    }

    await context.dispatch("getNewTokens", { refreshToken, userId });

    const newTokenExpirationDate = localStorage.getItem("tokenExpirationDate");
    const newTokenExpiration = +newTokenExpirationDate - Date.now();
    console.log("getNewTokens done");

    timer = setTimeout(() => {
      context.dispatch("logOut");
    }, newTokenExpiration);
    console.warn(timer);

    console.log(refreshToken, userId, tokenExpirationDate);
    if (refreshToken && userId) {
      context.commit("setUser", {
        refreshToken: refreshToken,
        userId: userId,
        tokenExpirationDate: tokenExpirationDate,
      });
    } else {
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

  async getNewTokens(context, payload) {
    console.warn("getNewTokens called");
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
      console.log(responseData);
      const error =
        new Error(responseData.error?.message) || "Failed to authenticate!";
      console.log(responseData.error.message);
      throw error;
    }

    console.log(responseData);

    // const tokenExpirationDate = Date.now() + responseData.expires_in * 1000;
    const tokenExpirationDate = Date.now() + 20000;
    console.log(payload.userId);
    context.commit("setUser", {
      token: responseData.id_token,
      userId: payload.userId,
      refreshToken: responseData.refresh_token,
      tokenExpirationDate: tokenExpirationDate,
    });
    console.log(context.state.userId);

    localStorage.setItem("refreshToken", responseData.refresh_token);
    localStorage.setItem("tokenExpirationDate", tokenExpirationDate);
  },
};

function getUserAuth(context) {
  console.warn("getUserAuth called");
  const user = context.getters.getUserId;
  const token = context.getters.getToken;
  console.log(user);
  console.log(token);

  if (!user || !token) {
    throw new Error("User not authenticated");
  }

  return { user, token };
}
