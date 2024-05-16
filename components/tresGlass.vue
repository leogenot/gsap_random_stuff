<script setup lang="ts">
import { FBXModel, OrbitControls } from '@tresjs/cientos'
import {
  BasicShadowMap,
  EquirectangularReflectionMapping,
  NoToneMapping,
  SRGBColorSpace,
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { useTexture } from '@tresjs/core'
const gl = {
  clearColor: '#000',
  shadows: true,
  alpha: false,
  castShadows: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
}

const { map, normalMap } = await useTexture({
  map: '/images/bg-texture.jpg',
  normalMap: '/images/water-normal.jpg',
})

const planeRef = shallowRef(null)

const hdrEquirect = await new RGBELoader().load(
  '/images/glass-effect.hdr',
  () => {
    hdrEquirect.mapping = EquirectangularReflectionMapping
  }
)

const options = reactive({
  transmission: 1,
  thickness: 0.7,
  roughness: 0.3,
  envMap: null,
  envMap: hdrEquirect,
  clearcoatNormalMap: normalMap,
  envMapIntensity: 1.5,
})

const boxRef = shallowRef(null)
const { onLoop } = useRenderLoop()
onLoop(({ delta, elapsed }) => {
  if (boxRef.value) {
    boxRef.value.rotation.y += delta
    boxRef.value.rotation.z = elapsed * 0.2
  }
})

const { nodes } = await useGLTF('/models/Jeep_done.glb')
</script>

<template>
  <!-- <TresLeches preset="realistic" /> -->
  <TresCanvas window-size v-bind="gl" preset="realistic">
    <TresPerspectiveCamera
      :position="[0, 0, 3]"
      :fov="75"
      :aspect="1"
      :near="0.1"
      :far="1000"
    />
    <OrbitControls />
    <!-- <TresGridHelper :args="[30, 30]" :position="[0, -2.5, 0]" /> -->
    <!-- <TresMesh :position="[-0, 0, 0]">
      <TresIcosahedronGeometry :args="[1, 10]" />
      <TresMeshPhysicalMaterial
        :transmission="options.transmission"
        :thickness="options.thickness"
        :roughness="options.roughness"
        :env-map="options.envMap"
        :env-map-intensity="options.envMapIntensity"
        :clearcoat-normal-map="normalMap"
      />
    </TresMesh> -->
    <Suspense> </Suspense>
    <TresMesh ref="boxRef" :scale="0.3">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshNormalMaterial />
    </TresMesh>
    <!-- <TresMesh receive-shadow :position="[1, 0, 0]">
      <TresPlaneGeometry :args="[10, 10, 10, 10]" />
      <TresMeshStandardMaterial color="grey" />
    </TresMesh> -->

    <TresMesh ref="planeRef" receive-shadow :position="[0, 0, -1]">
      <TresPlaneGeometry :args="[5, 5]" />
      <TresMeshBasicMaterial color="grey" />
      <!-- <TresMeshBasicMaterial :map="map" /> -->
    </TresMesh>

    <TresDirectionalLight :position="[0, 2, 4]" :intensity="1" cast-shadow />
    <TresAmbientLight :intensity="0.2" />
  </TresCanvas>
</template>
