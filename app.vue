<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)
const route = useRoute()
watch(
  () => route.path,
  () => {
    console.log('route changed')
    ScrollTrigger.refresh()
  }
)
</script>
