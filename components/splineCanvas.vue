<script setup>
import { Application } from '@splinetool/runtime'
const props = defineProps({
  canvasId: {
    type: String,
    default: 'spline-canvas',
  },
  url: {
    type: String,
  },
  canvasStyle: {
    type: Object,
    default: () => ({ height: '100%', width: '100%', outline: 'none' }),
  },
})

const canvasRef = ref(null)
const splineInstance = ref(null)
const loaded = ref(false)
const emit = defineEmits(['loaded', 'error'])

const play = () => splineInstance.value?.play()
const pause = () => splineInstance.value?.stop()
const setVariables = variables => splineInstance.value?.setVariables(variables)
const setVariable = (name, value) =>
  splineInstance.value?.setVariable(name, value)
const getVariables = () => splineInstance.value?.getVariables()
const getVariable = name => splineInstance.value?.getVariable(name)
const stop = () => splineInstance.value?.stop()
const setBackgroundColor = color =>
  splineInstance.value?.setBackgroundColor(color)
const getAllObjects = () => splineInstance.value?.getAllObjects()
const getSplineEvents = () => splineInstance.value?.getSplineEvents()
const setZoom = zoom => splineInstance.value?.setZoom(zoom)
const setSize = (width, height) => splineInstance.value?.setSize(width, height)
const findObjectById = uuid => splineInstance.value?.findObjectById(uuid)
const findObjectByName = name => splineInstance.value?.findObjectByName(name)
const emitEvent = (eventName, nameOrUuid) =>
  splineInstance.value?.emitEvent(eventName, nameOrUuid)
const emitEventReverse = (eventName, nameOrUuid) =>
  splineInstance.value?.emitEventReverse(eventName, nameOrUuid)
const addEventListener = (eventName, cb) =>
  splineInstance.value?.addEventListener(eventName, cb)
const removeEventListener = (eventName, cb) =>
  splineInstance.value?.removeEventListener(eventName, cb)

defineExpose({
  play,
  pause,
  setVariables,
  setVariable,
  getVariables,
  getVariable,
  stop,
  setBackgroundColor,
  getAllObjects,
  getSplineEvents,
  setZoom,
  setSize,
  findObjectById,
  findObjectByName,
  emitEvent,
  emitEventReverse,
  addEventListener,
  removeEventListener,
})

onMounted(() => {
  if (canvasRef.value) {
    splineInstance.value = new Application(canvasRef.value)
    splineInstance.value
      .load(props.url)
      .then(() => {
        console.log('spline loaded', props.canvasId)
        loaded.value = true
      })
      .catch(error => console.log('error', error))
  }
})

onBeforeUnmount(() => {
  stop()
})
</script>

<template>
  <div class="spline" :class="{ 'is-loaded': loaded }">
    <canvas
      ref="canvasRef"
      :style="canvasStyle"
      :id="canvasId"
      class="spline-canvas"
    ></canvas>
  </div>
</template>

<style>
.spline {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  &.is-loaded {
    opacity: 1;
  }
}
</style>
