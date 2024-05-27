<template>
  <div class="floating-items">
    <div class="section-1"></div>
    <div class="section-2">
      <div
        class="item"
        v-for="item in 10"
        :key="item"
        :style="{ 'background-color': `hsl(${random(0, 360)}, 50%, 50%)` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

const random = (min, max) => {
  return Math.random() * (max - min) + min
}

onMounted(() => {
  const section2 = document.querySelector('.section-2')
  const items = gsap.utils.toArray('.item')
  let floatAnimations = []

  const initializeItems = () => {
    floatAnimations.forEach(animation => animation.kill())
    floatAnimations = []

    items.forEach(item => {
      const randomX = random(0, section2.clientWidth - 50)
      const randomY = random(0, section2.clientHeight - 50)
      gsap.set(item, {
        x: randomX,
        y: randomY,
        rotation: random(-10, 10),
      })

      const moveX = createMoveX(item)
      const moveY = createMoveY(item)
      const rotate = createRotate(item)

      floatAnimations.push(moveX, moveY, rotate)
    })
  }

  const createRotate = target => {
    return gsap.to(target, {
      rotation: random(-10, 10),
      duration: random(5, 10),
      ease: 'sine.easeInOut',
      repeat: -1,
      yoyo: true,
    })
  }

  const createMoveX = target => {
    return gsap.to(target, {
      x: `+=${random(-100, 100)}`,
      duration: random(3, 5),
      ease: 'sine.easeInOut',
      repeat: -1,
      yoyo: true,
    })
  }

  const createMoveY = target => {
    return gsap.to(target, {
      y: `+=${random(-100, 100)}`,
      duration: random(3, 5),
      ease: 'sine.easeInOut',
      repeat: -1,
      yoyo: true,
    })
  }

  section2.addEventListener('mouseenter', () => {
    floatAnimations.forEach(animation => animation.pause())
    section2.addEventListener('mousemove', onMouseMove)
  })

  section2.addEventListener('mouseleave', () => {
    section2.removeEventListener('mousemove', onMouseMove)
    items.forEach(item => {
      const randomX = random(0, section2.clientWidth - 50)
      const randomY = random(0, section2.clientHeight - 50)
      gsap.to(item, {
        x: randomX,
        y: randomY,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(item, {
            x: randomX,
            y: randomY,
            rotation: random(-10, 10),
          })

          const moveX = createMoveX(item)
          const moveY = createMoveY(item)
          const rotate = createRotate(item)

          floatAnimations.push(moveX, moveY, rotate)
        },
      })
    })
  })

  const onMouseMove = event => {
    const { clientX, clientY } = event
    const rect = section2.getBoundingClientRect()
    const mouseX = clientX - rect.left
    const mouseY = clientY - rect.top

    items.forEach((item, index) => {
      gsap.to(item, {
        x: mouseX - 25,
        y: mouseY - 25,
        zIndex: index,
        delay: -index * 0.01,
        duration: 0.7,
        ease: 'power2',
      })
    })
  }

  window.addEventListener('resize', initializeItems)
  initializeItems()

  onUnmounted(() => {
    window.removeEventListener('resize', initializeItems)
    section2.removeEventListener('mouseenter', () => {
      floatAnimations.forEach(animation => animation.pause())
      section2.addEventListener('mousemove', onMouseMove)
    })
    section2.removeEventListener('mouseleave', () => {
      section2.removeEventListener('mousemove', onMouseMove)
      items.forEach(item => {
        const randomX = random(0, section2.clientWidth - 50)
        const randomY = random(0, section2.clientHeight - 50)
        gsap.to(item, {
          x: randomX,
          y: randomY,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(item, {
              x: randomX,
              y: randomY,
              rotation: random(-10, 10),
            })

            const moveX = createMoveX(item)
            const moveY = createMoveY(item)
            const rotate = createRotate(item)

            floatAnimations.push(moveX, moveY, rotate)
          },
        })
      })
    })
  })
})
</script>

<style lang="postcss">
.floating-items {
  .section-1 {
    height: 60vh;
    background-color: wheat;
  }
  .section-2 {
    position: relative;
    overflow: hidden;
    height: 100vh;
    background-color: gray;

    .item {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
  }
}
</style>
