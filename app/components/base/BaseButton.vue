<template>
  <button
    :class="[
      'font-bold tracking-widest py-3.5 px-6 rounded-lg border-none cursor-pointer transition-all text-sm',
      (!variant || variant === 'primary') && 'bg-[#4EC9C0] text-white hover:bg-[#3ABFB7]',
      variant === 'ghost' && 'bg-transparent text-[#111760]',
      variant === 'danger' && 'bg-red-600 text-white',
      block && 'w-full block',
      (disabled || loading) && '!opacity-50 !cursor-not-allowed',
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2 align-middle" />
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  block?: boolean
  disabled?: boolean
  loading?: boolean
}>()
</script>
