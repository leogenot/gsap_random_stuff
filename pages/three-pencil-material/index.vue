<template>
  <div class="scrollytelling" ref="scrolytelling">
    <div class="section"><NuxtIcon ref="logo" class="logo" name="logo" /></div>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PencilLinesPass } from './PencilLinesPass'
let scene,
  camera,
  renderer,
  particles,
  particleMaterial,
  controls,
  composer,
  renderPass,
  pencilLinePass
const scrollPercent = ref(0)
const container = ref(null)
const scrollY = ref(window?.scrollY)
const animationScripts = ref([])
const stats = ref(null)
const scrolytelling = ref(null)

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
    120,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  //   camera.position.z = 300

  // Renderer setup
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  const torus = new THREE.Mesh(geometry, material)
  // torus.castShadow = true
  // torus.rotation.y = Math.PI / 4
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

  controls = new OrbitControls(camera, renderer.domElement)
  container.value.appendChild(renderer.domElement)
  // Resize handling
  window.addEventListener('resize', onWindowResize)
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

  gsap.to(torus.rotation, {
    y: Math.PI * 2,
    x: Math.PI * 2,

    scrollTrigger: {
      trigger: scrolytelling.value,
      scrub: 1,
      start: 'top 0',
      end: 'bottom top',
    },
  })
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
function animate() {
  requestAnimationFrame(animate)
  render()
  stats.value.update()
}

function render() {
  controls.update()
  composer.render()
  //   renderer.render(scene, camera)
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
    canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
