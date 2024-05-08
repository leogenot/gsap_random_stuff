<template>
  <div class="slider" ref="slider">
    <div class="container">
      <div class="overlay">
        <div class="t-1 marquee-wrapper">
          <h1>MULTI-STEP PROCESS</h1>
        </div>
        <div class="t-2 marquee-wrapper">
          <h1>FILTERING USING PROTEINS</h1>
        </div>
        <div class="t-3 marquee-wrapper">
          <h1>MAKE FILTERING EASIER</h1>
        </div>
        <div class="t-4 marquee-wrapper">
          <h1>EASY ACCESS TO OUR PRODUCT</h1>
        </div>
      </div>
      <div class="modal">
        <div class="modal-images">
          <div class="img" id="t-1">
            <img
              src="https://images.unsplash.com/photo-1555412654-72a95a495858?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0ZXJ8ZW58MHx8MHx8fDA%3D"
              alt=""
            />
          </div>

          <div class="img" id="t-2">
            <img
              src="https://images.unsplash.com/photo-1568145675395-66a2eda0c6d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdhdGVyfGVufDB8fDB8fHww"
              alt=""
            />
          </div>

          <div class="img" id="t-3">
            <img
              src="https://images.unsplash.com/photo-1460501501851-d5946a18e552?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHdhdGVyfGVufDB8fDB8fHww"
              alt=""
            />
          </div>

          <div class="img" id="t-4">
            <img
              src="https://images.unsplash.com/photo-1505620617250-8ced60305f27?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHdhdGVyfGVufDB8fDB8fHww"
              alt=""
            />
          </div>

          <div class="img" id="t-5">
            <img
              src="https://images.unsplash.com/photo-1527100673774-cce25eafaf7f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHdhdGVyfGVufDB8fDB8fHww"
              alt=""
            />
          </div>
        </div>

        <div class="info">
          <p class="name">VANDSTROM</p>
          <p class="role">VANDSTROM</p>
        </div>
      </div>
    </div>

    <div class="cursor">
      <i class="ph-light ph-arrow-left">-></i>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap/all'

onMounted(() => {
  const team = [
    { name: 'image 1', role: 'credits' },
    { name: 'image 2', role: 'credits image' },
    { name: 'image 3', role: 'credits blabla' },
    { name: 'image 4', role: 'credits hihi' },
  ]

  const cursor = document.querySelector('.cursor')
  const cursorIcon = cursor.querySelector('i')

  const cursorWidth = cursor.offsetWidth / 2
  const cursorHeight = cursor.offsetHeight / 2

  let currentSlide = 1
  const totalSlides = 4

  const updateCursorClass = xPosition => {
    const halfPageWidth = window.innerWidth / 2
    if (xPosition > halfPageWidth) {
      if (currentSlide < totalSlides) {
        cursorIcon.classList.remove('ph-arrow-left')
        cursorIcon.classList.add('ph-arrow-right')
        cursor.style.display = ''
      } else {
        cursor.style.display = 'none'
      }
    } else {
      if (currentSlide > 1) {
        cursorIcon.classList.remove('ph-arrow-right')
        cursorIcon.classList.add('ph-arrow-left')
        cursor.style.display = ''
      } else {
        cursor.style.display = 'none'
      }
    }
  }

  document.addEventListener('mousemove', e => {
    gsap.to(cursor, {
      x: e.clientX - cursorWidth,
      y: e.clientY - cursorHeight,
      duration: 1,
      ease: 'power3.out',
    })

    updateCursorClass(e.clientX)
  })

  const updateInfo = slideNumber => {
    const member = team[slideNumber - 1]
    document.querySelector('.info .name').textContent = member.name
    document.querySelector('.info .role').textContent = member.role
  }

  const animateSlide = (slideNumber, reveal) => {
    const marquee = document.querySelector(`.t-${slideNumber}.marquee-wrapper`)
    const img = document.getElementById(`t-${slideNumber}`)
    const clipPathValue = reveal
      ? 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)'
      : 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)'

    gsap.to(marquee, {
      clipPath: clipPathValue,
      duration: 1,
      ease: 'power4.out',
      delay: 0.3,
    })

    gsap.to(img, { clipPath: clipPathValue, duration: 1, ease: 'power4.out' })
  }

  updateInfo(currentSlide)

  const handleRightClick = () => {
    if (currentSlide < totalSlides) {
      animateSlide(currentSlide + 1, true)
      currentSlide++
      updateInfo(currentSlide)
    }
  }

  const handleLeftClick = () => {
    if (currentSlide > 1) {
      animateSlide(currentSlide, false)
      currentSlide--
      updateInfo(currentSlide)
    }
  }

  document.addEventListener('click', e => {
    const halfPageWidth = window.innerWidth / 2
    if (e.clientX > halfPageWidth) {
      handleRightClick()
    } else {
      handleLeftClick()
    }
  })
})
</script>

<style lang="postcss" scoped>
.slider {
  .cursor {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 30px;
    z-index: 1000;
  }

  nav {
    position: fixed;
    width: 100%;
    padding: 2em;
    display: flex;
    justify-content: space-between;
    z-index: 2;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .marquee-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  }

  .marquee-wrapper.t-1 {
    clip-path: polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%);
  }

  h1 {
    position: absolute;
    top: 50%;
    left: -100%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 240px;
    text-transform: uppercase;
    font-weight: 400;
    width: 100%;
    white-space: nowrap;
    animation: marquee 10s linear infinite;
  }

  @keyframes marquee {
    0% {
      transform: translate(0%, -50%);
    }
    50% {
      transform: translate(-5%, -50%);
    }
    50.5% {
      transform: translate(-5%, -50%);
    }
    100% {
      transform: translate(0%, -50%);
    }
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 700px;
  }

  .modal-images {
    width: 100%;
    height: 600px;
  }

  .role {
    margin: 5px 0;
  }

  .img {
    position: absolute;
    width: 100%;
    height: 600px;
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  }

  .img#t-1 {
    clip-path: polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%);
  }

  .info {
    margin-top: 24px;
  }

  .t-1 {
    background: #fff;
  }

  .t-2 {
    background: #c4bca9;
  }

  .t-3 {
    background: #fff;
  }

  .t-4 {
    background: #8e908a;
  }

  @media (max-width: 900px) {
    .modal {
      width: 400px;
      height: 600px;
    }

    .modal-images {
      width: 100%;
      height: 500px;
    }

    .img {
      width: 100%;
      height: 500px;
    }
  }
}
</style>
