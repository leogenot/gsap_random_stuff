<script setup>
const spline = ref(null)
</script>

<template>
  <div class="page">
    <client-only>
      <spline-canvas
        class="spline"
        ref="spline"
        url="https://prod.spline.design/df8JfXNqQfOi5qVq/scene.splinecode"
      />
    </client-only>
  </div>
</template>

<style lang="postcss">
.page {
  height: 400vh;
  .spline {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 50vh;
    width: 50vw;
  }
}
</style>
