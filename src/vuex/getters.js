export default {
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

  isAuthenticated(state) {
    return !!state.refreshToken;
  },
  getUserId(state) {
    return state.userId;
  },
  getToken(state) {
    return state.token;
  },
};
