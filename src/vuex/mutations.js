export default {
  clearTasks(state) {
    state.tasks = [];
  },
  setTasks(state, task) {
    state.tasks = task;
  },
  setTasksLists(state, tasksList) {
    state.taskLists = tasksList;
  },
  addNewTask(state, task) {
    state.tasks.unshift(task);
  },
  addNewList(state, taskList) {
    state.taskLists.unshift(taskList);
  },
  removeTask(state, taskId) {
    state.tasks = state.tasks.filter((task) => task.id !== taskId);
  },
  removeTaskList(state, taskListId) {
    state.taskLists = state.taskLists.filter(
      (taskList) => taskList.id !== taskListId
    );
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
  setUser(state, payload) {
    state.userId = payload.userId;
    state.token = payload.token;
    state.refreshToken = payload.refreshToken;
    state.tokenExpirationDate = payload.tokenExpirationDate;
  },
  SetAuthenticated(state, token) {
    state.token = token;
  },
  setNewTokensReceived(state, payload) {
    state.newTokensReceived = payload;
  },
};
