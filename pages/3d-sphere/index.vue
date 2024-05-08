<template>
  <div class="scrollytelling">
    <NuxtIcon ref="logo" class="logo" name="logo" />
    <div ref="container" style="width: 100%; height: 100vh"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene, camera, renderer, particles, particleMaterial, controls

const container = ref(null)
const scrollY = ref(window?.scrollY)

onMounted(() => {
  init()
  animate()

  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  dispose()
})

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
  camera.position.z = 300

  // Renderer setup
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  // Particle setup - create a sphere of particles
  const particleCount = 5000
  const radius = 150 // Adjust the radius of the sphere
  const particlesGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
  }

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )
  particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 })
  particles = new THREE.Points(particlesGeometry, particleMaterial)
  scene.add(particles)

  // Controls setup
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.25

  // Set minimum and maximum distance for zoom
  controls.minDistance = 200 // Adjust as needed
  controls.maxDistance = 400 // Adjust as needed

  // Resize handling
  window.addEventListener('resize', onWindowResize)
}

// Inside animate() function
// Inside animate() function
function animate() {
  requestAnimationFrame(animate)
  render()
}

function render() {
  // Update particles based on scroll position
  const scrollRatio =
    scrollY.value / (document.body.scrollHeight - window.innerHeight)
  particles.material.size = 1 - scrollRatio * 0.9

  // Update controls
  controls.update()

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
}
</style>
