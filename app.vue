<template>
  <nuxt-layout>
    <div class="mouse"></div>
    <nuxt-page />
  </nuxt-layout>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)
const route = useRoute()
watch(
  () => route.path,
  () => {
    console.log('route changed')
    ScrollTrigger.refresh()
  }
)

onMounted(() => {
  const isTouchDevice = 'ontouchstart' in window
  const createCursorFollower = () => {
    const mouse = document.querySelector('.mouse')
    gsap.set(mouse, { xPercent: -50, yPercent: -50 })
    let xTo = gsap.quickTo(mouse, 'x', { duration: 0.7, ease: 'power3' }),
      yTo = gsap.quickTo(mouse, 'y', { duration: 0.7, ease: 'power3' })
    window.addEventListener('mousemove', e => {
      const { target, x, y } = e
      const isTargetLinkOrBtn =
        target?.closest('a') ||
        target?.closest('button') ||
        target?.closest('.svg-card') ||
        target?.closest('.magnetic')

      xTo(e.clientX)
      yTo(e.clientY)
      gsap.to(mouse, {
        duration: 0.7,
        ease: 'power2',
        opacity: isTargetLinkOrBtn ? 0.6 : 1,
        scale: isTargetLinkOrBtn ? 3 : 1,
      })
    })

    document.addEventListener('mouseleave', e => {
      gsap.to(mouse, {
        duration: 0.7,
        opacity: 0,
      })
    })
  }
  if (!isTouchDevice) {
    createCursorFollower()
  }
})
</script>

<style lang="postcss">
.mouse {
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: #e4d7d0;
  mix-blend-mode: difference;
  opacity: 0;
  z-index: 10000;
  user-select: none;
  pointer-events: none;
}
</style>
