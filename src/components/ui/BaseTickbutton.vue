<template>
  <button class="h-7 mx-2 lg:mx-3 cursor-pointer">
    <slot>
      <CircleCheckBig
        class="mt-[5px]"
        :class="{ buttonDone: !taskIsDone, buttonNotDone: taskIsDone }"
      ></CircleCheckBig>
    </slot>
  </button>
</template>

<script>
export default {
  props: ["taskIsDone"],
};
</script>
<style scoped>
.buttonDone {
  border-radius: 100%;
  /* width: 22px;
  height: 22px; */
  /* border: 1px solid gray; */
}
.buttonDone:hover {
  border: 1px solid green;
  background-color: rgba(0, 128, 0, 0.597);
  /* box-shadow: 0 0 5px 1px green; */
}
.buttonNotDone {
  background-color: rgb(0, 58, 0);
  border-radius: 100%;
  width: 22px;
  height: 22px;
  /* border: 1px solid gray; */
}
.buttonNotDone:hover {
  background-color: #800000;
  border: 1px solid #800000;
  /* box-shadow: 0 0 5px 1px #800000; */
}
</style>
