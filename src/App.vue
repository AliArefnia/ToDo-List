<script setup>
import { RouterLink, RouterView } from "vue-router";
import navigation from "@/components/navigation.vue";
</script>

<template>
  <div class="flex w-full">
    <navigation class="w-1/3 p-6 border-r-2 hidden lg:block"> </navigation>
    <RouterView
      class="flex flex-col w-full lg:w-2/3 p-6 overflow-auto"
    ></RouterView>
  </div>
  <header></header>
</template>

<style scoped></style>
