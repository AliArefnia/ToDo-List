<script>
import { RouterLink, RouterView } from "vue-router";
import navigation from "@/components/navigation.vue";

export default {
  data() {
    return {
      notNavPage: true,
    };
  },

  watch: {
    // Fixed version 1: Watch specific property
    "$route.name"(newName) {
      this.notNavPage = newName !== "navigator";
      console.log("Route name changed:", newName); // Now this will work
    },
  },
};
</script>

<template>
  <div class="flex w-full flex-col">
    <header class="px-6 py-4">
      <RouterLink v-if="notNavPage" to="navigator" class="flex w-fit">
        <span class="flex items-center hover:brightness-150 w-fit">
          <ArrowLeftFromLine
            size="30"
            class="text-neutral-300 mr-2"
          ></ArrowLeftFromLine>
          <p class="text-lg text-neutral-300">Lists</p>
        </span></RouterLink
      >
    </header>
    <!-- <navigation class="w-1/3 p-6 border-r-2 hidden lg:block"></navigation> -->
    <!-- <RouterView
      class="flex flex-col w-full lg:w-2/3 p-6 overflow-auto"
    ></RouterView> -->
    <RouterView class="flex flex-col w-full p-6 overflow-auto"></RouterView>
  </div>
  <header></header>
</template>

<style scoped></style>
