<template>
  <div class="container">
    <div class="sticky-bar">
      <div class="item">
        <p>Filter</p>
      </div>
      <div class="item">
        <p>0</p>
      </div>
      <div class="item">
        <p>Water</p>
      </div>
    </div>

    <section class="hero">
      <img
        src="https://images.unsplash.com/photo-1714480931547-957c5e48ff1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D"
        alt=""
      />
    </section>

    <section class="clients">
      <div v-for="item in 30" class="row">
        <div class="logo">
          <p>Logo 1</p>
        </div>
        <div class="logo">
          <p>Logo 2</p>
        </div>
      </div>
    </section>

    <section class="trigger-footer">
      <img
        src="https://images.unsplash.com/photo-1714745454829-a64751d90480?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
      />
    </section>
  </div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const stickyBar = document.querySelector('.sticky-bar')
  const footerTrigger = document.querySelector('.trigger-footer')
  const footerTriggerHeight = footerTrigger.offsetHeight

  function getStickyBarCenter() {
    return stickyBar.offsetTop + stickyBar.offsetHeight / 2
  }

  document.querySelectorAll('.row').forEach(row => {
    ScrollTrigger.create({
      trigger: row,
      start: () => `top+=${getStickyBarCenter() - 550} center`,
      end: () => `top+=${getStickyBarCenter() - 450} center`,
      scrub: true,
      markers: true,
      onUpdate: self => {
        const progress = self.progress
        const maxGap = window.innerWidth < 900 ? 10 : 15
        const minGap = window.innerWidth < 900 ? 0.5 : 1
        const currentGap = minGap + (maxGap - minGap) * progress
        row.style.gap = `${currentGap}em`
      },
    })
  })

  document.querySelectorAll('.row').forEach(row => {
    ScrollTrigger.create({
      trigger: row,
      start: () => `top+=${getStickyBarCenter() - 400} center`,
      end: () => `top+=${getStickyBarCenter() - 300} center`,
      scrub: true,
      onUpdate: self => {
        const progress = self.progress
        const maxGap = window.innerWidth < 900 ? 0.5 : 1
        const minGap = window.innerWidth < 900 ? 10 : 15
        const currentGap = minGap + (maxGap - minGap) * progress
        row.style.gap = `${currentGap}em`
      },
    })
  })

  ScrollTrigger.create({
    trigger: footerTrigger,
    start: 'top bottom',
    end: () => `top+=${footerTriggerHeight - window.innerHeight} center`,
    scrub: true,
    onUpdate: self => {
      const startTop = 50
      const endTop = 92
      const newTop = startTop + (endTop - startTop) * self.progress
      stickyBar.style.top = `${newTop}%`
    },
  })

  ScrollTrigger.create({
    trigger: footerTrigger,
    start: () =>
      `top+=${footerTriggerHeight - (window.innerHeight + 100)} bottom`,
    end: 'bottom bottom',
    scrub: true,
    onUpdate: self => {
      const fontSizeStart = window.innerWidth < 900 ? 2.5 : 1.25
      const fontSizeEnd = 9
      const newFontSize =
        fontSizeStart + (fontSizeEnd - fontSizeStart) * self.progress
      stickyBar.querySelectorAll('p').forEach(p => {
        p.style.fontSize = `${newFontSize}vw`
      })
    },
  })
})

onUnmounted(() => {
  ScrollTrigger.killAll()
})
</script>

<style lang="postcss" scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

p {
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 600;
}

.sticky-bar {
  position: fixed;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  padding: 1em;
  display: flex;
  mix-blend-mode: difference;
}

.sticky-bar .item:nth-child(1),
.sticky-bar .item:nth-child(3) {
  flex: 2;
}

.sticky-bar .item:nth-child(3) {
  text-align: right;
}

.sticky-bar .item:nth-child(2) {
  flex: 1;
  text-align: center;
}

.sticky-bar .item p {
  color: #fff;
  font-size: 1.25vw;
}

section.hero {
  width: 100vw;
  height: 100vh;
}

.clients {
  width: 100%;
  padding: 10em 1em;
  background: #fff;
}

.row {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1em;
}

.logo p {
  font-size: 40px;
}

section.trigger-footer {
  width: 100%;
  height: 300vh;
  background: #000;
}

@media (max-width: 900px) {
  .sticky-bar .item p {
    font-size: 2.5vw;
  }

  .logo p {
    font-size: 20px;
  }
}
</style>
