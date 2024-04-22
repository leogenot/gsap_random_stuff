<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const gallery = document.getElementById('gallery')

  window.onmousemove = e => {
    const mouseX = e.clientX,
      mouseY = e.clientY

    const xDecimal = mouseX / window.innerWidth,
      yDecimal = mouseY / window.innerHeight

    const maxX = gallery.offsetWidth - window.innerWidth,
      maxY = gallery.offsetHeight - window.innerHeight

    const panX = maxX * xDecimal * -1,
      panY = maxY * yDecimal * -1

    gallery.animate(
      {
        transform: `translate(${panX}px, ${panY}px)`,
      },
      {
        duration: 4000,
        fill: 'forwards',
        easing: 'ease',
      }
    )
  }

  const radius = 300,
    maxScale = 3,
    blocks = document.querySelectorAll('.block'),
    radius2 = radius * radius,
    container = document.querySelector('#gallery')

  blocks.forEach(block => {
    let b = block.getBoundingClientRect()
    ;(block.cx = b.left + b.width / 2 + window.pageXOffset),
      (block.cy = b.top + b.height / 2 + window.pageYOffset)

    block.tween = gsap
      .to(block, { scale: maxScale, ease: 'power1.in', paused: true })
      .progress(1)
      .progress(0)
  })

  document.addEventListener('mousemove', e => {
    let i = blocks.length,
      dx,
      dy,
      block
    while (i--) {
      block = blocks[i]
      dx = (block.cx - e.pageX) ** 2
      dy = (block.cy - e.pageY) ** 2
      block.tween.progress(1 - (dx + dy) / radius2)
    }
  })
})
</script>

<template>
  <div class="scroll-trigger-gallery">
    <div id="gallery">
      <div class="block" v-for="item in 20" :key="item"></div>
    </div>
  </div>
</template>

<style lang="postcss">
body {
  background-color: #fff;
  height: 100vh;
  margin: 0px;
  overflow: hidden;
  cursor: crosshair;
}

#gallery {
  height: 75vmax;
  width: 95vmax;
  position: relative;
}

.block {
  position: absolute;
  width: 150px;
  height: 200px;
  z-index: 1;
}

.block:hover {
  z-index: 2;
}

.block:nth-child(1) {
  top: 0;
  left: 10%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}

.block:nth-child(2) {
  top: 5%;
  left: 0%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}

.block:nth-child(3) {
  top: 25%;
  left: 15%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(4) {
  top: 50%;
  left: 10%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(5) {
  top: 8%;
  left: 20%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(6) {
  top: 40%;
  left: 0%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(7) {
  top: 65%;
  left: 3%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(8) {
  top: 75%;
  left: 20%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(9) {
  top: 0;
  left: 35%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(10) {
  top: 25%;
  left: 40%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(11) {
  bottom: 0;
  right: 35%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(12) {
  bottom: 75%;
  right: 20%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(13) {
  bottom: 65%;
  right: 3%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(14) {
  bottom: 35%;
  right: 45%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(15) {
  bottom: 40%;
  right: 0%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(16) {
  bottom: 8%;
  right: 20%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(17) {
  bottom: 50%;
  right: 5%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(18) {
  bottom: 25%;
  right: 15%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(19) {
  bottom: 5%;
  right: 3%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(20) {
  bottom: 0;
  right: 10%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(21) {
  top: 2%;
  left: 50%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(22) {
  top: 35%;
  left: 63%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(23) {
  top: 45%;
  left: 25%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(24) {
  top: 60%;
  left: 27%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(25) {
  top: 12%;
  left: 70%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
.block:nth-child(26) {
  bottom: 12%;
  right: 70%;
  background: url('https://images.unsplash.com/photo-1713687070911-8c89cece491d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D')
    no-repeat 50% 50%;
  background-size: cover;
}
</style>
