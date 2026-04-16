<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'warning'
  }>(),
  { variant: 'info' },
)

const visible = ref(true)

const boxClass = computed(() =>
  props.variant === 'info'
    ? 'border-[#b8d4f0] bg-[#e8f2fc] text-[#1a4a6e]'
    : 'border-[#f0c9a0] bg-[#fff4e8] text-[#7a4a1a]',
)
</script>

<template>
  <div
    v-if="visible"
    class="flex gap-3 rounded-lg border px-3 py-2.5 text-[13px] leading-snug sm:text-[14px]"
    :class="boxClass"
    role="status"
  >
    <span
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/80 text-sm font-bold leading-none"
      aria-hidden="true"
    >
      {{ variant === 'info' ? 'i' : '!' }}
    </span>
    <p class="min-w-0 flex-1 pt-0.5">
      <slot />
    </p>
    <button
      type="button"
      class="shrink-0 rounded p-1 text-current opacity-70 hover:opacity-100"
      aria-label="Cerrar"
      @click="visible = false"
    >
      ×
    </button>
  </div>
</template>
