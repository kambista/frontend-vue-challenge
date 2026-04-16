<template>
  <Transition
    enter-active-class="transition-all duration-200"
    leave-active-class="transition-all duration-200"
    enter-from-class="opacity-0 -translate-y-1"
    leave-to-class="opacity-0 -translate-y-1"
  >
    <div
      v-if="visible"
      :class="[
        'flex gap-2.5 items-start rounded-lg px-4 py-3 text-sm leading-relaxed mb-4',
        type === 'info' && 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
        type === 'warning' && 'bg-orange-50 border-l-4 border-amber-400 text-amber-900',
        type === 'error' && 'bg-red-50 border-l-4 border-red-500 text-red-900',
      ]"
      role="alert"
    >
      <!-- Info icon -->
      <svg v-if="type === 'info'" class="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <!-- Warning icon -->
      <svg v-else-if="type === 'warning'" class="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <!-- Error icon -->
      <svg v-else-if="type === 'error'" class="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>

      <p class="flex-1 m-0"><slot /></p>

      <button
        v-if="dismissible"
        class="flex-shrink-0 bg-transparent border-none cursor-pointer text-xs opacity-60 hover:opacity-100 p-0 leading-none text-current"
        @click="visible = false"
        aria-label="Cerrar"
      >✕</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  type: 'info' | 'warning' | 'error'
  dismissible?: boolean
}>()

const visible = ref(true)
</script>
