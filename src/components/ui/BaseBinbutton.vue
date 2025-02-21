<template>
  <button
    class="h-7 mx-2 lg:mx-3 translate-0.5 hover:drop-shadow-[0_0_5px_rgba(128,0,0,1)]"
  >
    <slot>
      <Trash2 color="red" :size="24" />
    </slot>
  </button>
</template>

<script></script>
<style scoped>
button {
  font: inherit;
  /* padding: 0.5rem 2rem; */
  cursor: pointer;
}
</style>
