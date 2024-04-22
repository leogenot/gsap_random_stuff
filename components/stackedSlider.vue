<script setup>
import { gsap, CustomEase } from 'gsap/all'
gsap.registerPlugin(CustomEase)
CustomEase.create('cubic', '0.83, 0, 0.17, 1')
const isAnimating = ref(false)

function splitTextIntoSpans(selector) {
  let elements = document.querySelectorAll(selector)
  elements.forEach(element => {
    let text = element.innerText
    let splitText = text
      .split('')
      .map(function (char) {
        return `<span>${char === ' ' ? '&nbsp;&nbsp;' : char}</span>`
      })
      .join('')
    element.innerHTML = splitText
  })
}

function initializeCards() {
  let cards = Array.from(document.querySelectorAll('.card'))
  gsap.to(cards, {
    y: i => -20 + 20 * i + '%',
    z: i => 15 * i,
    opacity: 1,
    duration: 1,
    ease: 'cubic',
    stagger: -0.1,
  })
}

onMounted(() => {
  splitTextIntoSpans('.copy h1')
  initializeCards()
  gsap.set('h1 span', { y: -200 })
  gsap.set('.slider .card:last-child h1 span', { y: 0 })
  document.addEventListener('click', function () {
    if (isAnimating.value) return
    isAnimating.value = true

    let slider = document.querySelector('.slider')
    let cards = Array.from(slider.querySelectorAll('.card'))
    let lastCard = cards.pop()
    let nextCard = cards[cards.length - 1]

    gsap.to(lastCard.querySelectorAll('h1 span'), {
      y: 200,
      duration: 0.75,
      ease: 'cubic',
    })

    gsap.to(lastCard, {
      y: '+=250%',
      duration: 0.75,
      ease: 'cubic',
      onComplete: () => {
        slider.prepend(lastCard)
        initializeCards()
        gsap.set(lastCard.querySelectorAll('h1 span'), { y: -200 })

        setTimeout(() => {
          isAnimating.value = false
        }, 1000)
      },
    })

    gsap.to(nextCard.querySelectorAll('h1 span'), {
      y: 0,
      duration: 1,
      ease: 'cubic',
      stagger: 0.05,
    })
  })
})
</script>

<template>
  <div class="stacked-slider">
    <div class="container">
      <div class="slider">
        <div class="card" v-for="(item, index) in 5" :key="item">
          <img
            src="https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D"
            alt="card image"
          />
          <div class="copy">
            <h1>Lorem Ipsum</h1>
          </div>
        </div>
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

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #dfe1c8;
}

.slider {
  position: absolute;
  top: 15vh;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  perspective: 200px;
  perspective-origin: 50% 100%;
}

.card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 500px;
  border-radius: 10px;
  transform: translate3d(-50%, -50%, 0px);
  overflow: hidden;
  background: #000;
}

.card img {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.75;
}

.copy {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
}

h1 {
  position: relative;
  text-align: center;
  font-family: Helvetica;
  font-size: 6vw;
  font-weight: 300;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: #dfe1c8;
}

h1 span {
  position: relative;
  display: inline-block;
}
</style>
