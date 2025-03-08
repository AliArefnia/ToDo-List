<script>
import { RouterLink, RouterView } from "vue-router";

const body = document.querySelector("body");

export default {
  data() {
    return {
      state: { notNavPage: true },
      route: "route",
    };
  },

  provide() {
    return {
      state: this.state,
    };
  },

  watch: {
    "$route.name"(newRouteName) {
      newRouteName === "navigator"
        ? (this.state.notNavPage = false)
        : (this.state.notNavPage = true);
      console.log("Route name changed:", newRouteName);
      if (newRouteName === "navigator") {
        this.route = "route";
        body.classList = "bg-priamry";
      } else {
        this.route = "nav";
        body.classList = "bg-black";
      }
    },
    "state.notNavPage"(newNav) {
      if (newNav === false) {
        this.route = "route";
        body.classList = "bg-priamry";
      }
      // else {
      //   this.route = "nav";
      //   body.classList = "bg-black";
      // }
    },

    "$store.getters.isAuthenticated"(newValue, oldValue) {
      if (!newValue) {
        this.$router.replace("/login");
      }
    },
  },

  created() {
    this.$store.dispatch("tryLogin");
  },
};
</script>

<template>
  <div class="text-white m-0 w-full flex rounded-2xl overflow-hidden">
    <div class="flex w-full flex-col">
      <header
        class="pr-6 pl-2 py-4"
        v-if="
          this.$route.name !== 'login' && this.$route.name !== 'ResetPassword'
        "
      >
        <RouterLink v-if="state.notNavPage" to="/navigator" class="flex w-fit">
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
        class="flex flex-col w-full lg:p-6 p-2 pt-0 overflow-auto"
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
