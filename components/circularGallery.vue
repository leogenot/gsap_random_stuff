<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const items = document.querySelectorAll('.item')
  const container = document.querySelector('.container')
  const numberOfItems = items.length
  const angleIncrement = (2 * Math.PI) / numberOfItems
  const radius = 300
  let isGalleryOpen = false

  const centerX = container.offsetWidth / 2
  const centerY = container.offsetHeight / 2

  const tl = gsap.timeline()

  items.forEach(function (item, index) {
    const img = document.createElement('img')
    img.src =
      'https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D'
    //    img.src = './assets/img' + (index + 1) + '.jpg';
    item.appendChild(img)

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
        rotation: initialRotation,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 1,
      },
      index * 0.1
    )

    item.addEventListener('click', function () {
      if (!isGalleryOpen) {
        isGalleryOpen = true

        const duplicate = item.cloneNode(true)
        duplicate.style.position = 'absolute'
        container.appendChild(duplicate)

        gsap.to(
          Array.from(items).filter(i => i !== item),
          {
            scale: 0,
            duration: 0.5,
            ease: 'power2.in',
            stagger: 0.05,
          }
        )

        const endRotation =
          initialRotation > 180 ? initialRotation - 360 : initialRotation

        gsap.to([item, duplicate], {
          rotation: endRotation,
          duration: 0.0001,
          onComplete: function () {
            gsap.to([item, duplicate], {
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) scale(5)',
              duration: 1,
              ease: 'power2.out',
              delay: 1.25,
            })
          },
        })

        const closeGallery = function () {
          if (isGalleryOpen) {
            gsap.to([item, duplicate], {
              left: x + 'px',
              top: y + 'px',
              scale: 1,
              rotation: initialRotation,
              duration: 1,
              ease: 'power2.out',
              onComplete: function () {
                duplicate.remove()
                gsap.to(items, {
                  scale: 1,
                  duration: 1,
                  stagger: 0.05,
                  ease: 'power2.out',
                })
                isGalleryOpen = false
              },
            })
          }
        }

        item.addEventListener('click', closeGallery)
        duplicate.addEventListener('click', closeGallery)
      }
    })
  })
})
</script>

<template>
  <div class="container">
    <div class="gallery">
      <div class="item" v-for="item in 15" :key="item"></div>
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
  height: 100vh;
  font-family: 'Timmons NY', sans-serif;
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
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
</style>
