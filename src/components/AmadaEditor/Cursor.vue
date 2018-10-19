<template>
  <span class="cursor-container">
    <div class="animate-flicker cursor"  ></div>
  </span>
</template>
<script>
export default {
  name: "amada-cursor"
};
</script>
<style lang="scss">
.cursor-container {
  position: relative;
}

.cursor {
  position: absolute;
  display: inline-block;
  width: 10.2594px;
  height: 22px;
  left: 0 !important;
  top: 0;
}
</style>
