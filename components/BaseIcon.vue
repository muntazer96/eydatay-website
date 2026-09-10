<script setup lang="ts">
import { computed } from 'vue'
import { mdiPath } from '~/utils/icons'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    color?: string
    stroke?: boolean
  }>(),
  {
    size: 24,
    color: 'currentColor',
    stroke: false,
  },
)

const path = computed(() => mdiPath(props.name))
</script>

<template>
  <svg
    class="ey-icon"
    :width="size"
    :height="size"
    :viewBox="stroke ? '0 0 24 24' : '0 0 24 24'"
    :fill="stroke ? 'none' : color"
    :stroke="stroke ? color : 'none'"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    aria-hidden="true"
    focusable="false"
  >
    <path v-if="!stroke" :d="path" />
    <path v-else :d="path" fill="none" />
  </svg>
</template>

<style scoped>
.ey-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>