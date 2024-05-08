<template>
  <div class="loader" ref="loader">
    <div class="logo-wrapper">
      <NuxtIcon ref="logo" class="logo" name="logo" />
    </div>
    <!-- <NuxtIcon ref="logo" class="logo" name="logo-drop" /> -->
    <NuxtIcon ref="drop" class="drop" name="drop" />
  </div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
const loader = ref(null)
const loaderTl = gsap.timeline({})

onMounted(() => {
  const logo = loader.value.querySelector('.logo')
  const logoWrapper = loader.value.querySelector('.logo-wrapper')
  const letterA = loader.value.querySelector('.a')
  const letterABoundingBox = letterA.getBoundingClientRect()
  console.log(letterABoundingBox)

  const drop = loader.value.querySelector('.drop')
  const dropHigh = drop.querySelector('.drop-high')
  const dropLow = drop.querySelector('.drop-low')

  loaderTl.to(logo, {
    opacity: 1,
    duration: 1,
    ease: 'power3.inOut',
  })
  loaderTl.set(drop, {
    position: 'fixed',
    top: letterABoundingBox.top,
    left: letterABoundingBox.left,
    width: letterABoundingBox.width,
  })
  loaderTl.set(dropLow, {
    translateY: '-100%',
  })
  loaderTl.to(drop, {
    opacity: 1,
    duration: 0.5,
    ease: 'power3.inOut',
  })
  loaderTl.to(letterA, {
    opacity: 0,
    duration: 0.5,
    ease: 'power3.inOut',
  })
  loaderTl.to(logo, {
    translateY: '100%',
    duration: 0.5,
    ease: 'power3.inOut',
  })
  loaderTl.to(
    dropLow,
    {
      opacity: 1,
      translateY: 0,
      duration: 0.5,
      ease: 'power3.inOut',
    },
    '<'
  )
  loaderTl.to(drop, {
    left: '50%',
    translateX: '-50%',
    duration: 0.7,
  })
  loaderTl.to(drop, {
    scale: 50,
    duration: 1.2,
  })
})
</script>

<style lang="postcss">
.loader {
  background-color: #e4d7d0;
  width: 100vw;
  height: 100vh;

  .logo-wrapper {
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: auto;
    width: 80%;
  }

  .logo {
    opacity: 0;
    display: block;
    height: 100%;
    width: 100%;
    svg {
      width: 100%;
      height: 100%;
      position: relative;
    }
  }

  .drop {
    pointer-events: none;
    display: block;
    opacity: 0;
    /* height: 10vh; */
    width: auto;
    svg {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .drop-low {
      opacity: 0;
    }
  }
}
</style>
