<template>
  <div class="scrollytelling" ref="scrolytelling">
    <div class="section" ref="firstSection">
      <NuxtIcon ref="logo" class="logo" name="logo" />
    </div>
    <!-- <div ref="container" class="container" :class="{ 'is-loaded': isLoaded }">
      <TresCanvas
        ><TresPerspectiveCamera :position="[3, 3, 3]" :look-at="[0, 0, 0]" />
        <TresMesh>
          <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
          <TresMeshBasicMaterial color="orange" />
        </TresMesh>
        <TresAmbientLight :intensity="1"
      /></TresCanvas>
    </div> -->
    <div ref="container" class="container" :class="{ 'is-loaded': true }">
      <!-- <TresCanvas clear-color="#82DBC5" width="100%" height="100%">
        <TresPerspectiveCamera
          :position="[3, 3, 3]"
          :fov="45"
          :look-at="[0, 0, 0]"
        />
        <TresMesh>
          <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
          <TresMeshBasicMaterial color="orange" />
        </TresMesh>
        <TresAmbientLight :intensity="1" />
      </TresCanvas> -->
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap/all'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { PencilLinesPass } from '/utils/PencilLinesPass'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
let scene,
  camera,
  renderer,
  composer,
  renderPass,
  pencilLinePass,
  torus,
  controls
const isLoaded = ref(false)
const container = ref(null)
const scrollY = ref(window?.scrollY)
const stats = ref(null)
const firstSection = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const options = ref({
  color: 0x48c3ff,
  metalness: 0.1,
  roughness: 0.2,
  transmission: 1,
  ior: 1.3,
  reflectivity: 0.4,
  thickness: 1.5,
  envMapIntensity: 0.02,
  clearcoat: 0.25,
  clearcoatRoughness: 0.1,
  normalScale: 1,
  clearcoatNormalScale: 0,
  normalRepeat: 1,
  bloomThreshold: 0.03,
  bloomStrength: 0.02,
  bloomRadius: 0.01,
})
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
  scene = new THREE.Scene({
    alpha: true,
  })

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
  const material = new THREE.MeshPhysicalMaterial({})
  material.reflectivity = 0
  material.transmission = 1.0
  material.roughness = 0.2
  material.metalness = 0
  material.clearcoat = 0.3
  material.clearcoatRoughness = 0.25
  // material.color = new THREE.Color(0xffffff)
  material.ior = 1.2
  material.thickness = 10.0
  // torus = new THREE.Mesh(geometry, material)
  torus = new THREE.Mesh(geometry, material)
  // torus.castShadow = true
  torus.position.set(0, 0, 0)
  scene.add(torus)

  // const loader = new OBJLoader()

  // load a resource
  // loader.load(
  //   // resource URL
  //   '/models/water-drop.obj',
  //   // called when resource is loaded
  //   function (object) {
  //     object.scale.set(0.003, 0.003, 0.003)
  //     object.position.set(0, -1, 0)
  //     scene.add(object)
  //   },
  //   // called when loading is in progresses
  //   function (xhr) {
  //     console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  //   },
  //   // called when loading has errors
  //   function (error) {
  //     console.log('An error happened')
  //   }
  // )

  camera.position.z = 1
  camera.position.y = 0.2

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.castShadow = true
  directionalLight.position.set(2, 2, 2)
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  // scene.add(directionalLight)

  const hemisphereLight = new THREE.HemisphereLight(0x7a3114, 0x48c3ff, 0.5)
  // scene.add(hemisphereLight)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  // renderer.setClearColor('#eee')
  // renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.RGBAFormat
  renderer.toneMapping = THREE.CineonToneMapping
  renderer.toneMappingExposure = 1.75
  // renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.body.appendChild(renderer.domElement)

  var parameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: true,
  }

  var renderTarget = new THREE.WebGLRenderTarget(
    renderer.domElement.width,
    renderer.domElement.height,
    parameters
  )

  composer = new EffectComposer(renderer, renderTarget)
  composer.renderTarget1.format = THREE.RGBAFormat
  composer.renderTarget2.format = THREE.RGBAFormat
  renderPass = new RenderPass(scene, camera)
  renderPass.clear = true
  pencilLinePass = new PencilLinesPass({
    width: renderer.domElement.clientWidth,
    height: renderer.domElement.clientHeight,
    scene,
    camera,
  })

  composer.addPass(renderPass)
  // composer.addPass(pencilLinePass)

  controls = new OrbitControls(camera, renderer.domElement)

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
        trigger: firstSection.value,
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
  controls.update()
  renderer.render(scene, camera)
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
  background-color: grey;
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
    /* pointer-events: none; */
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
</style>
