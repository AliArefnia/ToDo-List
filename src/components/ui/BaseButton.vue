<template>
  <button
    class="bg-white text-black ml-4 rounded-md hover:bg-gray-300 active:bg-gray-300 px-2 py-3"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  font: inherit;
  /* padding: 0.5rem 2rem; */
  cursor: pointer;
}
</style>
