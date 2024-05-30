<template>
  <main>
    <select
      name="snippet-selector"
      id="snippet-selector"
      class="select"
      @change="handleSelection"
    >
      <option value="" selected>--Please choose your snippet--</option>
      <option
        v-for="option in options"
        :value="option.value"
        :key="option.value"
      >
        {{ option.name }}
      </option>
    </select>
    <slot />
  </main>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const options = [
  {
    name: 'text-avoid',
    value: 'text-avoid',
  },
  {
    name: 'magnets',
    value: 'magnets',
  },
  {
    name: 'loader',
    value: 'loader',
  },
  {
    name: 'scrollytelling',
    value: 'scrollytelling',
  },
  {
    name: '3d-sphere',
    value: '3d-sphere',
  },
  {
    name: 'spline',
    value: 'spline',
  },
  {
    name: 'three-pencil-material',
    value: 'three-pencil-material',
  },
  {
    name: 'three-scroll',
    value: 'three-scroll',
  },

  {
    name: 'three-drop',
    value: 'three-drop',
  },
  {
    name: 'three-transition',
    value: 'three-transition',
  },
  {
    name: 'scrolltrigger-card-stack',
    value: 'scrolltrigger-card-stack',
  },
  {
    name: 'floating-items',
    value: 'floating-items',
  },
  {
    name: 'spline-benchmark',
    value: 'spline-benchmark',
  },
  {
    name: 'svg-card',
    value: 'svg-card',
  },
  {
    name: 'slider',
    value: 'slider',
  },
  {
    name: 'hover-pill',
    value: 'hover-pill',
  },
  {
    name: 'section-reveal',
    value: 'section-reveal',
  },
]

const handleSelection = event => {
  const selectedValue = event.target.value

  router.push(`/${selectedValue}`)
}
</script>

<style lang="postcss">
.select {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translate(0, -50%);
  z-index: 999999999;
  pointer-events: all;
}
</style>
