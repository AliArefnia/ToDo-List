import { createRouter, createWebHistory } from "vue-router";
import Navigation from "@/Pages/navigation.vue";
import TaskItems from "@/components/TaskItems.vue";
import Today from "@/Pages/Today.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/today",
      name: "today",
      component: Today,
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
      component: () => import("@/Pages/ImportantTasks.vue"),
    },
    {
      path: "/taskLists/:taskListItem",
      name: "taskListItem",
      component: TaskItems,
      props: true,
    },
    {
      path: "/AllTasks",
      name: "AllTasks",
      component: () => import("@/Pages/AllTasks.vue"),
    },
  ],
});

export default router;
