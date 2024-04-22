<script setup>
import { gsap } from 'gsap/all'
onMounted(() => {
  const trails = document.querySelectorAll('.trail')
  const smoothPointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  }
  const totalPointsArray = [40, 35, 30, 25, 20, 15, 10]

  window.addEventListener('mousemove', event => {
    gsap.to(smoothPointer, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.5,
      ease: 'power2.out',
    })
  })

  function updatePath() {
    trails.forEach((path, index) => {
      let points = path.points || []
      points.unshift({ ...smoothPointer })
      while (points.length > totalPointsArray[index]) {
        points.pop()
      }
      path.points = points

      if (points.length > 1) {
        let d = `M ${points[0].x} ${points[0].y}`
        for (let i = 1; i < points.length; i++) {
          d += ` L ${points[i].x} ${points[i].y}`
        }
        path.setAttribute('d', d)
      }
    })

    requestAnimationFrame(updatePath)
  }

  updatePath()
})
</script>

<template>
  <div class="mouse-trail">
    <svg><path d="" class="trail" style="stroke: #fefa02"></path></svg>
    <svg><path d="" class="trail" style="stroke: #9aa8e1"></path></svg>
    <svg><path d="" class="trail" style="stroke: #f57faa"></path></svg>
    <svg><path d="" class="trail" style="stroke: #fb2832"></path></svg>
    <svg><path d="" class="trail" style="stroke: #559ce2"></path></svg>
    <svg><path d="" class="trail" style="stroke: #e27b63"></path></svg>
    <svg><path d="" class="trail" style="stroke: #e82c31"></path></svg>
  </div>
</template>

<style lang="postcss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #ffb503;
}

svg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

path {
  fill: none;
  stroke-width: 50;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
