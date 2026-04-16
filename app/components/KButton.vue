<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'outline'
  loading?: boolean
}>(), {
  type: 'button',
  variant: 'primary',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="w-full py-3.5 px-6 rounded-lg font-bold text-sm tracking-widest transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kambista-teal"
    :class="[
      variant === 'outline'
        ? 'border-2 border-kambista-teal text-kambista-teal hover:bg-kambista-teal hover:text-white'
        : (disabled || loading)
          ? 'bg-kambista-teal-muted text-white cursor-not-allowed'
          : 'bg-kambista-teal text-white hover:bg-kambista-teal-hover active:bg-kambista-teal-active shadow-sm hover:shadow-md',
    ]"
  >
    <span v-if="loading" class="flex items-center justify-center gap-2">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Cargando...
    </span>
    <slot v-else />
  </button>
</template>
