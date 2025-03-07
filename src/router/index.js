import { createRouter, createWebHistory } from "vue-router";
import Navigation from "@/Pages/navigation.vue";
import TaskItems from "@/components/TaskItems.vue";
import Today from "@/Pages/Today.vue";
import Login from "@/Pages/Login.vue";
import store from "@/vuex";
import ResetPassword from "@/Pages/ResetPassword.vue";

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
      meta: { requiresAuth: true },
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
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresUnAuth: true },
    },
    {
      path: "/ResetPassword",
      name: "ResetPassword",
      component: ResetPassword,
      meta: { requiresUnAuth: true },
    },
    { path: "/:notfound(.*)", name: "notFound", redirect: "/" },
  ],
});

router.beforeEach(function (to, from, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresUnAuth && store.getters.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
