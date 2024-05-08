<template>
  <div class="scrollytelling">
    <div class="section"><NuxtIcon ref="logo" class="logo" name="logo" /></div>
    <div class="section"><NuxtIcon ref="logo" class="logo" name="logo" /></div>
    <div class="section"><NuxtIcon ref="logo" class="logo" name="logo" /></div>
    <div class="section"><NuxtIcon ref="logo" class="logo" name="logo" /></div>

    <div
      ref="container"
      class="container"
      style="width: 100%; height: 100vh"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
let scene,
  camera,
  renderer,
  particles,
  particleMaterial,
  controls,
  composer,
  renderPass
const scrollPercent = ref(0)
const container = ref(null)
const scrollY = ref(window?.scrollY)
const animationScripts = ref([])
const stats = ref(null)

onMounted(() => {
  init()
  animate()

  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  dispose()
})

function lerp(x, y, a) {
  return (1 - a) * x + a * y
}

// Used to fit the lerps to start and end at specific scrolling percentages
function scalePercent(start, end) {
  return (scrollPercent.value - start) / (end - start)
}

function init() {
  // Scene setup
  scene = new THREE.Scene()

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  //   camera.position.z = 300

  // Renderer setup
  renderer = new THREE.WebGLRenderer()

  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  })

  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0.5, -10)
  scene.add(cube)

  // Resize handling
  window.addEventListener('resize', onWindowResize)

  //add an animation that flashes the cube through 100 percent of scroll
  animationScripts.value.push({
    start: 0,
    end: 101,
    func: () => {
      let g = material.color.g
      g -= 0.05
      if (g <= 0) {
        g = 1.0
      }
      material.color.g = g
    },
  })

  //add an animation that moves the cube through first 40 percent of scroll
  animationScripts.value.push({
    start: 0,
    end: 40,
    func: () => {
      camera.lookAt(cube.position)
      camera.position.set(0, 1, 2)
      cube.position.z = lerp(-10, 0, scalePercent(0, 40))
      //console.log(cube.position.z)
    },
  })

  //add an animation that rotates the cube between 40-60 percent of scroll
  animationScripts.value.push({
    start: 40,
    end: 60,
    func: () => {
      camera.lookAt(cube.position)
      camera.position.set(0, 1, 2)
      cube.rotation.z = lerp(0, Math.PI, scalePercent(40, 60))
      //console.log(cube.rotation.z)
    },
  })

  //add an animation that moves the camera between 60-80 percent of scroll
  animationScripts.value.push({
    start: 60,
    end: 80,
    func: () => {
      camera.position.x = lerp(0, 5, scalePercent(60, 80))
      camera.position.y = lerp(1, 5, scalePercent(60, 80))
      camera.lookAt(cube.position)
      //console.log(camera.position.x + " " + camera.position.y)
    },
  })

  //add an animation that auto rotates the cube from 80 percent of scroll
  animationScripts.value.push({
    start: 80,
    end: 101,
    func: () => {
      //auto rotate
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
    },
  })

  document.body.onscroll = () => {
    //calculate the current scroll progress as a percentage
    scrollPercent.value =
      ((document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollHeight || document.body.scrollHeight) -
          document.documentElement.clientHeight)) *
      100
  }
  stats.value = new Stats()
  document.body.appendChild(stats.value.dom)
}

function playScrollAnimations() {
  animationScripts.value.forEach(a => {
    if (scrollPercent.value >= a.start && scrollPercent.value < a.end) {
      a.func()
    }
  })
}

function animate() {
  requestAnimationFrame(animate)
  playScrollAnimations()

  render()

  stats.value.update()
}

function render() {
  // Update controls
  //   controls.update()

  // Render scene
  renderer.render(scene, camera)
}

function onScroll() {
  scrollY.value = window.scrollY
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function dispose() {
  // Dispose Three.js objects
  renderer.dispose()
  //   scene.dispose()
}
</script>

<style lang="postcss">
.scrollytelling {
  .section {
    height: 100vh;
    position: relative;
  }
  .logo {
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: 80%;
    height: auto;
    svg {
      width: 100%;
      height: 100%;
      position: relative;
      color: white;
    }
  }

  .container {
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
