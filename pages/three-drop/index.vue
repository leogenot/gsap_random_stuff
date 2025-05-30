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
      <NuxtImg class="grainy-drop" src="images/waterDropDark.png" />
      <NuxtIcon ref="logo" class="logo" name="logo" />
    </div>
    <div class="section section-3">
      <!-- <NuxtImg class="grainy-drop" src="images/waterDropClear.png" /> -->
      <grainy-drop class="grainy-drop"></grainy-drop>
      <NuxtIcon ref="logo" class="logo" name="logo" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap, ScrollTrigger } from 'gsap/all'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector2 } from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js'
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js'
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js'
import {
  MaskPass,
  ClearMaskPass,
} from 'three/addons/postprocessing/MaskPass.js'
import { TexturePass } from 'three/addons/postprocessing/TexturePass.js'

import { BleachBypassShader } from 'three/addons/shaders/BleachBypassShader.js'
import { ColorifyShader } from 'three/addons/shaders/ColorifyShader.js'
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js'
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js'
import { SepiaShader } from 'three/addons/shaders/SepiaShader.js'
import { ExposureShader } from 'three/addons/shaders/ExposureShader.js'
import { HueSaturationShader } from 'three/addons/shaders/HueSaturationShader.js'
import { VignetteShader } from 'three/addons/shaders/VignetteShader.js'
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { PencilLinesPass } from '/utils/PencilLinesPass'
gsap.registerPlugin(ScrollTrigger)

const material = ref(null)
const container = ref(null)
const firstSection = ref(null)
const scrollY = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)
const isLoaded = ref(false)
let scene, camera, renderer, mesh, stats, composer, pencilLinePass
const options = ref({
  color: 0xdbdfff,
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

const {
  init,
  controls: shaderControls,
  options: shaderOptions,
} = useThreeBlob()

const fitCameraToCenteredObject = function (
  camera,
  object,
  offset,
  orbitControls
) {
  const boundingBox = new THREE.Box3()
  boundingBox.setFromObject(object)

  var middle = new THREE.Vector3()
  var size = new THREE.Vector3()
  boundingBox.getSize(size)

  // figure out how to fit the box in the view:
  // 1. figure out horizontal FOV (on non-1.0 aspects)
  // 2. figure out distance from the object in X and Y planes
  // 3. select the max distance (to fit both sides in)
  //
  // The reason is as follows:
  //
  // Imagine a bounding box (BB) is centered at (0,0,0).
  // Camera has vertical FOV (camera.fov) and horizontal FOV
  // (camera.fov scaled by aspect, see fovh below)
  //
  // Therefore if you want to put the entire object into the field of view,
  // you have to compute the distance as: z/2 (half of Z size of the BB
  // protruding towards us) plus for both X and Y size of BB you have to
  // figure out the distance created by the appropriate FOV.
  //
  // The FOV is always a triangle:
  //
  //  (size/2)
  // +--------+
  // |       /
  // |      /
  // |     /
  // | F° /
  // |   /
  // |  /
  // | /
  // |/
  //
  // F° is half of respective FOV, so to compute the distance (the length
  // of the straight line) one has to: `size/2 / Math.tan(F)`.
  //
  // FTR, from https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  // the camera.fov is the vertical FOV.

  const fov = camera.fov * (Math.PI / 180)
  const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect)
  let dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2))
  let dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2))
  let cameraZ = Math.max(dx, dy)

  // offset the camera, if desired (to avoid filling the whole canvas)
  if (offset !== undefined && offset !== 0) cameraZ *= offset

  camera.position.set(0, 0, cameraZ)

  // set the far plane of the camera so that it easily encompasses the whole object
  const minZ = boundingBox.min.z
  const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ

  camera.far = cameraToFarEdge * 3
  camera.updateProjectionMatrix()

  if (orbitControls !== undefined) {
    // set camera to rotate around the center
    orbitControls.target = new THREE.Vector3(0, 0, 0)

    // prevent camera from zooming out far enough to create far plane cutoff
    orbitControls.maxDistance = cameraToFarEdge * 2
  }
}

