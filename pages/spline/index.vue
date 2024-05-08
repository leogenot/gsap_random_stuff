<script setup>
const spline = ref(null)
const updateLoaded = () => {
  console.log('Loaded spline')
}
const handleSplineError = () => {
  console.log('Error spline')
}
</script>

<template>
  <client-only>
    <spline-canvas
      class="spline"
      ref="spline"
      url="https://prod.spline.design/y8EZ991SIP1GwVZy/scene.splinecode"
    />
    <!-- @loaded="updateLoaded"
      @error="handleSplineError" -->
  </client-only>
</template>

<style lang="postcss">
.module-spline {
}
</style>
