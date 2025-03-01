import { createRouter, createWebHistory } from "vue-router";
import Navigation from "@/Pages/navigation.vue";
import TaskItems from "@/components/TaskItems.vue";
import Today from "@/Pages/Today.vue";
import Login from "@/Pages/Login.vue";
import store from "@/vuex";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/today",
      name: "today",
      component: Today,
      meta: { requiresAuth: true },
    },
    {
      path: "/navigator",
      name: "navigator",
      component: Navigation,
      alias: "/",
      meta: { requiresAuth: true },
    },
    {
      path: "/importantTasks",
      name: "importantTasks",
      meta: { requiresAuth: true },
      component: () => import("@/Pages/ImportantTasks.vue"),
    },
    {
      path: "/taskLists/:taskListItem",
      name: "taskListItem",
      component: TaskItems,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/AllTasks",
      name: "AllTasks",
      meta: { requiresAuth: true },
      component: () => import("@/Pages/AllTasks.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresUnAuth: true },
    },
  ],
});

router.beforeEach(function (to, from, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresUnAuth) {
    next("/");
  } else {
    next();
  }
});

export default router;
