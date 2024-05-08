<template>
  <div class="hover-pill" ref="hover-pill">
    <div class="menu">
      <div class="pill">
        <img
          src="../../public/images/wireframe1.png"
          alt=""
          class="image"
          data-id="1"
        />
        <img
          src="../../public/images/wireframe2.png"
          alt=""
          class="image"
          data-id="2"
        />
        <img
          src="../../public/images/wireframe3.png"
          alt=""
          class="image"
          data-id="3"
        />
        <img
          src="../../public/images/wireframe4.png"
          alt=""
          class="image"
          data-id="4"
        />
        <img
          src="../../public/images/wireframe5.png"
          alt=""
          class="image"
          data-id="5"
        />
        <img
          src="../../public/images/wireframe6.png"
          alt=""
          class="image"
          data-id="6"
        />
        <img
          src="../../public/images/wireframe7.png"
          alt=""
          class="image"
          data-id="7"
        />
        <img
          src="../../public/images/wireframe8.png"
          alt=""
          class="image"
          data-id="8"
        />
      </div>

      <div class="links">
        <div class="link">
          <a href="#" data-image="1">Vandstrom</a>
        </div>
        <div class="link">
          <a href="#" data-image="2">Vandstrom</a>
        </div>
        <div class="link">
          <a href="#" data-image="3">Vandstrom</a>
        </div>
        <div class="link">
          <a href="#" data-image="4">Vandstrom</a>
        </div>
        <div class="link">
          <a href="#" data-image="5">Vandstrom</a>
        </div>
        <div class="link">
          <a href="#" data-image="6">Vandstrom</a>
        </div>
        <div class="link">
          <a href="#" data-image="7">Vandstrom</a>
        </div>
        <div class="link">
          <a href="#" data-image="8">Vandstrom</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap/all'

onMounted(() => {
  function lerp(start, end, t) {
    return start * (1 - t) + end * t
  }

  const linksContainer = document.querySelector('.links')
  let currentScroll = 0
  let targetScroll = 0
  const ease = 0.1

  document.addEventListener('mousemove', e => {
    const extraHeight = linksContainer.offsetHeight - window.innerHeight
    targetScroll = (e.clientY / window.innerHeight) * -extraHeight
  })

  function animate() {
    currentScroll = lerp(currentScroll, targetScroll, ease)
    linksContainer.style.transform = `translateY(${currentScroll}px)`
    requestAnimationFrame(animate)
  }

  animate()
  let currentImageId = 1

  document.querySelectorAll('.link a').forEach(link => {
    link.addEventListener('mouseenter', function () {
      const targetImageId = parseInt(this.getAttribute('data-image'))
      let rotationValue = targetImageId > currentImageId ? 360 : -360

      const pill = document.querySelector('.pill')
      const images = document.querySelectorAll('.pill img')

      gsap.to(pill, {
        rotation: rotationValue,
        duration: 0.4,
        onComplete: function () {
          gsap.set(pill, {
            rotation: 0,
          })
        },
      })

      gsap.set(images, {
        zIndex: 0,
        opacity: 0,
        delay: 0.25,
      })

      gsap.set(`.pill img[data-id='${targetImageId}']`, {
        zIndex: 10,
        opacity: 1,
        delay: 0.25,
      })

      currentImageId = targetImageId
    })
  })
})
</script>

<style lang="postcss" scoped>
.hover-pill {
  background-color: #213438;
  height: 100vh;

  nav {
    position: fixed;
    width: 100vw;
    padding: 2rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    z-index: 10000;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-items {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .logo a,
  .item a {
    color: #fff;
    text-decoration: none;
    font-family: 'Neue Montreal';
    font-size: 14px;
  }

  #btn {
    /* background: rgb(60, 60, 252); */
    background: #fff;
    color: #000;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    margin-left: 4rem;
  }

  #btn a {
    color: #000;
  }

  i {
    font-size: 20px;
  }

  .menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .pill {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translate(0%, -50%);
    width: 300px;
    height: 300px;
  }

  .pill img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: z-index 0.5s, opacity 0.5s;
    opacity: 0;
  }

  .pill img[data-id='1'] {
    z-index: 10;
    opacity: 1;
  }

  .links {
    padding: 40rem 8rem;
    height: 240vh;
    overflow: hidden;
  }

  .menu a {
    text-decoration: none;
    font-family: 'PP Neue Montreal';
    font-size: 5rem;
    letter-spacing: -0.2rem;
    color: rgb(80, 80, 80);
    transition: all 0.3d ease-in-out;
  }

  .menu a:hover {
    color: #fff;
  }
}
</style>
