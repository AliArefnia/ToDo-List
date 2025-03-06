<template>
  <RouterLink
    :to="to"
    class="flex my-2 mr-2 items-center rounded-md px-4 py-2 flex-wrap"
  >
    <slot name="icons"><List class="mr-2" color="#ff2056" /></slot>
    <slot></slot>
  </RouterLink>
</template>
<script>
import { List } from "lucide-vue-next";
export default {
  components: { List },
  props: ["to"],
};
</script>
