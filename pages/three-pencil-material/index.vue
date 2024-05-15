<!-- <template>
  <div class="scrollytelling" ref="scrolytelling">
    <div class="section"><NuxtIcon ref="logo" class="logo" name="logo" /></div>
    <div
      ref="container"
      class="container"
      :class="{ 'is-loaded': isLoaded }"
    ></div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap/all'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { PencilLinesPass } from './PencilLinesPass'
let scene, camera, renderer, composer, renderPass, pencilLinePass, torus
const isLoaded = ref(false)
const container = ref(null)
const scrollY = ref(window?.scrollY)
const stats = ref(null)
const scrolytelling = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
onMounted(() => {
  init()
  animate()
  window.addEventListener('scroll', onScroll)
  window.addEventListener('mousemove', onMouseMove)
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
    120,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  //   camera.position.z = 300

  // Renderer setup
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  torus = new THREE.Mesh(geometry, material)
  // torus.castShadow = true
  torus.position.set(0, 0, 0)
  scene.add(torus)

  camera.position.z = 1
  camera.position.y = 0.2

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.castShadow = true
  directionalLight.position.set(2, 2, 2)
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  const hemisphereLight = new THREE.HemisphereLight(0x7a3114, 0x48c3ff, 0.5)
  scene.add(hemisphereLight)

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setClearColor('#eee')
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.CineonToneMapping
  renderer.toneMappingExposure = 1.75
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.body.appendChild(renderer.domElement)

  composer = new EffectComposer(renderer)
  renderPass = new RenderPass(scene, camera)
  pencilLinePass = new PencilLinesPass({
    width: renderer.domElement.clientWidth,
    height: renderer.domElement.clientHeight,
    scene,
    camera,
  })

  composer.addPass(renderPass)
  composer.addPass(pencilLinePass)

  container.value.appendChild(renderer.domElement)
  window.addEventListener('resize', onWindowResize)
  stats.value = new Stats()
  document.body.appendChild(stats.value.dom)

  gsap.to(
    camera.position,
    {
      y: 2,
      z: 5,

      scrollTrigger: {
        trigger: scrolytelling.value,
        scrub: 1,
        start: 'top 0',
        end: 'bottom top',
      },
    },
    '<'
  )
}

function onMouseMove(event) {
  mouseX.value = (event.clientX / window.innerWidth) * 2 - 1
  mouseY.value = -(event.clientY / window.innerHeight) * 2 + 1
}

function updateTorusPosition() {
  const translationX = mouseX.value * 0.1
  const translationY = mouseY.value * 0.1

  gsap.to(torus.position, {
    x: -translationX,
    y: -translationY,
    duration: 0.5,
    ease: 'power2.out',
  })

  gsap.to(
    torus.rotation,
    {
      x: -translationX,
      y: -translationY,
      duration: 0.5,
      ease: 'power2.out',
    },
    '<'
  )
}

function animate() {
  requestAnimationFrame(animate)
  render()
  updateTorusPosition()
  stats.value.update()
}

function render() {
  composer.render()
  isLoaded.value = true
}

function onScroll() {
  scrollY.value = window.scrollY
}

function onWindowResize() {
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

function dispose() {
  renderer.dispose()
}
</script>

<style lang="postcss">
.scrollytelling {
  .section {
    height: 400vh;
    position: relative;
  }
  .logo {
    pointer-events: none;
    position: fixed;
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
      color: red;
    }
  }

  .container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 50vh;
    width: 50vw;
    pointer-events: none;
    opacity: 0;
    filter: blur(20px);
    transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out;
    canvas {
      width: 100%;
      height: 100%;
    }

    &.is-loaded {
      opacity: 1;
      filter: blur(0);
    }
  }
}
</style> -->
<template>
  <!-- <div
    class="threejs-scene"
    ref="container"
    :class="{ loaded: isLoaded }"
  ></div> -->
  <three-canvas />
</template>

<script setup>
// import * as THREE from 'three'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { PencilLinesPass } from './PencilLinesPass'

// let scene, camera, renderer, composer, renderPass, pencilLinePass
// const container = ref(null)
// const isLoaded = ref(false)

// onMounted(() => {
//   init()
//   animate()
// })

// onUnmounted(() => {
//   dispose()
// })

// function init() {
//   // Scene setup
//   scene = new THREE.Scene()

//   // Camera setup
//   camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   )
//   camera.position.set(0, 0, 5)

//   // Renderer setup
//   renderer = new THREE.WebGLRenderer()
//   renderer.setSize(window.innerWidth, window.innerHeight)
//   container.value.appendChild(renderer.domElement)

//   // Add objects, lights, etc.
//   const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32)
//   const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
//   const torus = new THREE.Mesh(geometry, material)
//   scene.add(torus)

//   const light = new THREE.DirectionalLight(0xffffff, 1)
//   light.position.set(0, 0, 10)
//   scene.add(light)

//   // Composer setup
//   composer = new EffectComposer(renderer)
//   renderPass = new RenderPass(scene, camera)
//   pencilLinePass = new PencilLinesPass({
//     width: window.innerWidth,
//     height: window.innerHeight,
//     scene,
//     camera,
//   })
//   composer.addPass(renderPass)
//   composer.addPass(pencilLinePass)

//   // Additional setup
//   window.addEventListener('resize', onWindowResize)
// }

// function animate() {
//   requestAnimationFrame(animate)
//   render()
// }

// function render() {
//   composer.render()
//   isLoaded.value = true
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight
//   camera.updateProjectionMatrix()
//   renderer.setSize(window.innerWidth, window.innerHeight)
// }

// function dispose() {
//   renderer.dispose()
// }
</script>

<style scoped>
.threejs-scene {
  /* width: 100%;
  height: 100%;

  opacity: 0;
  filter: blur(20px);
  transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out;

  &.loaded {
    opacity: 1;
    filter: blur(0);
  } */
}
</style>
