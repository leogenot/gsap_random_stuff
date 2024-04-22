<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  function addImageScaleAnimation() {
    gsap.utils.toArray('section').forEach((section, index) => {
      const image = document.querySelector(`#preview-${index + 1} img`)

      const startCondition = index === 0 ? 'top top' : 'bottom bottom'

      gsap.to(image, {
        scrollTrigger: {
          trigger: section,
          start: startCondition,
          end: () => {
            const viewportHeight = window.innerHeight
            const sectionBottom = section.offsetTop + section.offsetHeight
            const additionalDistance = viewportHeight * 0.5
            const endValue = sectionBottom - viewportHeight + additionalDistance
            return `+=${endValue}`
          },
          scrub: 1,
        },
        scale: 3,
        ease: 'none',
      })
    })
  }

  addImageScaleAnimation()

  function animateClipPath(
    sectionId,
    previewId,
    startClipPath,
    endClipPath,
    start = 'top center',
    end = 'bottom top'
  ) {
    let section = document.querySelector(sectionId)
    let preview = document.querySelector(previewId)

    ScrollTrigger.create({
      trigger: section,
      start: start,
      end: end,
      onEnter: () => {
        gsap.to(preview, {
          scrollTrigger: {
            trigger: section,
            start: start,
            end: end,
            scrub: 0.125,
          },
          clipPath: endClipPath,
          ease: 'none',
        })
      },
    })
  }

  animateClipPath(
    '#section-1',
    '#preview-1',
    'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
  )

  const totalSections = 7

  for (let i = 2; i <= totalSections; i++) {
    let currentSection = `#section-${i}`
    let prevPreview = `#preview-${i - 1}`
    let currentPreview = `#preview-${i}`

    animateClipPath(
      currentSection,
      prevPreview,
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      'top bottom',
      'center center'
    )

    if (i < totalSections) {
      animateClipPath(
        currentSection,
        currentPreview,
        'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        'center center',
        'bottom top'
      )
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="intro-copy">
      <p>This message stays right here,</p>
      <p>no matter where you go,</p>
      <p>it won't move an inch,</p>
      <p>even if you scroll up or down.</p>
    </div>

    <div class="headers">
      <section id="section-1">
        <h1>Vaccum</h1>
      </section>
      <section id="section-2">
        <h1>Ember</h1>
      </section>
      <section id="section-3">
        <h1>Scratch</h1>
      </section>
      <section id="section-4">
        <h1>Azure</h1>
      </section>
      <section id="section-5">
        <h1>Synthesis</h1>
      </section>
      <section id="section-6">
        <h1>Euphoria</h1>
      </section>
      <section id="section-7">
        <h1>The End</h1>
      </section>
      <div class="spacer"></div>
    </div>

    <div class="section-previews">
      <div v-for="i in 7" class="img" :id="`preview-${i}`">
        <img
          src="https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
      </div>
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
  height: 100%;
  font-family: 'PP Neue Montreal';
  background: #000;
}

.container {
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1 {
  color: #fff;
  font-size: 14vw;
  font-weight: 400;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  text-align: center;
}

p {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
}

.intro-copy {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

section {
  margin: 150vh 0;
}

.section-previews {
  position: fixed;
  width: 500px;
  height: 700px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.img {
  width: 100%;
  height: 100%;
  position: absolute;
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  overflow: hidden;
}

.spacer {
  width: 100%;
  height: 200px;
}
</style>
