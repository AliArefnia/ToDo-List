<script>
import { RouterLink, RouterView } from "vue-router";
import navigation from "@/components/navigation.vue";
import Tasks from "./components/Tasks.vue";

export default {
  data() {
    return {
      notNavPage: true,
    };
  },

  watch: {
    "$route.name"(newName) {
      this.notNavPage = newName !== "navigator";
      console.log("Route name changed:", newName);
    },
  },
};
</script>

<template>
  <div
    class="text-white m-0 w-full flex rounded-2xl overflow-hidden"
    :class="{
      'bg-black': !this.notNavPage,
      'bg-priamry': this.notNavPage && this.setBcakGround,
    }"
  >
    <div class="flex w-full flex-col">
      <header class="px-6 py-4">
        <RouterLink v-if="notNavPage" to="/navigator" class="flex w-fit">
          <span class="flex items-center hover:brightness-150 w-fit">
            <ArrowLeftFromLine
              size="30"
              class="text-neutral-300 mr-2"
            ></ArrowLeftFromLine>
            <p class="text-lg text-neutral-300">Lists</p>
          </span></RouterLink
        >
      </header>

    <!-- <RouterView -->
    <RouterView class="flex flex-col w-full p-6 overflow-auto"></RouterView>
  </div>
</template>

<style scoped></style>
