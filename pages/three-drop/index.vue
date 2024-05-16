<template>
  <div ref="container" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector2 } from 'three'
import Stats from 'three/addons/libs/stats.module.js'

const container = ref(null)
let scene, camera, renderer, controls
const { init, controls: shaderControls } = useThreeBlob()
onMounted(() => {
  const options = {
    color: 0xffffff,
    metalness: 0,
    roughness: 0.15,
    transmission: 1,
    ior: 1.5,
    reflectivity: 0.5,
    thickness: 1,
    envMapIntensity: 1,
    clearcoat: 0.5,
    clearcoatRoughness: 0.07,
    normalScale: new Vector2(0.37),
    clearcoatNormalScale: 0,
    normalRepeat: 2,
    bloomThreshold: 0.88,
    bloomStrength: 0.08,
    bloomRadius: 0.1,
  }

  // Create scene
  scene = new THREE.Scene()

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 5

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setClearColor(0x1f1e1c, 1)
  renderer.shadowMap.enabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  // Create post-processing effects
  const renderPass = new RenderPass(scene, camera)
  const bloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    options.bloomStrength,
    options.bloomRadius,
    options.bloomThreshold
  )

  const composer = new EffectComposer(renderer)
  composer.addPass(renderPass)
  composer.addPass(bloomPass)

  // Create orbit controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.25
  controls.rotateSpeed = 0.35
  controls.zoomSpeed = 0.5

  const hdrEquirect = new RGBELoader().load('/images/glass-effect.hdr', () => {
    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping
  })

  const textureLoader = new THREE.TextureLoader()
  const normalMapTexture = textureLoader.load('/images/normal-example.jpg')
  normalMapTexture.wrapS = THREE.RepeatWrapping
  normalMapTexture.wrapT = THREE.RepeatWrapping

  const material = new THREE.MeshPhysicalMaterial({
    metalness: options.metalness,
    roughness: options.roughness,
    transmission: options.transmission,
    ior: options.ior,
    reflectivity: options.reflectivity,
    thickness: options.thickness,
    envMap: hdrEquirect,
    envMapIntensity: options.envMapIntensity,
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
    clearcoat: options.clearcoat,
    clearcoatRoughness: options.clearcoatRoughness,
    clearcoatNormalMap: normalMapTexture,
    clearcoatNormalScale: new Vector2(options.clearcoatNormalScale),
  })

  let mesh = null
  new GLTFLoader().load('/models/water-drop.glb', gltf => {
    const drop = gltf.scene.children[0]
    // Just copy the geometry from the loaded model
    const geometry = drop.geometry.clone()

    // Adjust geometry to suit our scene
    geometry.translate(0, 0, 0)
    geometry.scale(0.01, 0.01, 0.01)

    // Create a new mesh and place it in the scene
    mesh = new THREE.Mesh(geometry, material)
    mesh.scale.set(0.25, 0.25, 0.25)
    scene.add(mesh)

    const box = new THREE.BoxHelper(mesh, 0xffff00)
    // scene.add(box)

    init(mesh)
    shaderControls.shapeGroupPosition.y = 2.3
    shaderControls.shapeGroupScale.x = 1.2
    shaderControls.shapeGroupScale.y = 1.2
    shaderControls.shapeGroupScale.z = 1.2
    // Discard the loaded model
    gltf.scene.children.forEach(child => {
      child.geometry.dispose()
      child.material.dispose()
    })
  })

  const light = new THREE.DirectionalLight(0xfff0dd, 1)
  light.position.set(0, 5, 10)
  scene.add(light)

  let currentTime = 0

  const stats = new Stats()
  document.body.appendChild(stats.dom)

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()

    currentTime += 0.05
    scene.traverse(object => {
      if (
        object.isMesh &&
        object.material &&
        object.material.uniforms &&
        object.material.uniforms.uTime !== undefined
      ) {
        object.material.uniforms.uTime.value = currentTime
      }
    })

    renderer.render(scene, camera)
    stats.update()
  }
  animate()
})

window?.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
</script>

<style>
body {
  margin: 0;
}
</style>
