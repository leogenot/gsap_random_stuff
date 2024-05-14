<script setup>
import { gsap } from 'gsap/all'
const background = ref(null)
const card = ref(null)

const mouseX = ref(0)
const mouseY = ref(0)

function handleMouseMove(event) {
  const items = background.value.querySelectorAll('.logo')
  const cardRect = card.value.getBoundingClientRect()

  mouseX.value = event.clientX - cardRect.left - cardRect.width / 2
  mouseY.value = event.clientY - cardRect.top - cardRect.height / 2

  items.forEach((item, index) => {
    const animationFactor = items[index].getAttribute('data-parallax')
    gsap.to(item, {
      x: -mouseX.value * animationFactor,
      y: -mouseY.value * animationFactor,
      duration: 0.75,
    })
  })
}
</script>

<template>
  <div class="svg-card" ref="card" @mousemove="handleMouseMove">
    <div class="background" ref="background">
      <NuxtImg
        ref="logo"
        class="logo torus"
        name="drop"
        src="/images/sphere.png"
        data-parallax="0.01"
      />
      <NuxtImg
        ref="logo"
        class="logo sphere"
        name="drop"
        data-parallax="0.08"
        src="/images/torus.png"
      />
      <NuxtImg
        ref="logo"
        class="logo zigzag"
        name="drop"
        data-parallax="0.03"
        src="/images/zigzag.png"
      />
    </div>
  </div>
</template>

<style lang="postcss">
.svg-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #e4d7d0;
  height: 50vh;
  aspect-ratio: 1/1.5;
  overflow: hidden;
  border-radius: 3rem;

  transition: background-color 0.4s ease-in-out;

  &:hover {
    background-color: #213438;
  }
  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    .logo {
      color: #213438;
      position: absolute;
      transform: translateX(var(--rotate-x)) translateY(var(--rotate-y));
      transform-style: preserve-3d;
      will-change: transform;
      mix-blend-mode: hard-light;

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
