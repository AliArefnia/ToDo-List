import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/TasksSections.vue";
import Navigation from "@/components/navigation.vue";
import TasksLists from "@/components/TasksLists.vue";
import TaskItems from "@/components/TaskItems.vue";
import AllTasks from "@/components/AllTasks.vue";
import ImportantTasks from "@/components/ImportantTasks.vue";
import TasksSections from "@/components/TasksSections.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "home",
      component: TasksSections,
    },
    {
      path: "/navigator",
      name: "navigator",
      component: Navigation,
      alias: "/",
    },
    {
      path: "/importantTasks",
      name: "importantTasks",
      component: ImportantTasks,
    },
    {
      path: "/taskLists/:taskListItem",
      name: "taskListItem",
      component: TaskItems,
      props: true,
    },
    { path: "/AllTasks", name: "AllTasks", component: AllTasks },
  ],
});

export default router;
