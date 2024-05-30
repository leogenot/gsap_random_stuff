<template>
  <div class="three-transition">
    <div ref="sceneContainer" class="scene-container"></div>
    <div class="section section-1" ref="firstSection"></div>
    <div class="section section-2"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { gsap, ScrollTrigger } from 'gsap/all'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector2 } from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js'
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js'
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js'

import { BleachBypassShader } from 'three/addons/shaders/BleachBypassShader.js'
import { ColorifyShader } from 'three/addons/shaders/ColorifyShader.js'
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js'
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js'
import { SepiaShader } from 'three/addons/shaders/SepiaShader.js'
import { ExposureShader } from 'three/addons/shaders/ExposureShader.js'
import { HueSaturationShader } from 'three/addons/shaders/HueSaturationShader.js'
import { VignetteShader } from 'three/addons/shaders/VignetteShader.js'
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'
gsap.registerPlugin(ScrollTrigger)

let model, composer1, composer2, camera, scene, renderer, stats, controls
const sceneContainer = ref(null)
const modelLoaded = ref(false)
const firstSection = ref(null)
const scrollY = ref(0)
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

onMounted(async () => {
  if (!sceneContainer.value) return
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
  effectHBlur.uniforms['h'].value =
    0.15 / (sceneContainer.value.clientWidth / 2)
  effectVBlur.uniforms['v'].value =
    0.15 / (sceneContainer.value.clientHeight / 2)

  const effectColorify1 = new ShaderPass(ColorifyShader)
  const effectColorify2 = new ShaderPass(ColorifyShader)
  effectColorify1.uniforms['color'] = new THREE.Uniform(
    new THREE.Color('green')
  )
  effectColorify2.uniforms['color'] = new THREE.Uniform(new THREE.Color('red'))
  // Scene setup
  scene = new THREE.Scene({ alpha: true })
  camera = new THREE.PerspectiveCamera(
    75,
    sceneContainer.value.clientWidth / sceneContainer.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(
    sceneContainer.value.clientWidth,
    sceneContainer.value.clientHeight
  )
  sceneContainer.value.appendChild(renderer.domElement)

  // Create render targets
  const renderTarget1 = new THREE.WebGLRenderTarget(
    sceneContainer.value.clientWidth,
    sceneContainer.value.clientHeight
  )
  const renderTarget2 = new THREE.WebGLRenderTarget(
    sceneContainer.value.clientWidth,
    sceneContainer.value.clientHeight
  )

  // Add orbit controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.update()
  composer1 = new EffectComposer(renderer, renderTarget1)
  composer2 = new EffectComposer(renderer, renderTarget2)

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
  // Create materials
  const material1 = new THREE.MeshPhysicalMaterial({
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
  const material2 = new THREE.MeshPhysicalMaterial({
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
  const renderPass1 = new RenderPass(scene, camera)
  const renderPass2 = new RenderPass(scene, camera)

  composer1.renderTarget1.format = THREE.RGBAFormat
  composer1.renderTarget2.format = THREE.RGBAFormat

  composer1.addPass(renderPass1)
  composer1.addPass(effectColorify2)
  composer1.addPass(effectExposure)

  composer2.renderTarget1.format = THREE.RGBAFormat
  composer2.renderTarget2.format = THREE.RGBAFormat

  composer2.addPass(renderPass2)
  composer2.addPass(effectColorify1)
  composer2.addPass(effectExposure)
  await new Promise(resolve => {
    new GLTFLoader().load('/models/water-drop.glb', gltf => {
      const drop = gltf.scene.children[0]
      const geometry = drop.geometry.clone()

      geometry.translate(0, 0, 0)
      geometry.scale(0.01, 0.01, 0.01)
      var middle = new THREE.Vector3()
      geometry.computeBoundingBox()
      geometry.boundingBox.getCenter(middle)

      model = new THREE.Mesh(geometry, material1)
      model.scale.set(0.25, 0.25, 0.25)
      scene.add(model)
      model.geometry.applyMatrix4(
        new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
      )

      model = new THREE.Mesh(geometry, material1)
      scene.add(model)

      const box = new THREE.BoxHelper(model, 0xffff00)
      scene.add(box)

      init(model)
      shaderControls.shapeGroupPosition.y = -1
      shaderControls.shapeGroupScale.x = 1.2
      shaderControls.shapeGroupScale.y = 1.2
      shaderControls.shapeGroupScale.z = 1.2
      gltf.scene.children.forEach(child => {
        child.geometry.dispose()
        child.material.dispose()
      })
      fitCameraToCenteredObject(camera, model)
      // const orbitRadius = 99
      // const orbitSpeed = 0.001

      // function updateCameraPosition() {
      //   // Calculate new camera position based on scroll
      //   const orbitAngle = scrollY.value * orbitSpeed
      //   const cameraX = Math.sin(orbitAngle) * orbitRadius
      //   const cameraZ = Math.cos(orbitAngle) * orbitRadius

      //   // Update camera position
      //   camera.position.x = cameraX
      //   camera.position.z = cameraZ

      //   // Set camera to always look at the mesh
      //   camera.lookAt(model.position)
      // }
      // gsap.to(
      //   {},
      //   {
      //     scrollTrigger: {
      //       trigger: firstSection.value,
      //       onUpdate: updateCameraPosition,
      //       start: 'top 0',
      //       end: 'bottom top',
      //       scrub: 1,
      //     },
      //   }
      // )

      // gsap.to(
      //   shaderOptions.perlin,
      //   {
      //     size: 3.0,
      //     waves: 20.0,
      //     complex: 0.1,
      //     displace: 0.1,
      //     eqcolor: 4.0,
      //     rcolor: 0.9,
      //     gcolor: 2.5,
      //     bcolor: 1.3,
      //     scrollTrigger: {
      //       trigger: firstSection.value,
      //       scrub: 1,
      //       start: 'top 0',
      //       end: 'bottom top',
      //     },
      //   },
      //   '<'
      // )
      modelLoaded.value = true
      resolve()
    })
  })

  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Render cube with first material to render target 1
  renderer.setRenderTarget(renderTarget1)
  renderer.render(scene, camera)

  // Render cube with second material to render target 2
  model.material = material2
  renderer.setRenderTarget(renderTarget2)
  renderer.render(scene, camera)

  // Reset the cube material to the first material for rendering
  model.material = material1

  // Create a scene to render the transition
  const transitionScene = new THREE.Scene()
  const transitionCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const transitionMaterial = new THREE.ShaderMaterial({
    uniforms: {
      texture1: { value: renderTarget1.texture },
      texture2: { value: renderTarget2.texture },
      mixRatio: { value: 0.0 },
    },
    vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
    fragmentShader: `
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform float mixRatio;
  varying vec2 vUv;
  void main() {
    vec4 tex1 = texture2D(texture1, vUv);
    vec4 tex2 = texture2D(texture2, vUv);
    // Use step function for sharp transition
    float curtain = step(mixRatio, vUv.y);
    gl_FragColor = mix(tex1, tex2, curtain);
  }
`,
  })
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), transitionMaterial)
  transitionScene.add(quad)

  // Animation function
  const animate = () => {
    requestAnimationFrame(animate)

    // Render the main scene to the render targets
    renderer.setRenderTarget(renderTarget1)
    renderer.clear()
    model.material = material1
    renderer.render(scene, camera)
    composer1.render()

    renderer.setRenderTarget(renderTarget2)
    renderer.clear()
    model.material = material2
    renderer.render(scene, camera)
    composer2.render()

    // Render the transition scene
    renderer.setRenderTarget(null)
    renderer.render(transitionScene, transitionCamera)

    stats.update()
  }

  animate()

  // Handle scroll
  const onScroll = () => {
    scrollY.value = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const mixRatio = scrollY.value / maxScroll
    transitionMaterial.uniforms.mixRatio.value = mixRatio
  }

  window.addEventListener('scroll', onScroll)

  // Handle window resize
  const onWindowResize = () => {
    camera.aspect =
      sceneContainer.value.clientWidth / sceneContainer.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(
      sceneContainer.value.clientWidth,
      sceneContainer.value.clientHeight
    )
  }

  window.addEventListener('resize', onWindowResize)

  // Clean up
  onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize)
    window.removeEventListener('scroll', onScroll)
    sceneContainer.value.removeChild(renderer.domElement)
  })
})

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
</script>

<style scoped>
.three-transition {
}
.scene-container {
  width: 50vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.section {
  &-1 {
    background-color: grey;
  }
  &-2 {
    background-color: black;
  }
  height: 100vh;
}
</style>
