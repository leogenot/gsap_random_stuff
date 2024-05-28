<template>
  <div class="three-drop">
    <div class="section" ref="firstSection">
      <NuxtIcon ref="logo" class="logo" name="logo" />
    </div>
    <div
      ref="container"
      class="container"
      :class="{ 'is-loaded': isLoaded }"
    ></div>
    <div class="section section-2">
      <NuxtIcon ref="logo" class="logo" name="logo" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector2 } from 'three'
import Stats from 'three/addons/libs/stats.module.js'

const meshRef = ref(null)
const material = ref(null)
const container = ref(null)
const firstSection = ref(null)
const scrollY = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)
const isLoaded = ref(false)
let scene, camera, renderer, controls, mesh, stats, clock, speed, delta
let time = 0
const options = ref({
  color: 0xdbdfff,
  // color: 0x5d7f80,
  metalness: 0.1,
  roughness: 0.2,
  transmission: 1,
  ior: 1.3,
  reflectivity: 0.4,
  thickness: 1.5,
  envMapIntensity: 1.1,
  clearcoat: 0.25,
  clearcoatRoughness: 0.1,
  normalScale: 1,
  clearcoatNormalScale: 0,
  normalRepeat: 1,
  bloomThreshold: 0.93,
  bloomStrength: 0.46,
  bloomRadius: 1,
  enableSwoopingCamera: true,
})

const {
  init,
  controls: shaderControls,
  options: shaderOptions,
} = useThreeBlob()

onMounted(() => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 2
  camera.position.y = 1

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setClearColor(0x1f1e1c, 1)
  renderer.shadowMap.enabled = true
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  const renderPass = new RenderPass(scene, camera)
  const bloomPass = new UnrealBloomPass(
    new Vector2(container.value.clientWidth, container.value.clientHeight),
    options.bloomStrength,
    options.bloomRadius,
    options.bloomThreshold
  )

  const composer = new EffectComposer(renderer)
  composer.addPass(renderPass)
  composer.addPass(bloomPass)

  const hdrEquirect = new RGBELoader().load(
    '/images/empty_warehouse_01_2k.hdr',
    () => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping
    }
  )
  const textureLoader = new THREE.TextureLoader()
  const normalMapTexture = textureLoader.load('/images/normal.jpg')
  normalMapTexture.wrapS = THREE.RepeatWrapping
  normalMapTexture.wrapT = THREE.RepeatWrapping
  normalMapTexture.repeat.set(options.normalRepeat, options.normalRepeat)

  material.value = new THREE.MeshPhysicalMaterial({
    color: options.value.color,
    metalness: options.value.metalness,
    roughness: options.value.roughness,
    transmission: options.value.transmission,
    ior: options.value.ior,
    reflectivity: options.value.reflectivity,
    thickness: options.value.thickness,
    envMap: hdrEquirect,
    envMapIntensity: options.value.envMapIntensity,
    normalMap: normalMapTexture,
    normalScale: new THREE.Vector2(options.value.normalScale),
    clearcoatNormalMap: normalMapTexture,
    clearcoat: options.value.clearcoat,
    clearcoatRoughness: options.value.clearcoatRoughness,
    clearcoatNormalScale: new Vector2(options.value.clearcoatNormalScale),
  })

  new GLTFLoader().load('/models/water-drop.glb', gltf => {
    const drop = gltf.scene.children[0]
    const geometry = drop.geometry.clone()

    geometry.translate(0, 0, 0)
    geometry.scale(0.01, 0.01, 0.01)

    mesh = new THREE.Mesh(geometry, material.value)
    mesh.scale.set(0.25, 0.25, 0.25)
    scene.add(mesh)

    init(mesh)
    shaderControls.shapeGroupPosition.y = 2.3
    shaderControls.shapeGroupScale.x = 1.2
    shaderControls.shapeGroupScale.y = 1.2
    shaderControls.shapeGroupScale.z = 1.2

    console.log('shader', shaderOptions)

    gltf.scene.children.forEach(child => {
      child.geometry.dispose()
      child.material.dispose()
    })

    gsap.to(mesh.rotation, {
      y: 3,

      scrollTrigger: {
        trigger: firstSection.value,
        scrub: 1,
        start: 'top 0',
        end: 'bottom top',
      },
    })
    gsap.to(
      shaderOptions.perlin,
      {
        size: 3.0,
        waves: 20.0,
        complex: 0.1,
        displace: 0.1,
        eqcolor: 4.0,
        rcolor: 0.9,
        gcolor: 2.5,
        bcolor: 1.3,
        scrollTrigger: {
          trigger: firstSection.value,
          scrub: 1,
          start: 'top 0',
          end: 'bottom top',
        },
      },
      '<'
    )
  })

  const light = new THREE.DirectionalLight(0x5d7f80, 0)
  light.position.set(0, 13, 10)
  // scene.add(light)

  stats = new Stats()
  document.body.appendChild(stats.dom)

  animate()

  window.addEventListener('scroll', onScroll)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onWindowResize)
})

const animate = () => {
  requestAnimationFrame(animate)
  isLoaded.value = true
  renderer.render(scene, camera)
  stats.update()
  // time += 0.01

  // update(time)
}

// Update
// ------

const update = time => {
  if (options.value.enableSwoopingCamera) {
    camera.position.x = Math.sin((time / 10) * Math.PI * 2) * 2
    camera.position.y = Math.cos((time / 10) * Math.PI * 2) * 2
    camera.position.z = 2
    camera.lookAt(scene.position)
  }
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

function onMouseMove(event) {
  mouseX.value = (event.clientX / window.innerWidth) * 2 - 1
  mouseY.value = -(event.clientY / window.innerHeight) * 2 + 1
}

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style lang="postcss">
.three-drop {
  .section {
    height: 200vh;
    position: relative;
    background-color: #1f1e1c;
    &-2 {
      background-color: #f0f0f0;
    }
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
    transition: opacity 0.2s ease-in-out, filter 0.5s ease-in-out;
    canvas {
      width: 100%;
      height: 100%;
      border: 1px solid red;
    }

    &.is-loaded {
      opacity: 1;
      filter: blur(0);
    }
  }
}
</style>
