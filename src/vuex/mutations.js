export default {
  clearTasks(state) {
    state.tasks = [];
  },
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
};
