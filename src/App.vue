<script>
import { RouterLink, RouterView } from "vue-router";

const body = document.querySelector("body");

export default {
  data() {
    return {
      notNavPage: true,
      route: "route",
    };
  },

  watch: {
    "$route.name"(newRouteName) {
      this.notNavPage = newRouteName !== "navigator";
      console.log("Route name changed:", newRouteName);
      if (newRouteName === "navigator") {
        this.route = "route";
        body.classList = "bg-black lg:bg-priamry";
      } else {
        this.route = "nav";
        body.classList = "bg-priamry lg:bg-black";
      }
    },
  },
};
</script>

<template>
  <div
    class="text-white m-0 w-full flex rounded-2xl overflow-hidden"
    :class="{
      'bg-black': !this.notNavPage,
      'bg-priamry': this.notNavPage,
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
      <RouterView
        class="flex flex-col w-full p-6 pt-0 overflow-auto"
        v-slot="slotProps"
      >
        <transition :name="this.route" mode="out-in">
          <component :is="slotProps.Component"></component>
        </transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
.route-enter-active,
.route-leave-active {
  transition: all 0.2s ease-out;
}
.route-enter-from {
  transform: translateX(-100%) scaleX(0.95);
}
.route-leave-to {
  transform: translateX(100%) scaleX(0.95);
}
.route-enter-to,
.route-leave-from {
  transform: translateX(0) scaleX(1);
}

.nav-enter-active,
.nav-leave-active {
  transition: all 0.2s ease-out;
}
.nav-enter-from {
  transform: translateX(100%) scaleX(0.95);
}
.nav-leave-to {
  transform: translateX(-100%) scaleX(0.95);
}
.nav-enter-to,
.nav-leave-from {
  transform: translateX(0) scaleX(1);
}
</style>
