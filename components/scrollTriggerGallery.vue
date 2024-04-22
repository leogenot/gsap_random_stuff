<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

function setup(wheel, images) {
  let radius = wheel.offsetWidth / 2
  let center = wheel.offsetWidth / 2
  let total = images.length
  let slice = (2 * Math.PI) / total

  images.forEach((item, i) => {
    let angle = i * slice

    let x = center + radius * Math.sin(angle)
    let y = center - radius * Math.cos(angle)

    gsap.set(item, {
      rotation: angle + '_rad',
      xPercent: -50,
      yPercent: -50,
      x: x,
      y: y,
    })
  })
}

onMounted(() => {
  let wheel = document.querySelector('.wheel')
  let images = gsap.utils.toArray('.wheel__card')
  gsap.to('.wheel', {
    rotate: () => -360,
    ease: 'none',
    duration: images.length,
    scrollTrigger: {
      start: 0,
      end: 'max',
      scrub: 1,
      snap: 1 / images.length,
      invalidateOnRefresh: true,
    },
  })
  setup(wheel, images)
  if (process.client) {
    window.addEventListener('resize', setup(wheel, images))
  }
})
</script>

<template>
  <div class="scroll-trigger-gallery">
    <section class="slider-section">
      <div class="wheel">
        <div class="wheel__card" v-for="(item, index) in 20" :key="item">
          <img
            src="https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss">
body {
  padding: 0;
  margin: 0;
  height: 600vh;
  width: 100vw;
  background: #90836a;
  color: #000;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

h1 {
  font-size: 8vw;
  font-family: 'Neue World Ultralight';
  font-weight: lighter;
  text-align: center;
}

.slider-section {
  height: 22vh;
  bottom: 0;
  position: fixed;
  width: 100%;
}

.wheel {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300vw;
  height: 300vw;
  max-width: 2000px;
  max-height: 2000px;
}

.wheel__card {
  position: absolute;
  top: 0;
  left: 0;
  width: 6%;
  max-width: 200px;
  aspect-ratio: 1 / 1;
  cursor: pointer;
}

img {
  width: 100%;
  pointer-events: none;
  z-index: 999;
  cursor: pointer;
}

.scroll-down-icon {
  position: fixed;
  top: 4em;
  right: 2em;
  transform: rotate(90deg);
}
.scroll-down-icon img {
  width: 50px;
}

.scroll-down {
  font-family: 'Neue World Ultralight';
  position: fixed;
  top: 3em;
  left: 2em;
  color: #000;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 20px;
  overflow: visible;
}
</style>
