<template>
  <div class="inline-flex items-center gap-2">
    <span class="line-through text-red-500 text-base">{{ previous.toFixed(2) }}</span>
    <strong class="text-base font-bold text-gray-900">{{ current.toFixed(2) }}</strong>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  current: number
  previous: number
}>()
</script>
