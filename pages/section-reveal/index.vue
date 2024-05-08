<template>
  <div class="section-reveal" ref="section-reveal">
    <div class="header">
      <div class="letters">
        <div>p</div>
        <div>r</div>
        <div>o</div>
        <div>t</div>
      </div>
      <div class="letters">
        <div>e</div>
        <div>i</div>
        <div>n</div>
        <div>s</div>
      </div>
    </div>
    <div class="website-content">
      <div class="img-holder">
        <img
          src="https://images.unsplash.com/photo-1714886772771-c5b602e9e553?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
          alt=""
        />
      </div>

      <div class="content-holder">
        <div class="row">
          <h1>Our process</h1>
        </div>
        <div class="row">
          <div class="img">
            <img
              src="https://images.unsplash.com/photo-1714886772771-c5b602e9e553?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
              alt=""
            />
          </div>
        </div>
        <div class="row">
          <div class="img">
            <img
              src="https://images.unsplash.com/photo-1714886772771-c5b602e9e553?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
              alt=""
            />
          </div>
        </div>
        <div class="row">
          <div class="img">
            <img
              src="https://images.unsplash.com/photo-1714886772771-c5b602e9e553?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
              alt=""
            />
          </div>
        </div>
        <div class="row">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga quae
            suscipit eius, optio eaque nesciunt minima atque quod molestiae enim
            animi id nostrum? Harum eum dignissimos ipsam odio aliquam.
            Molestiae?
          </p>
        </div>
        <div class="row">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui
            molestias dolore odit iusto voluptas similique obcaecati ad neque
            dolores aspernatur fuga, repellendus harum delectus, tenetur sunt
            odio adipisci! Ea, explicabo!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const contentHolderHeight =
    document.querySelector('.content-holder').offsetHeight
  const imgHolderHeight = window.innerHeight
  const additionalScrollHeight = window.innerHeight

  const totalBodyHeight =
    contentHolderHeight + imgHolderHeight + additionalScrollHeight
  document.body.style.height = `${totalBodyHeight}px`
  const endValue =
    document.querySelector('.website-content').offsetHeight * 0.75

  ScrollTrigger.create({
    trigger: '.website-content',
    start: '-0.1% top',
    end: 'bottom bottom',
    onEnter: () => {
      gsap.set('.website-content', { position: 'absolute', top: '195%' })
    },
    onLeaveBack: () => {
      gsap.set('.website-content', { position: 'fixed', top: '0' })
    },
  })

  gsap.to('.header .letters:first-child', {
    x: () => -innerWidth * 3,
    scale: 10,
    ease: 'power2.inOut',
    scrollTrigger: {
      start: 'top top',
      end: `+=200%`,
      scrub: 1,
    },
  })

  gsap.to('.header .letters:last-child', {
    x: () => innerWidth * 3,
    scale: 10,
    ease: 'power2.inOut',
    scrollTrigger: {
      start: 'top top',
      end: `+=200%`,
      scrub: 1,
    },
  })

  gsap.to('.img-holder', {
    rotation: 0,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ease: 'power2.inOut',
    scrollTrigger: {
      start: 'top top',
      end: '+=200%',
      scrub: 1,
    },
  })

  gsap.to('.img-holder img', {
    scale: 1,
    ease: 'power2.inOut',
    scrollTrigger: {
      start: 'top top',
      end: '+=200%',
      scrub: 1,
    },
  })
})
</script>

<style lang="postcss" scoped>
.section-reveal {
  h1 {
    font-size: 80px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 18px;
    font-weight: 400;
    line-height: 1.5;
    width: 50%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .logo {
    position: fixed;
    top: 0;
    right: 0;
    margin: 2em;
    width: 18px;
    height: 18px;
    background: red;
    border-radius: 100%;
    z-index: 10000;
  }

  .header {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    width: 100%;
    z-index: 2;
  }

  .letters {
    flex: 1;
    display: flex;
    text-transform: uppercase;
  }

  .letters > div {
    flex: 1;
    font-size: 18vw;
    font-weight: 400;
    color: #000;
    text-align: center;
  }

  .website-content {
    position: fixed;
    top: 0;
    width: 100%;
    min-height: 100vh;
  }

  .img-holder {
    position: relative;
    top: 0;
    width: 100%;
    height: 100vh;
    background: #fff;
    clip-path: polygon(37.5% 20%, 62.5% 20%, 62.5% 80%, 37.5% 80%);
    transform: rotate(30deg);
  }

  .img-holder img {
    position: relative;
    transform: scale(2);
  }

  .content-holder {
    position: relative;
    top: -5px;
    width: 100%;
    background: #000;
    color: #fff;
    padding: 1em;
  }

  .row {
    margin: 2em 1em;
  }

  .img {
    width: 200px;
    height: 275px;
  }

  .row:nth-child(2) .img {
    position: relative;
    left: 50%;
  }

  .row:nth-child(3) .img {
    position: relative;
    left: 15%;
  }

  .row:nth-child(4) .img {
    position: relative;
    left: 70%;
  }

  .row:nth-child(6) p {
    position: relative;
    left: 30%;
    margin: 4em 0;
  }
}
</style>
