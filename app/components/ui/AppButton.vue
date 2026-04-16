<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    disabled?: boolean
    loading?: boolean
    variant?: 'primary' | 'ghost'
  }>(),
  {
    type: 'button',
    disabled: false,
    loading: false,
    variant: 'primary',
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex w-full max-w-md items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    :class="
      variant === 'primary'
        ? 'bg-[#9dd9cf] text-slate-900 hover:bg-[#8bcbc0] focus-visible:ring-teal-500'
        : 'bg-transparent text-teal-700 underline hover:text-teal-800'
    "
  >
    <span
      v-if="loading"
      class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
