<template>
  <div
    class="threejs-scene"
    ref="container"
    :class="{ loaded: isLoaded }"
  ></div>
</template>

<script setup>
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { PencilLinesPass } from '/utils/PencilLinesPass'

let scene, camera, renderer, composer, renderPass, pencilLinePass
const container = ref(null)
const isLoaded = ref(false)

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
  camera.position.set(0, 0, 5)

  // Renderer setup
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  // Add objects, lights, etc.
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  const torus = new THREE.Mesh(geometry, material)
  scene.add(torus)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(0, 0, 10)
  scene.add(light)

  composer = new EffectComposer(renderer)
  renderPass = new RenderPass(scene, camera)
  pencilLinePass = new PencilLinesPass({
    width: window.innerWidth,
    height: window.innerHeight,
    scene,
    camera,
  })
  composer.addPass(renderPass)
  composer.addPass(pencilLinePass)

  window.addEventListener('resize', onWindowResize)
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

function render() {
  composer.render()
  isLoaded.value = true
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function cleanUpThree(scene, renderer) {
  scene.traverse(object => {
    if (!object.isMesh) return
    object.geometry.dispose()

    if (object.material.isMaterial) {
      cleanMaterial(object.material)
    } else {
      for (const material of object.material) cleanMaterial(material)
    }
  })
  composer.dispose()
  renderPass.dispose()
  pencilLinePass.dispose()
  renderer.dispose()
  scene.clear()
}

const cleanMaterial = material => {
  material.dispose()

  // dispose textures
  for (const key of Object.keys(material)) {
    const value = material[key]
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose()
    }
  }
}

function cleanUp() {
  cleanUpThree(scene, renderer)
  window.removeEventListener('resize', onWindowResize)
  isLoaded.value = false
}

onMounted(() => {
  init()
  animate()
})

onBeforeUnmount(() => {
  cleanUp()
})
</script>

<style scoped>
.threejs-scene {
  width: 100%;
  height: 100%;

  opacity: 0;
  filter: blur(20px);
  transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out;

  &.loaded {
    opacity: 1;
    filter: blur(0);
  }
}
</style>
