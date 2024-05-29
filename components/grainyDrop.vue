<template>
  <svg
    id="dropSvg"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 404 606"
  >
    <defs>
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.5"
          seed="1"
          numOctaves="1"
          result="turbulence"
        ></feTurbulence>

        <feComposite
          operator="in"
          in="turbulence"
          in2="SourceAlpha"
          result="composite"
        />
        <feColorMatrix in="composite" type="luminanceToAlpha" />
        <feBlend in="SourceGraphic" in2="composite" mode="color-burn" />
      </filter>
    </defs>
    <clipPath id="clip">
      <path
        d="M387.9,330.4c23.1,50.8,20.3,102.6-1.5,153.1-28.2,65.3-78.2,105.4-147.9,118.6-61.7,11.7-118.2-2.7-166.4-43.6C21,515.1-1.8,458.7.1,392.1c.8-25.9,8.5-50.3,20.1-73.3C51.4,256.6,148.5,65.4,172.6,18.5c12.2-23.8,45.9-23.7,58,.1,0,0,139.4,272.4,157.2,311.9Z"
      />
    </clipPath>

    <foreignObject
      width="100%"
      height="100%"
      clip-path="url(#clip)"
      filter="url(#noise)"
    >
      <div class="drop-inner" />
    </foreignObject>
  </svg>
</template>

<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'

onMounted(() => {
  let gradient = document.querySelector('.drop-inner')
  let centerX

  // Get the center of the SVG
  function getCenter() {
    const svgRoot = document.querySelector('#dropSvg')
    const rect = svgRoot.getBoundingClientRect()
    centerX = rect.left + rect.width / 2
  }

  // Calculate angle between mouse and center of SVG based on x-coordinate only
  function calculateRotationAngle(event) {
    const mouseX = event.clientX
    const relativeX = mouseX - centerX
    const angle = relativeX * 0.1 // Adjust rotation speed as needed
    return angle
  }

  // Smoothly animate the gradient's rotation using GSAP
  window.addEventListener('mousemove', event => {
    getCenter()
    const angle = calculateRotationAngle(event)
    gsap.to(gradient, {
      rotation: `${-angle}deg`,
      duration: 2,
      ease: 'power2',
    })
  })

  // Initialize center coordinates
  getCenter()
})
</script>

<style scoped>
#dropSvg {
  .drop-inner {
    display: flex;
    border: 1px solid red;
    width: 400%;
    height: 400%;
    position: absolute;
    top: -210%;
    left: 50%;
    transform: translateX(-50%);
    background: conic-gradient(#223539, #5d939e, #223539, #213438);
    transform-origin: 50% 50%;
  }
}
</style>