onMounted(() => {
  const shaderBleach = BleachBypassShader
  const shaderSepia = SepiaShader
  const shaderVignette = VignetteShader
  const shaderHueSaturation = HueSaturationShader
  const shaderExposure = ExposureShader

  const effectBleach = new ShaderPass(shaderBleach)
  const effectSepia = new ShaderPass(shaderSepia)
  const effectVignette = new ShaderPass(shaderVignette)
  const gammaCorrection = new ShaderPass(GammaCorrectionShader)
  const effectHueSaturation = new ShaderPass(shaderHueSaturation)
  effectHueSaturation.uniforms['hue'].value = 0.7
  effectHueSaturation.uniforms['saturation'].value = 0
  const effectExposure = new ShaderPass(shaderExposure)

  effectExposure.uniforms['exposure'].value = 2

  effectBleach.uniforms['opacity'].value = 0.95

  effectSepia.uniforms['amount'].value = 0.9

  effectVignette.uniforms['offset'].value = 0.95
  effectVignette.uniforms['darkness'].value = 1.6

  const effectBloom = new BloomPass(1.5)
  const effectFilm = new FilmPass(0.35)
  const effectFilmBW = new FilmPass(0.35, true)
  const effectDotScreen = new DotScreenPass(new THREE.Vector2(0, 0), 0.5, 5)

  const effectHBlur = new ShaderPass(HorizontalBlurShader)
  const effectVBlur = new ShaderPass(VerticalBlurShader)
  effectHBlur.uniforms['h'].value = 0.15 / (container.value.clientWidth / 2)
  effectVBlur.uniforms['v'].value = 0.15 / (container.value.clientHeight / 2)

  const effectColorify1 = new ShaderPass(ColorifyShader)
  const effectColorify2 = new ShaderPass(ColorifyShader)
  effectColorify1.uniforms['color'] = new THREE.Uniform(
    new THREE.Color('skyblue')
  )
  effectColorify2.uniforms['color'] = new THREE.Uniform(
    new THREE.Color(1, 0.75, 0.5)
  )

  const clearMask = new ClearMaskPass()

  const rtParameters = {
    stencilBuffer: true,
  }

  scene = new THREE.Scene({ alpha: true })
  camera = new THREE.PerspectiveCamera(
    1,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  )
  camera.position.z = 2
  camera.position.y = 1

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  // renderer.setClearColor(0x1f1e1c, 1)
  // renderer.setClearColor(0x000000, 0)
  // renderer.shadowMap.enabled = true
  renderer.setClearColor(0x000000, 0)
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  composer = new EffectComposer(renderer)

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

  const renderPass = new RenderPass(scene, camera)

  composer.renderTarget1.format = THREE.RGBAFormat
  composer.renderTarget2.format = THREE.RGBAFormat

  composer.addPass(renderPass)

  // composer.addPass(effectBleach)
  // composer.addPass(effectVignette)
  // composer.addPass(effectColorify1)
  // composer.addPass(effectColorify2)
  // composer.addPass(effectHueSaturation)
  composer.addPass(effectFilm)
  composer.addPass(effectExposure)
  // composer.addPass(effectDotScreen)
  composer.addPass(effectHBlur)
  composer.addPass(effectVBlur)

  new GLTFLoader().load('/models/water-drop.glb', gltf => {
    const drop = gltf.scene.children[0]
    const geometry = drop.geometry.clone()

    geometry.translate(0, 0, 0)
    geometry.scale(0.01, 0.01, 0.01)
    var middle = new THREE.Vector3()
    geometry.computeBoundingBox()
    geometry.boundingBox.getCenter(middle)

    mesh = new THREE.Mesh(geometry, material.value)
    mesh.scale.set(0.25, 0.25, 0.25)
    scene.add(mesh)
    mesh.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
    )

    const box = new THREE.BoxHelper(mesh, 0xffff00)
    // scene.add(box)

    init(mesh)
    shaderControls.shapeGroupPosition.y = -1
    shaderControls.shapeGroupScale.x = 1.2
    shaderControls.shapeGroupScale.y = 1.2
    shaderControls.shapeGroupScale.z = 1.2

    gltf.scene.children.forEach(child => {
      child.geometry.dispose()
      child.material.dispose()
    })
    fitCameraToCenteredObject(camera, mesh)

    const orbitRadius = 99
    const orbitSpeed = 0.001

    function updateCameraPosition() {
      // Calculate new camera position based on scroll
      const orbitAngle = scrollY.value * orbitSpeed
      const cameraX = Math.sin(orbitAngle) * orbitRadius
      const cameraZ = Math.cos(orbitAngle) * orbitRadius

      // Update camera position
      camera.position.x = cameraX
      camera.position.z = cameraZ

      // Set camera to always look at the mesh
      camera.lookAt(mesh.position)
    }
    gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: firstSection.value,
          onUpdate: updateCameraPosition,
          start: 'top 0',
          end: 'bottom top',
          scrub: 1,
        },
      }
    )

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
  composer.render()
  stats.update()
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
      background-color: #e4d7d0;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
    }
    &-3 {
      background-color: #213438;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
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

  .grainy-drop {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 50vh;
    width: 50vw;
    pointer-events: none;
    object-fit: contain;
    /* img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    } */

    svg {
      width: 100%;
      height: 100%;
      overflow: hidden;
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
