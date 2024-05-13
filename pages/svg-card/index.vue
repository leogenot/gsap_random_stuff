<script setup>
const mouseX = ref(0)
const mouseY = ref(0)
const handleMouseMove = event => {
  const cardRect = event.target.getBoundingClientRect()
  mouseX.value = event.clientX - cardRect.left
  mouseY.value = event.clientY - cardRect.top
}
</script>

<template>
  <div class="svg-card" @mousemove="handleMouseMove">
    Mouse x : {{ mouseX }} Mouse y : {{ mouseY }}
    <div class="background">
      <NuxtIcon ref="logo" class="logo torus" name="drop" />
      <NuxtIcon ref="logo" class="logo sphere" name="drop" />
      <NuxtIcon ref="logo" class="logo zigzag" name="drop" />
    </div>
  </div>
</template>

<style lang="postcss">
.svg-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: red;
  height: 50vh;
  aspect-ratio: 1/1.5;
  overflow: hidden;

  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    .logo {
      position: absolute;
      &.torus {
        height: 30%;
        left: 50%;
        top: 10%;
        rotate: -45deg;
      }
      &.sphere {
        height: 40%;
        left: 30%;
        top: 60%;
        rotate: -10deg;
      }
      &.zigzag {
        height: 30%;
        left: 10%;
        top: 40%;
        rotate: 45deg;
      }
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
