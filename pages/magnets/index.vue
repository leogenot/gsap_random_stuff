<!-- <template>
  <div class="section">
    <div class="container">
      <div class="gallery gallery-large">
        <div class="item magnetic" v-for="item in 10" :key="'large-' + item">
          <img
            src="https://images.unsplash.com/photo-1716141456685-e9714cdd2808?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE4fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D"
            alt=""
          />
        </div>
      </div>
      <div class="gallery gallery-small">
        <div class="item magnetic" v-for="item in 10" :key="'small-' + item">
          <img
            src="https://images.unsplash.com/photo-1716141456685-e9714cdd2808?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE4fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'

onMounted(() => {
  const largeGallery = document.querySelector('.gallery-large')
  const smallGallery = document.querySelector('.gallery-small')
  const largeItems = largeGallery.querySelectorAll('.item')
  const smallItems = smallGallery.querySelectorAll('.item')
  const largeNumberOfItems = largeItems.length
  const smallNumberOfItems = smallItems.length

  // Large Gallery Parameters
  const largeRadius = window.innerHeight / 2.5
  const largeAngleIncrement = (2 * Math.PI) / largeNumberOfItems
  const largeCenterX = largeGallery.offsetWidth / 2
  const largeCenterY = largeGallery.offsetHeight / 2

  // Small Gallery Parameters
  const smallRadius = 100 // Adjust as needed
  const smallAngleIncrement = (2 * Math.PI) / smallNumberOfItems
  const smallCenterX = smallGallery.offsetWidth / 2
  const smallCenterY = smallGallery.offsetHeight / 2

  const tl = gsap.timeline()

  // Positioning and Animation for Large Gallery
  largeItems.forEach((item, index) => {
    const angle = index * largeAngleIncrement
    const x = largeCenterX + largeRadius * Math.cos(angle)
    const y = largeCenterY + largeRadius * Math.sin(angle)

    gsap.set(item, { scale: 0 })

    tl.to(
      item,
      {
        left: x + 'px',
        top: y + 'px',
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 1,
      },
      index * 0.1
    )
  })

  // Positioning and Animation for Small Gallery
  smallItems.forEach((item, index) => {
    const angle = index * smallAngleIncrement
    const x = smallCenterX + smallRadius * Math.cos(angle)
    const y = smallCenterY + smallRadius * Math.sin(angle)

    gsap.set(item, { scale: 0 })

    tl.to(
      item,
      {
        left: x + 'px',
        top: y + 'px',
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 1,
      },
      index * 0.1
    )
  })

  // Magnet Effect
  const strength = 50

  const applyMagnetEffect = magnet => {
    magnet.addEventListener('mousemove', moveMagnet)
    magnet.addEventListener('mouseout', function (event) {
      gsap.to(event.currentTarget, {
        x: 0,
        y: 0,
        ease: 'power4.easeOut',
        duration: 1,
      })
    })
  }

  const moveMagnet = event => {
    const magnetButton = event.currentTarget
    const bounding = magnetButton.getBoundingClientRect()

    gsap.to(magnetButton, {
      x:
        ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
        strength,
      y:
        ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
        strength,
      ease: 'power4.easeOut',
      duration: 1,
    })
  }

  largeItems.forEach(applyMagnetEffect)
  smallItems.forEach(applyMagnetEffect)
})
</script>

<style lang="postcss">
.section {
  height: 100vh;
  position: relative;
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .gallery {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .item {
    position: absolute;
    width: 70px;
    height: 100px;
    background: #b0b0b0;
    margin: 10px;
  }

  .gallery-large {
    z-index: 2; /* Ensure large gallery items are on top */
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style> -->

<template>
  <div class="section">
    <div class="container">
      <div class="gallery">
        <div class="item magnetic" v-for="item in 20" :key="item">
          <img
            src="https://images.unsplash.com/photo-1716141456685-e9714cdd2808?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE4fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

onMounted(() => {
  const items = document.querySelectorAll('.item')
  const container = document.querySelector('.container')
  const numberOfItems = items.length
  const angleIncrement = (2 * Math.PI) / numberOfItems
  const radius = window.innerHeight / 2.5
  let isGalleryOpen = false

  const centerX = container.offsetWidth / 2
  const centerY = container.offsetHeight / 2

  const tl = gsap.timeline()

  items.forEach(function (item, index) {
    const angle = index * angleIncrement
    const initialRotation = (angle * 180) / Math.PI - 90
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)

    gsap.set(item, { scale: 0 })

    tl.to(
      item,
      {
        left: x + 'px',
        top: y + 'px',
        // rotation: initialRotation,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 1,
      },
      index * 0.1
    )
  })

  var strength = 50

  items.forEach(magnet => {
    magnet.addEventListener('mousemove', moveMagnet)
    magnet.addEventListener('mouseout', function (event) {
      gsap.to(event.currentTarget, {
        x: 0,
        y: 0,
        ease: 'power4.easeOut',
        duration: 1,
      })
    })
  })

  function moveMagnet(event) {
    var magnetButton = event.currentTarget
    var bounding = magnetButton.getBoundingClientRect()

    gsap.to(magnetButton, {
      x:
        ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
        strength,
      y:
        ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
        strength,
      ease: 'power4.easeOut',
      duration: 1,
    })
  }
})
</script>

<style lang="postcss">
.section {
  height: 100vh;
  position: relative;
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 100px;
    background: #b0b0b0;
    margin: 10px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
