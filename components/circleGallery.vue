<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

const setupRotation = () => {
  console.log('rotation setup')
}
onMounted(() => {
  const gallery = document.querySelector('.gallery')
  const previewImage = document.querySelector('.preview-img img')

  document.addEventListener('mousemove', function (event) {
    const x = event.clientX
    const y = event.clientY

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    const percentX = (x - centerX) / centerX
    const percentY = (y - centerY) / centerY

    const rotateX = 55 + percentY * 2
    const rotateY = percentX * 2

    gsap.to(gallery, {
      duration: 1,
      ease: 'power2.out',
      rotateX: rotateX,
      rotateY: rotateY,
      overwrite: 'auto',
    })
  })

  for (let i = 0; i < 150; i++) {
    const item = document.createElement('div')
    item.className = 'item'
    const img = document.createElement('img')
    img.src =
      'https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D'
    // img.src = './assets/img' + ((i % 15) + 1) + '.jpg'
    item.appendChild(img)
    gallery.appendChild(item)
  }

  const items = document.querySelectorAll('.item')
  const numberOfItems = items.length
  const angleIncrement = 360 / numberOfItems

  items.forEach((item, index) => {
    gsap.set(item, {
      rotationY: 90,
      rotationZ: index * angleIncrement - 90,
      transformOrigin: '50% 400px',
    })

    item.addEventListener('mouseover', function () {
      const imgInsideItem = item.querySelector('img')
      previewImage.src = imgInsideItem.src

      gsap.to(item, {
        x: 10,
        z: 10,
        y: 10,
        ease: 'power2.out',
        durtion: 0.5,
      })
    })

    item.addEventListener('mouseout', function () {
      previewImage.src =
        'https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D'
      gsap.to(item, {
        x: 0,
        y: 0,
        z: 0,
        ease: 'power2.out',
        durtion: 0.5,
      })
    })
  })

  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 2,
    onRefresh: setupRotation,
    onUpdate: self => {
      const rotationProgress = self.progress * 360 * 1
      items.forEach((item, index) => {
        const currentAngle = index * angleIncrement - 90 + rotationProgress
        gsap.to(item, {
          rotationZ: currentAngle,
          duration: 1,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      })
    },
  })
})
</script>

<template>
  <div class="circle-gallery">
    <div class="preview-img">
      <img
        src="https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D"
        alt=""
      />
    </div>

    <div class="container">
      <div class="gallery"></div>
    </div>
  </div>
</template>

<style lang="postcss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 1000vh;
  font-family: 'Circular Std', sans-serif;
  background: #ffffff;
}

nav,
footer {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 2em;
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

nav {
  top: 0;
}

footer {
  bottom: 0;
}

.container {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  perspective: 1500px;
}

.gallery {
  position: absolute;
  top: 19%;
  left: 49%;
  transform-style: preserve-3d;
  transform: translateX(-50%) rotateX(55deg);
}

.item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45px;
  height: 60px;
  background: #b0b0b0;
  margin: 10px;
  transform-style: preserve-3d;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-img {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 200px;
  overflow: hidden;
  z-index: 0;
}
</style>
