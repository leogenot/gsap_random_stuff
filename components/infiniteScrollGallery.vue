<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  let iteration = 0
  const spacing = 0.05,
    snap = gsap.utils.snap(spacing),
    cards = gsap.utils.toArray('.cards li'),
    seamlessLoop = buildSeamlessLoop(cards, spacing),
    scrub = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: 'power3',
      paused: true,
    }),
    trigger = ScrollTrigger.create({
      start: 0,
      onUpdate(self) {
        if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
          wrapForward(self)
        } else if (
          self.progress < 1e-5 &&
          self.direction < 0 &&
          !self.wrapping
        ) {
          wrapBackward(self)
        } else {
          scrub.vars.totalTime = snap(
            (iteration + self.progress) * seamlessLoop.duration()
          )
          scrub.invalidate().restart()
          self.wrapping = false
        }
      },
      end: '+=3000',
      pin: '.gallery',
    })

  function wrapForward(trigger) {
    iteration++
    trigger.wrapping = true
    trigger.scroll(trigger.start + 1)
  }

  function wrapBackward(trigger) {
    iteration--
    if (iteration < 0) {
      iteration = 9
      seamlessLoop.totalTime(
        seamlessLoop.totalTime() + seamlessLoop.duration() * 10
      )
      scrub.pause()
    }
    trigger.wrapping = true
    trigger.scroll(trigger.end - 1)
  }

  function buildSeamlessLoop(items, spacing) {
    let overlap = Math.ceil((1 / spacing) * 2),
      startTime = items.length * spacing + 0.5,
      loopTime = (items.length + overlap) * spacing + 1,
      rawSequence = gsap.timeline({ paused: true }),
      seamlessLoop = gsap.timeline({
        paused: true,
        repeat: -1,
        onRepeat() {
          this._time === this._dur && (this._tTime += this._dur - 0.05)
        },
      }),
      l = items.length + overlap * 2,
      time = 0,
      i,
      index,
      item

    gsap.set(items, { yPercent: 400, opacity: 1, scale: 0 })

    for (i = 0; i < l; i++) {
      index = i % items.length
      item = items[index]
      time = i * spacing
      rawSequence
        .fromTo(
          item,
          { scale: 0, opacity: 1 },
          {
            scale: 1,
            opacity: 1,

            zIndex: 100,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power1.in',
            immediateRender: false,
          },
          time
        )
        .fromTo(
          item,
          { yPercent: 300 },
          {
            yPercent: -200,
            duration: 1,
            ease: 'none',
            immediateRender: false,
          },
          time
        )
      i <= items.length && seamlessLoop.add('label' + i, time)
    }

    rawSequence.time(startTime)
    seamlessLoop
      .to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: 'none',
      })
      .fromTo(
        rawSequence,
        { time: overlap * spacing + 1 },
        {
          time: startTime,
          duration: startTime - (overlap * spacing + 1),
          immediateRender: false,
          ease: 'none',
        }
      )
    return seamlessLoop
  }
})
</script>

<template>
  <div class="infinite-scroll-gallery">
    <div class="gallery">
      <ul class="cards">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<style lang="postcss">
* {
  box-sizing: border-box;
}
body {
  background: #fff;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.nav {
  position: fixed;
  padding: 2em;
  width: 100%;
  text-align: center;
  z-index: 1000000;
  color: #fff;
  mix-blend-mode: difference;
  font-family: 'Neue Montreal';
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
}

.gallery {
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.cards {
  position: absolute;
  width: 75vw;
  height: 50rem;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cards li {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 75vw;
  height: 50rem;
  position: absolute;
  top: 0;
  left: 0;
}

li:nth-child(1) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(2) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(3) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(4) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(5) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(6) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(7) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(8) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(9) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(10) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(11) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(12) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(13) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(14) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(15) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(16) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(17) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(18) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(19) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}

li:nth-child(20) {
  background: url(https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D)
    no-repeat 50% 50%;
  background-size: cover;
}
</style>
