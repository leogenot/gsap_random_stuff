<script setup>
useHead({
  script: [
    {
      src: 'https://unpkg.com/@splinetool/viewer@1.3.1/build/spline-viewer.js',
      type: 'module',
      async: false,
    },
  ],
})
const spline = ref(null)
</script>

<template>
  <div class="page">
    <client-only>
      <spline-viewer
        class="spline"
        ref="spline"
        url="https://prod.spline.design/iahI0F02WIG6sgaB/scene.splinecode"
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
