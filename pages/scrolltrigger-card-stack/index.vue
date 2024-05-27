<template>
  <div class="scrolltrigger-card-stack">
    <div class="container">
      <section class="hero pinned">
        <h1>Make those cards <br />STACK</h1>
      </section>

      <section class="card pinned" v-for="item in 5" :key="item">
        <div class="img">
          <img
            src="https://images.unsplash.com/photo-1716141456685-e9714cdd2808?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE4fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D"
            alt=""
          />
        </div>
      </section>
      <section class="footer">
        <h1>Done stacking going back to sleep</h1>
      </section>
    </div>
  </div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const footer = document.querySelector('.footer')
  const lastCard = document.querySelector('.card.scroll')
  const pinnedSections = gsap.utils.toArray('.pinned')
  pinnedSections.forEach((section, index, sections) => {
    if (!section) return
    let img = section.querySelector('.img')
    let nextSection = sections[index + 1] || lastCard
    let endScalePoint = `top+=${
      nextSection?.offsetTop - section?.offsetTop
    } top`

    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end:
          index === sections.length
            ? `+=${lastCard.offsetHeight / 2}`
            : footer.offsetTop - window.innerHeight,
        pin: true,
        pinSpacing: false,
        scrub: 1,
      },
    })

    gsap.fromTo(
      img,
      { scale: 1 },
      {
        scale: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: endScalePoint,
          scrub: 1,
        },
      }
    )
  })

  const heroH1 = document.querySelector('.hero h1')
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: '+=400vh',
    scrub: 1,
    onUpdate: self => {
      let opacityProgress = self.progress
      heroH1.style.opacity = 1 - opacityProgress
    },
  })
})
</script>

<style lang="postcss" scoped>
.scrolltrigger-card-stack {
  width: 100%;
  height: 100%;
  background: #000;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.container {
  width: 100%;
  height: 100%;
}

.logo {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 2em;
  z-index: 2;
}

.logo a {
  text-decoration: none;
  font-size: 24px;
  font-weight: 400;
  color: #fff;
}

section {
  width: 100vw;
  height: 100vh;
}

.hero h1 {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: 400;
  font-size: 200px;
  color: #fff;
  letter-spacing: -8px;
  line-height: 90%;
}

.card.scroll {
  position: relative;
}

.img {
  border-radius: 40px;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 90vw;
  height: 70vh;
}

.footer {
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.footer h1 {
  font-size: 48px;
  font-weight: 400;
  letter-spacing: -2px;
}
</style>
